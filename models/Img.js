const mongoose = require('mongoose');

// Modèle de l'image et de ses métadonnées
const ImgSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    date: {type: Date, required: true},
    imagePath: { type: String, required: true },
    // On lie chaque image à un album
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' }
});

module.exports = mongoose.model('Img', ImgSchema);
