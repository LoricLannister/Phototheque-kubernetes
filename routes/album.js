const express = require("express");
const router = express.Router();
const multer = require("multer");
const Img = require("../models/Img");
const Album = require("../models/Album");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
// Afficher les albums et leur dernière image
router.get("/", async (req, res) => {
  try {
    const searchQuery = req.query.search || ""; // Les caractères que doivent contenir les résultats
    const albums = await Album.find({ title: { $regex: searchQuery, $options: 'i' } })
            .populate('imgs')
            .exec();
    const results = albums.map((album) => {
      const lastImg =
        album.imgs.length > 0
          ? album.imgs[album.imgs.length - 1]
          : {
              imagePath: "/no-results.jpg",
              title: "Cet album est vide",
              date: new Date(),
            };
      return { ...album._doc, lastImg };
    });
    //console.log(results)
    res.status(200).render("albums", {
      albums: results,
      searchQuery,
      cssFile: "album.css",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Une erreur est survenue ..." });
  }
});
// Afficher le formulaire pour ajouter un nouvel album
router.get("/new", (req, res) => {
  res.render("new_album", { cssFile: "new_img.css" });
});
// Ajouter un nouvel album
router.post("/new", async (req, res) => {
  try {
    const newAlbum = new Album({ title: req.body.title });
    await newAlbum.save();
    res.redirect("/albums");
  } catch (err) {
    //console.error(err);
    res.status(500).json({ error: "Une erreur est survenue ..." });
  }
});
// Afficher les images d'un album spécifique
router.get("/:albumId/imgs", async (req, res) => {
  try {
    const album = await Album.findById(req.params.albumId)
      .populate("imgs")
      .exec();
    if (!album) {
      return res.status(404).json({ message: "Album non trouvé" });
    }
    res.render("album_imgs", { album, cssFile: "album_imgs.css" });
  } catch (err) {
    //console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// Afficher le formulaire pour ajouter une photo à un album
router.get("/newImgs/:albumId/:albumTitle", async (req, res) => {
  const albumId = req.params.albumId;
  const albumTitle = req.params.albumTitle;
  res.render("new_img", { albumId, cssFile: "new_img.css", albumTitle });
});
// Enregistrer les images dans un album précis
router.post("/imgs/:albumId", upload.single("image"), async (req, res) => {
  try {
    const albumId = req.params.albumId;
    const { title, description } = req.body;
    const imagePath = `/uploads/${req.file.filename}`;
    const date = Date.now();
    const newImg = new Img({
      title,
      description,
      date,
      imagePath,
      album: albumId,
    });
    await newImg.save();
    // Ajouter la nouvelle photo à l'album
    const album = await Album.findById(albumId);
    // Si l'album n'existe pas on ne sait enregistrer
    if (!album) {
      return res
        .status(404)
        .json({ message: "Aucun album correspondant trouvé" });
    }
    // Si l'album existe on n'y ajoute une image
    album.imgs.push(newImg);
    await album.save();
    res.redirect("/albums");
  } catch (err) {
    //console.error(err);
    res.status(500).json({ error: "Une erreur est survenue ..." });
  }
});
// Afficher le formulaire de mise à jour des métadonnées d'une image
router.get("/editImg/:imgId", async (req, res) => {
  try {
    const img = await Img.findById(req.params.imgId);
    if (!img) {
      return res.status(404).json({ message: "Image non trouvée" });
    }
    res.render("edit_img", { img, cssFile: "new_img.css" });
  } catch (err) {
    //console.error(err);
    res.status(500).json({ error: "Une erreur est survenue ..." });
  }
});
// Route utilisée par le formulaire pour mettre à jour des métadonnées d'une image
router.post("/editImg/:imgId", async (req, res) => {
  try {
    const { title, description } = req.body;
    const img = await Img.findByIdAndUpdate(
      req.params.imgId,
      { title, description },
      { new: true }
    );
    if (!img) {
      return res.status(404).json({ message: "Image non trouvée" });
    }
    res.redirect("/albums"); // Redirection vers la liste des albums après la modification
  } catch (err) {
    //console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// Supprimer une image
router.post("/deleteImg/:imgId", async (req, res) => {
  try {
    const imgId = req.params.imgId;
    const img = await Img.findByIdAndDelete(imgId);
    if (!img) {
      return res.status(404).json({ message: "Image non trouvée" });
    }

    // Supprimer la référence de l'image dans l'album
    await Album.updateOne({ imgs: imgId }, { $pull: { imgs: imgId } });

    res.redirect("/albums"); // Redirection vers la liste des albums mise à jour
  } catch (err) {
    //console.error(err);
    res.status(500).json({ error: "Une erreur est survenue ..." });
  }
});
// Route pour supprimer un album (l'interface ne supprime un album que si celui ci est vide)
router.post('/delete/:id', async (req, res) => {
  try {
      const albumId = req.params.id;
      await Album.findByIdAndDelete(albumId);
      res.redirect('/albums');
  } catch (error) {
      res.status(500).send(error.message);
  }
});

module.exports = router;
