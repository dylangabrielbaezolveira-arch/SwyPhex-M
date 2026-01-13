const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'songFile') {
      uploadPath = 'uploads/songs/';
    } else if (file.fieldname === 'coverImage') {
      uploadPath = 'uploads/covers/';
    }
    
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generar nombre único
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  // Permitir solo audio y imágenes
  if (file.fieldname === 'songFile') {
    const allowedTypes = ['.mp3', '.wav', '.flac', '.m4a'];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de audio (MP3, WAV, FLAC, M4A)'));
    }
  } else if (file.fieldname === 'coverImage') {
    const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif'];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (JPG, JPEG, PNG, GIF)'));
    }
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB límite
  }
});

module.exports = upload;
