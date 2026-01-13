import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/auth/authSlice';
import playerReducer from '../features/player/playerSlice';
import songReducer from '../features/songs/songSlice';
import playlistReducer from '../features/playlists/playlistSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  player: playerReducer,
  songs: songReducer,
  playlists: playlistReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'player']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
