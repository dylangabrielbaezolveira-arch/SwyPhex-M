import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadSong } from '../features/songs/songSlice';
import { toast } from 'react-toastify';
import './Upload.css';

const Upload = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.songs);

  const [formData, setFormData] = useState({
    title: '',
    artist: user?.name || '',
    album: '',
    genre: 'Pop'
  });

  const [songFile, setSongFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (e.target.name === 'songFile') {
        setSongFile(file);
      } else {
        setCoverFile(file);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith('audio/')) {
        setSongFile(file);
      } else if (fileType.startsWith('image/')) {
        setCoverFile(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!songFile) {
      toast.error('Por favor selecciona un archivo de audio');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('artist', formData.artist);
    data.append('album', formData.album);
    data.append('genre', formData.genre);
    data.append('songFile', songFile);
    if (coverFile) {
      data.append('coverImage', coverFile);
    }

    try {
      await dispatch(uploadSong(data)).unwrap();
      toast.success('Canción subida exitosamente!');
      
      // Reset form
      setFormData({
        title: '',
        artist: user?.name || '',
        album: '',
        genre: 'Pop'
      });
      setSongFile(null);
      setCoverFile(null);
    } catch (error) {
      toast.error(error || 'Error al subir la canción');
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-header">
        <h1>Subir tu música</h1>
        <p>Comparte tu creatividad con la comunidad de SwyPhex</p>
      </div>

      <div className="upload-container">
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-section">
            <h3>Información de la canción</h3>
            
            <div className="form-group">
              <label htmlFor="title">Título *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Nombre de la canción"
              />
            </div>

            <div className="form-group">
              <label htmlFor="artist">Artista *</label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                required
                placeholder="Nombre del artista"
              />
            </div>

            <div className="form-group">
              <label htmlFor="album">Álbum</label>
              <input
                type="text"
                id="album"
                name="album"
                value={formData.album}
                onChange={handleChange}
                placeholder="Nombre del álbum (opcional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="genre">Género</label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              >
                <option value="Pop">Pop</option>
                <option value="Rock">Rock</option>
                <option value="Hip Hop">Hip Hop</option>
                <option value="Jazz">Jazz</option>
                <option value="Electrónica">Electrónica</option>
                <option value="Reggaetón">Reggaetón</option>
                <option value="Indie">Indie</option>
                <option value="Clásica">Clásica</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Archivos</h3>
            
            <div className="file-upload">
              <h4>Archivo de audio *</h4>
              <div 
                className={`drop-zone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="drop-zone-content">
                  {songFile ? (
                    <>
                      <div className="file-info">
                        <span className="file-icon">🎵</span>
                        <div>
                          <p className="file-name">{songFile.name}</p>
                          <p className="file-size">
                            {(songFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-outline"
                        onClick={() => setSongFile(null)}
                      >
                        Cambiar
                      </button>
                    </>
                  ) : (
                    <>
                      <p>Arrastra tu archivo de audio aquí</p>
                      <p className="drop-zone-sub">o</p>
                      <label htmlFor="songFile" className="btn btn-outline">
                        Seleccionar archivo
                      </label>
                      <input
                        type="file"
                        id="songFile"
                        name="songFile"
                        accept=".mp3,.wav,.flac,.m4a"
                        onChange={handleFileChange}
                        hidden
                      />
                    </>
                  )}
                </div>
                <p className="file-requirements">
                  Formatos aceptados: MP3, WAV, FLAC, M4A. Máximo 50MB
                </p>
              </div>
            </div>

            <div className="file-upload">
              <h4>Portada (opcional)</h4>
              <div className="cover-upload">
                {coverFile ? (
                  <div className="cover-preview">
                    <img 
                      src={URL.createObjectURL(coverFile)} 
                      alt="Portada" 
                      className="cover-image"
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => setCoverFile(null)}
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <>
                    <label htmlFor="coverFile" className="cover-placeholder">
                      <span className="cover-icon">🖼️</span>
                      <span>Seleccionar imagen</span>
                    </label>
                    <input
                      type="file"
                      id="coverFile"
                      name="coverFile"
                      accept="image/*"
                      onChange={handleFileChange}
                      hidden
                    />
                  </>
                )}
                <p className="cover-requirements">
                  PNG, JPG, GIF. Recomendado: 1000x1000px
                </p>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isLoading || !songFile}
            >
              {isLoading ? 'Subiendo...' : 'Subir Canción'}
            </button>
          </div>
        </form>

        <div className="upload-info">
          <h3>Recomendaciones</h3>
          <ul className="info-list">
            <li>Usa un título claro y descriptivo</li>
            <li>Asegúrate de que el archivo de audio esté en buena calidad</li>
            <li>Agrega una portada atractiva para destacar</li>
            <li>Etiqueta correctamente el género musical</li>
            <li>Respeta los derechos de autor</li>
          </ul>
          
          {user?.role === 'artist' && (
            <div className="artist-info">
              <h4>Estado de artista</h4>
              <p>Como artista verificado, tus canciones tendrán mayor visibilidad.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
