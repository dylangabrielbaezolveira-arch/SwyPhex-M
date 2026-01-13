const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor ingresa el nombre de la playlist'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  coverUrl: {
    type: String,
    default: 'default-playlist.jpg'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Playlist', playlistSchema);
