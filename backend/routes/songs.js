const express = require('express');
const router = express.Router();
const upload = require('../utils/multerConfig');
const { protect, isArtist } = require('../middleware/auth');
const {
  uploadSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong,
  toggleLike,
  searchSongs
} = require('../controllers/songController');

router.post(
  '/upload',
  protect,
  isArtist,
  upload.fields([
    { name: 'songFile', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  uploadSong
);

router.get('/', getSongs);
router.get('/search', searchSongs);
router.get('/:id', getSongById);
router.put('/:id', protect, isArtist, updateSong);
router.delete('/:id', protect, isArtist, deleteSong);
router.post('/:id/like', protect, toggleLike);

module.exports = router;
