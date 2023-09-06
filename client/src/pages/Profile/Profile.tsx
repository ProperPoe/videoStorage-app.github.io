import React, { useState } from 'react';
import { Avatar, Button, IconButton } from '@mui/material';
import { Edit, Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import Posts from '../../components/Posts'; 
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { makeRequest } from '../../axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

interface Props {}

const specificPosts = [
    { id: 1, title: 'First Post', imageUrl: 'https://example.com/image1.jpg', likes: 10, comments: 5 },
    { id: 2, title: 'Second Post', imageUrl: 'https://example.com/image1.jpg', likes: 10, comments: 5 },
    { id: 3, title: 'Third Post', imageUrl: 'https://example.com/image1.jpg', likes: 10, comments: 5 },

]

function Profile(props: Props) {
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);
    const userId = useParams()
    
    const { isLoading, error, data } = useQuery(['user'], () => 
        makeRequest.get("/users/find/" + userId.id).then((res)=>{
            console.log(res.data)
            return res.data;
        })
    )    


    return (
        <div className={`bg-${isDarkMode ? 'gray-900' : 'gray-100'} min-h-screen`}>
            {/* Cover Photo */}
            <div className={`h-40 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-300'}`}></div>


            {/* Profile Info */}
            <div className="relative -mt-16 mx-4 flex justify-center items-center">
                <Avatar className="w-20 h-20 border-4 border-white" />

                <div className="ml-4">
                    <h1 className="text-2xl font-semibold">{data && data.username}</h1>
                    <p className="text-gray-600">@{data && data.username}</p>
                    
                </div>
            </div>

            {/* Social Media Links */}
            <div className="flex justify-center mt-4 space-x-4">
                <IconButton ><Facebook className={`${isDarkMode ? 'text-white' : 'bg-white'}`} /></IconButton>
                <IconButton><Twitter  className={`${isDarkMode ? 'text-white' : 'bg-white'}`} /></IconButton>
                <IconButton><Instagram className={`${isDarkMode ? 'text-white' : 'bg-white'}`}  /></IconButton>
                <IconButton><LinkedIn  className={`${isDarkMode ? 'text-white' : 'bg-white'}`} /></IconButton>
            </div>
            <div className="flex justify-center mt-2">
                <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    className="transition duration-300 bg-transparent hover:bg-blue-500 hover:text-white border-blue-500 text-blue-500 hover:border-transparent"
                >
                    Edit Profile
                </Button>
            </div>
            {/* User Posts */}
            <div className="p-4">
                {/* <Posts posts={specificPosts} /> */}
            </div>
        </div>
    );
}

export default Profile;

