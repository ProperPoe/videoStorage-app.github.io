import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { FavoriteBorderOutlined, Edit, Delete, Lock, CloudDownload, ChatBubbleOutline, Favorite, Close } from '@mui/icons-material';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined"
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined"
import { makeRequest } from '../../axios';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
    setShowEdit: any
}

function EditProfile(props: Props) {
    const {setShowEdit} = props
    const [newUsername, setNewUsername] = useState("");
    const [newProfilePic, setNewProfilePic] = useState<File | null>(null); 
    
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode)

    const queryClient = useQueryClient()

    const handleShow = () => {
        setShowEdit(false)
    }

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        // Only use the first selected file
        setNewProfilePic(files[0]);
      }
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewUsername(e.target.value); // Update the new username state
      console.log(newUsername)
    };

    const handleEditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(newUsername)
      // Create an object to send the updated data
      // const updatedData = {
      //   username: newUsername, // Add username if you want to update it too
      //   profilePic: newProfilePic, // Initialize as null if no new profilePic is selected
      // };
  
      // Create FormData for handling the file upload
      const formData = new FormData();
      formData.append("username", newUsername);
      if (newProfilePic) {
        formData.append("profilePic", newProfilePic);
      }
      
      // Make a PUT request to update the user's profile
      await makeRequest.put("/users", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      // Invalidate the 'user' query to trigger a refetch
      queryClient.invalidateQueries(["user"]);
  
      // Close the edit profile form
      setShowEdit(false);
    }

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'} bg-opacity-80`}>
        <div className={`w-96 p-8 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <button
            className="absolute top-20 right-20 text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={handleShow}
            >
            <Close className="text-3xl" />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Upload New Post</h2>
        <form className="space-y-4" onSubmit={handleEditProfile}>
          <div>
          <input
          type="text"
          placeholder="New Username"
          value={newUsername}
          className={`mt-1 p-3 w-full border rounded-md focus:ring focus:ring-blue-300 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
          }`}
          onChange={handleUsernameChange}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange}
        />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Upload Post
          </button>
        </form>
        </div>
        
      </div>   
    )
}

export default EditProfile
