import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  currentUser: string | null; 
}
const currentUserJSON = localStorage.getItem('currentUser');

const initialState: AuthState = {
  
  currentUser: currentUserJSON ? JSON.parse(currentUserJSON) : null, // Load from localStorage and convert to object
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => { // Update the action
      state.currentUser = action.payload; // Set currentUser
      localStorage.setItem('currentUser', JSON.stringify(action.payload)); // Store in localStorage
    },
    logout: (state) => {
      state.currentUser = null; // Set currentUser to null
      localStorage.removeItem('currentUser'); // Remove from localStorage
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;