import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  currentUser: string | null; 
}
const currentUserJSON = sessionStorage.getItem('currentUser');

const initialState: AuthState = {
  
  currentUser: currentUserJSON ? JSON.parse(currentUserJSON) : null, // Load from sessionStorage and convert to object
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => { // Update the action
      state.currentUser = action.payload; // Set currentUser
      sessionStorage.setItem('currentUser', JSON.stringify(action.payload)); // Store in sessionStorage
    },
    logout: (state) => {
      state.currentUser = null; // Set currentUser to null
      sessionStorage.removeItem('currentUser'); // Remove from sessionStorage
    },
  },
});

export const { login, logout } = authSlice.actions;



export default authSlice.reducer;