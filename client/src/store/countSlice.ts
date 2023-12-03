import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { makeRequest } from '../axios';
import { ThunkAction } from '@reduxjs/toolkit';


const initialState = {
  count: 0,
};

// Async thunk to fetch the count from the backend
export const fetchCount = createAsyncThunk('count/fetchCount', async () => {
  const response = await makeRequest.get('/count');
  console.log(response.data)
  return response.data.notificationCount;
});

// Count slice with reducer and actions
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
