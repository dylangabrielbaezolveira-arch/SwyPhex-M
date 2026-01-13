const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor ingresa el título de la canción'],
    trim: true
  },
  artist: {
    type: String,
    required: [true, 'Por favor ingresa el nombre del artista']
  },
  album: {
    type: String,
    default: 'Single'
  },
  duration: {
    type: Number, // Duración en segundos
    required: true
  },
  genre: {
    type: String,
    enum: ['Pop', 'Rock', 'Hip Hop', 'Jazz', 'Clásica', 'Electrónica', 'Reggaetón', 'Indie', 'Otro'],
    default: 'Otro'
  },
  fileUrl: {
    type: String,
    required: true
  },
  coverUrl: {
    type: String,
    default: 'default-cover.jpg'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plays: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Song', songSchema);
