import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            <span className="logo-text">SwyPhex</span>
          </h1>
          <p className="auth-subtitle">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Tu contraseña"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-divider">
          <span>¿No tienes una cuenta?</span>
        </div>

        <Link to="/register" className="btn btn-outline btn-block">
          Registrarse en SwyPhex
        </Link>

        <div className="auth-footer">
          <p className="terms">
            Al continuar, aceptas los{' '}
            <Link to="/terms">Términos de Servicio</Link> y{' '}
            <Link to="/privacy">Política de Privacidad</Link> de SwyPhex.
          </p>
        </div>
      </div>

      <div className="auth-features">
        <h2>Todo tu música, en un solo lugar</h2>
        <ul className="features-list">
          <li>🎵 Descubre millones de canciones</li>
          <li>🎧 Crea tus propias playlists</li>
          <li>📱 Escucha en cualquier dispositivo</li>
          <li>⭐ Guarda tus canciones favoritas</li>
          <li>🎨 Comparte tu música con el mundo</li>
        </ul>
      </div>
    </div>
  );
};

export default Login;
