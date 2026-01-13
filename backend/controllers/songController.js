const Song = require('../models/Song');
const User = require('../models/User');
const path = require('path');
const fs = require('fs-extra');

// @desc    Subir una nueva canción
// @route   POST /api/songs/upload
// @access  Private/Artist
exports.uploadSong = async (req, res) => {
  try {
    if (!req.files || !req.files.songFile) {
      return res.status(400).json({ message: 'Por favor sube un archivo de audio' });
    }

    const { title, artist, album, genre } = req.body;
    
    // Obtener duración del archivo (simulado - en producción usaría una librería)
    const getDuration = (fileSize) => {
      // Simulación: tamaño promedio de 1MB por 30 segundos
      return Math.round(fileSize / (1024 * 1024) * 30);
    };

    const songFile = req.files.songFile[0];
    const coverImage = req.files.coverImage ? req.files.coverImage[0] : null;

    const song = await Song.create({
      title,
      artist,
      album,
      genre,
      duration: getDuration(songFile.size),
      fileUrl: `/uploads/songs/${songFile.filename}`,
      coverUrl: coverImage ? `/uploads/covers/${coverImage.filename}` : 'default-cover.jpg',
      uploadedBy: req.user.id
    });

    // Actualizar rol del usuario a artista si es la primera canción
    const user = await User.findById(req.user.id);
    if (user.role === 'user') {
      user.role = 'artist';
      await user.save();
    }

    res.status(201).json(song);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al subir la canción' });
  }
};

// @desc    Obtener todas las canciones
// @route   GET /api/songs
// @access  Public
exports.getSongs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const songs = await Song.find()
      .populate('uploadedBy', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Song.countDocuments();

    res.json({
      songs,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener canciones' });
  }
};

// @desc    Obtener canción por ID
// @route   GET /api/songs/:id
// @access  Public
exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id)
      .populate('uploadedBy', 'name avatar')
      .populate('likes', 'name');

    if (!song) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }

    // Incrementar contador de reproducciones
    song.plays += 1;
    await song.save();

    res.json(song);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la canción' });
  }
};

// @desc    Actualizar canción
// @route   PUT /api/songs/:id
// @access  Private/Artist
exports.updateSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }

    // Verificar que el usuario sea el dueño o admin
    if (song.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado para actualizar esta canción' });
    }

    const updatedSong = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedSong);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la canción' });
  }
};

// @desc    Eliminar canción
// @route   DELETE /api/songs/:id
// @access  Private/Artist
exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }

    // Verificar que el usuario sea el dueño o admin
    if (song.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado para eliminar esta canción' });
    }

    // Eliminar archivos físicos
    if (song.fileUrl && song.fileUrl !== 'default-cover.jpg') {
      const filePath = path.join(__dirname, '..', song.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await song.deleteOne();

    res.json({ message: 'Canción eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la canción' });
  }
};

// @desc    Toggle like en canción
// @route   POST /api/songs/:id/like
// @access  Private
exports.toggleLike = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }

    const alreadyLiked = song.likes.includes(req.user.id);

    if (alreadyLiked) {
      // Quitar like
      song.likes = song.likes.filter(
        userId => userId.toString() !== req.user.id
      );
    } else {
      // Agregar like
      song.likes.push(req.user.id);
    }

    await song.save();

    // Actualizar favorites del usuario
    const user = await User.findById(req.user.id);
    if (alreadyLiked) {
      user.favorites = user.favorites.filter(
        songId => songId.toString() !== req.params.id
      );
    } else {
      user.favorites.push(req.params.id);
    }
    await user.save();

    res.json({
      liked: !alreadyLiked,
      likesCount: song.likes.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar like' });
  }
};

// @desc    Buscar canciones
// @route   GET /api/songs/search
// @access  Public
exports.searchSongs = async (req, res) => {
  try {
    const { q, genre, sort } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { artist: { $regex: q, $options: 'i' } },
        { album: { $regex: q, $options: 'i' } }
      ];
    }

    if (genre && genre !== 'Todos') {
      query.genre = genre;
    }

    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { plays: -1 };
        break;
      case 'likes':
        sortOption = { likes: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const songs = await Song.find(query)
      .populate('uploadedBy', 'name avatar')
      .sort(sortOption)
      .limit(50);

    res.json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar canciones' });
  }
};
