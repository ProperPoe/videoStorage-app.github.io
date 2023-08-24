import { configureStore } from '@reduxjs/toolkit';
import darkModeReducer from './darkModeSlice'; 
import authReducer from './authSlice'

const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;