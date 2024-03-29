import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { FavoriteBorderOutlined, Edit, Delete, Lock, CloudDownload, ChatBubbleOutline, Favorite, Close } from '@mui/icons-material';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined"
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined"
import { makeRequest } from '../../axios';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../store/userSlice';


interface Props {
    setShowEdit: any
    prevUserName: string
    picture: string
}

interface User {
  id: number
}

function EditProfile(props: Props) {
  const currentUserString = sessionStorage.getItem('currentUser');
  const currentUser: User | null = currentUserString ? JSON.parse(currentUserString) : null;
    const {setShowEdit, prevUserName, picture} = props
    const [newUsername, setNewUsername] = useState("");
    const [newProfilePic, setNewProfilePic] = useState<File | null>(null); 
    const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
      null
    );
    const [err, SetErr] = useState("")
    
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode)

    const queryClient = useQueryClient()

    const dispatch = useDispatch()

    const userData: any = queryClient.getQueryData(['user']); // access the same 'user' query

    console.log(userData.profilePic)

    useEffect(() => { 
      //  set the initial state of the form fields
      setNewUsername(prevUserName);
      setProfilePicPreview(picture);
    }, [prevUserName, picture]);

    const handleShow = () => {
        setShowEdit(false)
    }

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const selectedFile = files[0];
        // update the profile picture preview
        setProfilePicPreview(URL.createObjectURL(selectedFile));
        // update the profile picture file state
        setNewProfilePic(selectedFile);
      }
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewUsername(e.target.value); // update the new username state
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
      try {
        // FormData for handling the file upload
        const formData = new FormData();
        formData.append("username", newUsername);
        if (newProfilePic) {
          formData.append("profilePic", newProfilePic);
        }
    
        
        await makeRequest.put("/users", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
    
        // invalidating the 'user' query to trigger a refetch
        queryClient.invalidateQueries(["user"]);
        queryClient.invalidateQueries(["nav"]);
        
    
        // if (newProfilePic) {
        //   // let profilePics = JSON.stringify(newProfilePic)

        //   dispatch(updateUser({ id: currentUser && currentUser.id, username: newUsername, profilePic: userData.profilePic, userNameChange: true }));
        // } else {
        //   dispatch(updateUser({ id: currentUser && currentUser.id, username: newUsername, profilePic: picture, userNameChange: true }));
        // }
        dispatch(updateUser({ id: currentUser && currentUser.id, username: newUsername }));

    
        if (newUsername.length === 0) {
          console.log("error")
        } else {
          setShowEdit(false);
        }
      } catch (error: any) {
        console.log(error.response.data)
        SetErr(error.response.data)

      }
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
        {/* {profilePicPreview && (
              <img
                src={profilePicPreview}
                alt="Profile Preview"
                className="mt-2 w-16 h-16 rounded-full object-cover"
              />
            )} */}
          </div>
          <strong className='text-red-500'>{err}</strong>
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
