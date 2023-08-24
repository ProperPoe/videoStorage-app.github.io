// using functional components for redux store instead of class

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DarkModeState {
  isDarkMode: boolean;
}

const storedDarkMode = localStorage.getItem('darkMode') === 'true';
const initialState: DarkModeState = {
  isDarkMode: storedDarkMode,
};

const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
        const newMode = !state.isDarkMode;
        localStorage.setItem('darkMode', newMode.toString()); // Update local storage
        state.isDarkMode = newMode;
    },
  },
});

export const { toggleDarkMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;
