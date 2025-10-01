const mongoose = require('mongoose');

// Modèle d'album
const AlbumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imgs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Img' }]
});

module.exports = mongoose.model('Album', AlbumSchema);