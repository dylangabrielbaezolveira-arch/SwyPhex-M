import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import Library from './pages/Library';
import Upload from './pages/Upload';
import Playlist from './pages/Playlist';
import SongDetail from './pages/SongDetail';
import Profile from './pages/Profile';
import Search from './pages/Search';

// Components
import Player from './components/Player';
import { checkAuth } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          
          <Route path="/browse" element={
            <Layout>
              <Browse />
            </Layout>
          } />
          
          <Route path="/library" element={
            <Layout>
              <Library />
            </Layout>
          } />
          
          <Route path="/upload" element={
            isAuthenticated ? (
              <Layout>
                <Upload />
              </Layout>
            ) : <Navigate to="/login" />
          } />
          
          <Route path="/playlist/:id" element={
            <Layout>
              <Playlist />
            </Layout>
          } />
          
          <Route path="/song/:id" element={
            <Layout>
              <SongDetail />
            </Layout>
          } />
          
          <Route path="/search" element={
            <Layout>
              <Search />
            </Layout>
          } />
          
          <Route path="/profile" element={
            isAuthenticated ? (
              <Layout>
                <Profile />
              </Layout>
            ) : <Navigate to="/login" />
          } />
        </Routes>
        
        {isAuthenticated && <Player />}
      </div>
    </Router>
  );
}

export default App;
