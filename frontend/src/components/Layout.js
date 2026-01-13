import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import {
  FiHome,
  FiSearch,
  FiMusic,
  FiPlusCircle,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import {
  MdLibraryMusic,
  MdFavorite,
  MdUpload
} from 'react-icons/md';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="layout">
      {/* Sidebar para desktop */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <FiMusic size={28} />
            <span>SwyPhex</span>
          </Link>
        </div>

        <nav className="nav">
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">
                <FiHome size={20} />
                <span>Inicio</span>
              </Link>
            </li>
            <li>
              <Link to="/browse" className="nav-link">
                <FiSearch size={20} />
                <span>Explorar</span>
              </Link>
            </li>
            <li>
              <Link to="/library" className="nav-link">
                <MdLibraryMusic size={20} />
                <span>Tu Biblioteca</span>
              </Link>
            </li>
          </ul>

          {user && (
            <>
              <div className="nav-divider"></div>
              <ul className="nav-links">
                <li>
                  <Link to="/upload" className="nav-link">
                    <MdUpload size={20} />
                    <span>Subir Música</span>
                  </Link>
                </li>
                <li>
                  <Link to="/library?tab=favorites" className="nav-link">
                    <MdFavorite size={20} />
                    <span>Tus Favoritos</span>
                  </Link>
                </li>
                <li>
                  <Link to="/library?tab=playlists" className="nav-link">
                    <FiPlusCircle size={20} />
                    <span>Tus Playlists</span>
                  </Link>
                </li>
              </ul>
            </>
          )}
        </nav>

        {user && (
          <div className="user-section">
            <div className="user-info">
              <img 
                src={user.avatar || 'https://i.pravatar.cc/150?img=12'} 
                alt={user.name}
                className="user-avatar"
              />
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role === 'artist' ? 'Artista' : 'Usuario'}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <FiLogOut size={18} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Sidebar móvil */}
      <div className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
          <FiX size={24} />
        </button>
        <div className="mobile-nav">
          <Link to="/" className="mobile-nav-link" onClick={() => setSidebarOpen(false)}>
            <FiHome size={20} />
            <span>Inicio</span>
          </Link>
          <Link to="/browse" className="mobile-nav-link" onClick={() => setSidebarOpen(false)}>
            <FiSearch size={20} />
            <span>Explorar</span>
          </Link>
          <Link to="/library" className="mobile-nav-link" onClick={() => setSidebarOpen(false)}>
            <MdLibraryMusic size={20} />
            <span>Biblioteca</span>
          </Link>
          {user && (
            <>
              <Link to="/upload" className="mobile-nav-link" onClick={() => setSidebarOpen(false)}>
                <MdUpload size={20} />
                <span>Subir Música</span>
              </Link>
              <Link to="/profile" className="mobile-nav-link" onClick={() => setSidebarOpen(false)}>
                <FiUser size={20} />
                <span>Perfil</span>
              </Link>
              <button onClick={handleLogout} className="mobile-nav-link logout">
                <FiLogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            <form onSubmit={handleSearch} className="search-bar">
              <FiSearch size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar canciones, artistas, álbumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="header-right">
            {!user ? (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">Iniciar Sesión</Link>
                <Link to="/register" className="btn btn-primary">Registrarse</Link>
              </div>
            ) : (
              <div className="user-menu">
                <Link to="/profile" className="user-avatar-btn">
                  <img 
                    src={user.avatar || 'https://i.pravatar.cc/150?img=12'} 
                    alt={user.name}
                  />
                  <span>{user.name}</span>
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Contenido de la página */}
        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
