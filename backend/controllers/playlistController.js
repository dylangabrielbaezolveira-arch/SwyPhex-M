const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

// @desc    Crear playlist
// @route   POST /api/playlists
// @access  Private
exports.createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    const playlist = await Playlist.create({
      name,
      description,
      isPublic,
      createdBy: req.user.id
    });

    // Agregar playlist al usuario
    const user = await User.findById(req.user.id);
    user.playlists.push(playlist._id);
    await user.save();

    res.status(201).json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear playlist' });
  }
};

// @desc    Obtener playlists del usuario
// @route   GET /api/playlists/my-playlists
// @access  Private
exports.getMyPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ createdBy: req.user.id })
      .populate('songs', 'title artist coverUrl duration')
      .sort({ createdAt: -1 });

    res.json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener playlists' });
  }
};

// @desc    Obtener playlist por ID
// @route   GET /api/playlists/:id
// @access  Public
exports.getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('songs', 'title artist album coverUrl duration fileUrl')
      .populate('createdBy', 'name avatar')
      .populate('followers', 'name avatar');

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }

    // Verificar si es privada y no es el dueño
    if (!playlist.isPublic && playlist.createdBy._id.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Playlist privada' });
    }

    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener playlist' });
  }
};

// @desc    Agregar canción a playlist
// @route   POST /api/playlists/:id/songs
// @access  Private
exports.addSongToPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }

    // Verificar permisos
    if (playlist.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Verificar si la canción ya está en la playlist
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ message: 'Canción ya está en la playlist' });
    }

    // Verificar que la canción exista
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar canción' });
  }
};

// @desc    Eliminar canción de playlist
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Private
exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }

    // Verificar permisos
    if (playlist.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    playlist.songs = playlist.songs.filter(
      songId => songId.toString() !== req.params.songId
    );
    await playlist.save();

    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar canción' });
  }
};

// @desc    Toggle follow en playlist
// @route   POST /api/playlists/:id/follow
// @access  Private
exports.toggleFollow = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }

    const alreadyFollowing = playlist.followers.includes(req.user.id);

    if (alreadyFollowing) {
      // Dejar de seguir
      playlist.followers = playlist.followers.filter(
        userId => userId.toString() !== req.user.id
      );
    } else {
      // Seguir
      playlist.followers.push(req.user.id);
    }

    await playlist.save();

    res.json({
      following: !alreadyFollowing,
      followersCount: playlist.followers.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar follow' });
  }
};

// @desc    Obtener playlists populares
// @route   GET /api/playlists/popular
// @access  Public
exports.getPopularPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .sort({ followers: -1 })
      .limit(10)
      .populate('createdBy', 'name avatar')
      .populate('songs', 'title artist coverUrl');

    res.json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener playlists populares' });
  }
};
