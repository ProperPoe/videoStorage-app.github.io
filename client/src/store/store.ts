import { configureStore } from '@reduxjs/toolkit';
import darkModeReducer from './darkModeSlice'; 
import authReducer from './authSlice'
import userReducer from './userSlice'

const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    auth: authReducer,
    user: userReducer,
  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;