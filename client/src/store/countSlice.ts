import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { makeRequest } from '../axios';
import { ThunkAction } from '@reduxjs/toolkit';


// Define the initial state with a count property
const initialState = {
  count: 0,
};

// Create an async thunk to fetch the count from the backend
export const fetchCount = createAsyncThunk('count/fetchCount', async () => {
  const response = await makeRequest.get('/count');
  return response.data[0].notificationCount;
});

// Create a count slice with reducer and actions
const countSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCount.fulfilled, (state, action) => {
        state.count = action.payload;
      });
  },
});

export default countSlice.reducer;
