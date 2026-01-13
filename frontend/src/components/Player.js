import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiPlay, FiPause, FiSkipBack, FiSkipForward, 
  FiVolume2, FiVolumeX, FiRepeat, FiShuffle 
} from 'react-icons/fi';
import { MdQueueMusic } from 'react-icons/md';
import { 
  playNext, playPrevious, togglePlay, 
  setVolume, toggleShuffle, toggleRepeat 
} from '../features/player/playerSlice';
import './Player.css';

const Player = () => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const {
    currentSong,
    isPlaying,
    volume,
    isShuffled,
    repeatMode,
    queue,
    currentIndex
  } = useSelector((state) => state.player);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Controlar reproducción
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  // Actualizar tiempo actual
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        dispatch(playNext());
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [dispatch, repeatMode]);

  // Controlar volumen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    dispatch(togglePlay());
  };

  const handleNext = () => {
    dispatch(playNext());
  };

  const handlePrevious = () => {
    dispatch(playPrevious());
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    dispatch(setVolume(newVolume));
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentSong) {
    return (
      <div className="player player-empty">
        <div className="player-empty-message">
          <p>Selecciona una canción para reproducir</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={currentSong.fileUrl}
        preload="metadata"
      />
      
      <div className="player">
        <div className="player-info">
          <div className="song-info">
            <img 
              src={currentSong.coverUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'} 
              alt={currentSong.title}
              className="song-cover"
            />
            <div className="song-details">
              <h4 className="song-title">{currentSong.title}</h4>
              <p className="song-artist">{currentSong.artist}</p>
            </div>
          </div>
        </div>

        <div className="player-controls">
          <div className="control-buttons">
            <button 
              className={`control-btn ${isShuffled ? 'active' : ''}`}
              onClick={() => dispatch(toggleShuffle())}
            >
              <FiShuffle size={18} />
            </button>
            
            <button className="control-btn" onClick={handlePrevious}>
              <FiSkipBack size={22} />
            </button>
            
            <button className="play-btn" onClick={handlePlayPause}>
              {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
            </button>
            
            <button className="control-btn" onClick={handleNext}>
              <FiSkipForward size={22} />
            </button>
            
            <button 
              className={`control-btn ${repeatMode !== 'none' ? 'active' : ''}`}
              onClick={() => dispatch(toggleRepeat())}
            >
              <FiRepeat size={18} />
              {repeatMode === 'one' && <span className="repeat-indicator">1</span>}
            </button>
          </div>

          <div className="progress-container">
            <span className="time-current">{formatTime(currentTime)}</span>
            <div className="progress-bar" onClick={handleSeek}>
              <div 
                className="progress-fill" 
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              />
            </div>
            <span className="time-total">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-extra">
          <button className="extra-btn">
            <MdQueueMusic size={20} />
          </button>
          
          <div className="volume-control">
            <button className="volume-btn" onClick={toggleMute}>
              {isMuted || volume === 0 ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;
