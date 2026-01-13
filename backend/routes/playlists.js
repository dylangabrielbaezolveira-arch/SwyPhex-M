const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  toggleFollow,
  getPopularPlaylists
} = require('../controllers/playlistController');

router.get('/popular', getPopularPlaylists);
router.get('/my-playlists', protect, getMyPlaylists);
router.get('/:id', getPlaylistById);

router.post('/', protect, createPlaylist);
router.post('/:id/songs', protect, addSongToPlaylist);
router.post('/:id/follow', protect, toggleFollow);

router.delete('/:id/songs/:songId', protect, removeSongFromPlaylist);

module.exports = router;
