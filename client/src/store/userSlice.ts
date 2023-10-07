import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../axios";


const getSessionStorageValue = (key: string, defaultValue: any) => {
    const storedValue = sessionStorage.getItem(key);
    return storedValue !== null ? storedValue : defaultValue;
  };
  
  // Initialize username and profilePic from sessionStorage
  ;

  const initialCurrentUser = JSON.parse(getSessionStorageValue('currentUser', null));



export const fetchUserData = createAsyncThunk("user/fetchUserData", async () => {
    try {
      const response = await makeRequest.get("/users"); // Replace with your backend endpoint
    //   console.log(response.data)
      return response.data; // Assuming the response contains username and profilePic
    } catch (error) {
      throw error;
    }
  });

  const what = sessionStorage.getItem("currentUser")

//   console.log(what)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: initialCurrentUser && initialCurrentUser.id,
        username: initialCurrentUser && initialCurrentUser.username,
        profilePic: initialCurrentUser && initialCurrentUser.profilePic,
    },
    reducers: {
        updateUser: (state, action) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.profilePic = action.payload.profilePic;

            sessionStorage.setItem('currentUser', JSON.stringify({
                id: action.payload.id,
                username: action.payload.username,
                profilePic: action.payload.profilePic,
              }));
        }
    },
    extraReducers: (builder) => {
        // Handle the result of fetchUserData action
        builder.addCase(fetchUserData.fulfilled, (state, action) => {
          // Update user data with data from the backend
          state.username = action.payload.username;
          state.profilePic = action.payload.profilePic;

          sessionStorage.setItem('currentUser', JSON.stringify({
            username: action.payload.username,
            profilePic: action.payload.profilePic,
          }));
        });
      },
})

export const { updateUser } = userSlice.actions;

export default userSlice.reducer