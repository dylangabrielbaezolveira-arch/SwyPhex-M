import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSongs } from '../features/songs/songSlice';
import { fetchPopularPlaylists } from '../features/playlists/playlistSlice';
import SongCard from '../components/SongCard';
import PlaylistCard from '../components/PlaylistCard';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { songs, isLoading: songsLoading } = useSelector((state) => state.songs);
  const { popularPlaylists, isLoading: playlistsLoading } = useSelector((state) => state.playlists);

  useEffect(() => {
    dispatch(fetchSongs({ page: 1, limit: 10 }));
    dispatch(fetchPopularPlaylists());
  }, [dispatch]);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            {user ? `Bienvenido de nuevo, ${user.name}` : 'Descubre nueva música'}
          </h1>
          <p className="hero-subtitle">
            Millones de canciones. Gratis en SwyPhex.
          </p>
          {!user && (
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Registrarse Gratis
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* New Releases */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Nuevos lanzamientos</h2>
          <Link to="/browse" className="section-link">Ver todos</Link>
        </div>
        
        {songsLoading ? (
          <div className="loading">Cargando canciones...</div>
        ) : (
          <div className="cards-grid">
            {songs.slice(0, 6).map((song) => (
              <SongCard key={song._id} song={song} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Playlists */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Playlists populares</h2>
          <Link to="/browse" className="section-link">Ver todos</Link>
        </div>
        
        {playlistsLoading ? (
          <div className="loading">Cargando playlists...</div>
        ) : (
          <div className="cards-grid">
            {popularPlaylists.map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature">
          <div className="feature-icon">🎵</div>
          <h3>Sube tu música</h3>
          <p>Comparte tus creaciones con el mundo</p>
          {user ? (
            <Link to="/upload" className="btn btn-outline">Comenzar</Link>
          ) : (
            <Link to="/register" className="btn btn-outline">Regístrate</Link>
          )}
        </div>
        
        <div className="feature">
          <div className="feature-icon">🎧</div>
          <h3>Escucha en cualquier lugar</h3>
          <p>En tu teléfono, tablet o computadora</p>
        </div>
        
        <div className="feature">
          <div className="feature-icon">⭐</div>
          <h3>Crea playlists</h3>
          <p>Guarda tus canciones favoritas</p>
          {user && (
            <Link to="/library?tab=playlists" className="btn btn-outline">Crear playlist</Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
