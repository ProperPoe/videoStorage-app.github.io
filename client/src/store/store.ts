import { configureStore } from '@reduxjs/toolkit';
import darkModeReducer from './darkModeSlice'; 
import authReducer from './authSlice'
import userReducer from './userSlice'
import countReducer from './countSlice'

const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    auth: authReducer,
    user: userReducer,
    count: countReducer,
  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;