const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const albumRoutes = require("./routes/album");
const path = require("path");
const app = express();
// Connexion à MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/phototheque"; 
console.log("🔗 MONGO_URI utilisé :", process.env.MONGO_URI);
mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ Connexion avec la base de données MongoDb réussie !!!!!!!!!!!!!!!"))
  .catch(err => console.error("❌ Erreur de connexion MongoDB :", err));
// Configuration de EJS
app.set("view engine", "ejs");
// Middleware pour lire le contenu des requêtes
app.use(bodyParser.urlencoded({ extended: true }));
// Servir les dossiers statiques
app.use(express.static(path.join(__dirname, "public")));
//app.use('/uploads', express.static('uploads'));
// Utiliser les routes
app.use('/albums', albumRoutes);
app.get("/", (req, res) => {
  res.redirect("/albums");
});
// Lancement du serveur web
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port: ${PORT}`);
});
