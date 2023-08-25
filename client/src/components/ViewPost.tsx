import React, { useState } from 'react';
import { ThumbUp, Edit, Delete, Lock, CloudDownload, ChatBubbleOutline } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Comments from './Comments';

const ViewPost = () => {
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);
    const [showComments, setShowComments] = useState(false); 

    const commentsData = [
      { id: 1, user: 'User1', text: 'Great post!' },
      { id: 2, user: 'User2', text: 'I love this.' },
    ];

    return (
        <div className={`max-w-2xl mx-auto p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'} rounded-lg shadow-md`}>
        {/* Placeholder for video/image */}
        <div
            className="w-full h-60 bg-gray-300 rounded-lg mb-4 flex items-center justify-center text-gray-600"
        >
            <span className="text-5xl">
            <i className="material-icons">videocam</i>
            </span>
        </div>

        {/* Likes section */}
        <div className="flex items-center mb-4">
            <ThumbUp className="text-blue-500 text-lg mr-2 cursor-pointer" />
            <span className="text-gray-400">100 Likes</span>
        </div>

        {/* Actions section */}
        <div className="flex items-center mb-4">
            <Edit className="text-gray-400 text-lg cursor-pointer hover:text-blue-500 mr-4" />
            <Delete className="text-gray-400 text-lg cursor-pointer hover:text-red-500 mr-4" />
            <Lock className="text-gray-400 text-lg cursor-pointer hover:text-blue-500 mr-4" />
            <CloudDownload className="text-gray-400 text-lg cursor-pointer hover:text-green-500" />
        </div>

        {/* Comments section */}
        <div className="flex items-center mb-4" onClick={() => setShowComments(!showComments)} style={{ cursor: 'pointer' }}>
            <ChatBubbleOutline className="text-gray-400 text-lg mr-2" />
            <span className="text-gray-400">10 Comments</span>
        </div>

        {/* Placeholder for comments */}
        <div className="border-t pt-4">
            <div className="flex items-center mb-2">
            <Avatar alt="User" src="https://via.placeholder.com/40" sx={{ width: 40, height: 40, marginRight: 2 }} />
            <span className="font-semibold">Username:</span>
            </div>
            <p className="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
              {/* Conditional rendering of Comments */}
            {showComments && <Comments comments={commentsData} />}
        </div>
    );
};

export default ViewPost;
