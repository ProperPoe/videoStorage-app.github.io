import { configureStore, Store } from '@reduxjs/toolkit';
import darkModeReducer, { toggleDarkMode } from '../darkModeSlice';
import authReducer from "../authSlice"
import userReducer from '../userSlice';
import { RootState } from '../store';
import 'jest-localstorage-mock';


describe('darkModeSlice', () => {
    beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock as any as Storage;
  });

  it('should toggle dark mode', () => {
    const store: Store<RootState> = configureStore({
      reducer: { darkMode: darkModeReducer, auth: authReducer, user: userReducer },
    });

    // Initial state should be false (light mode)
    expect(store.getState().darkMode.isDarkMode).toBe(false);

    // Dispatch toggleDarkMode action
    store.dispatch(toggleDarkMode());

    // State should be updated to true (dark mode)
    expect(store.getState().darkMode.isDarkMode).toBe(true);
  });
});