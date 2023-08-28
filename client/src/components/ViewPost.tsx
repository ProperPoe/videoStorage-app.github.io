import React, { useState } from 'react';
import { FavoriteBorderOutlined, Edit, Delete, Lock, CloudDownload, ChatBubbleOutline, Favorite, Close } from '@mui/icons-material';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined"
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined"
import { Avatar, Button, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Comments from './Comments';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';

interface PostType{
    id: number
    username: string
    desc: string
}

interface User{
    id: number
}

interface Props{
    post: PostType; 
    onClose: () => void;
}

const ViewPost = (props: Props) => {
    const {post, onClose} = props;
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser: User | null = currentUserString ? JSON.parse(currentUserString) : null;
    const [showComments, setShowComments] = useState(false); 
    const [desc, setDesc] = useState(''); 

    const { isLoading, error, data} = useQuery(['comments'], ()=>{
        return makeRequest.get(`/comments?postId=${post.id}`).then((res)=>{
            return res.data;
        })
    })

    const { isLoading: likeLoading, error: err, data: likesData } = useQuery(["likes", post.id], () => 
    makeRequest.get("/likes?postId=" + post.id).then((res)=>{
        return res.data;
    })    
)

    const queryClient = useQueryClient();

    
    
    const mutation = useMutation(
      () => {
        return makeRequest.post("/comments", {desc, postId: post.id});
      },
      {
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries(["comments"])
        }
      }
    )

    const likeMutation = useMutation((liked: boolean) => {
        if(liked) return makeRequest.delete("/likes?postId=" + post.id);
        return makeRequest.post("/likes", {postId: post.id})
    }, {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["likes"])
        },
    })


    const handleCommentSubmit = (e: any) => {
        e.preventDefault()

        mutation.mutate()
    }

    const handleLike = () => {
        if(currentUser){
            likeMutation.mutate(likesData.includes(currentUser.id))
        }
        
    }

    const toggleViewPost = () => {
        onClose();
    }

    const textFieldStyles = {
        border: '1px solid white', //  border color on comment input textarea
    };

    const labelStyles = {
        color: isDarkMode ? 'blue-dark' : 'blue-light', // Change text color in comment inout
    };
    

    return (
        <div className={`max-w-2xl mx-auto p-8 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md`}>
            {/* Close icon */}
        <button
            className="absolute top-25 right-1 text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={toggleViewPost}
        >
            <Close className="text-2xl" />
        </button>
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
        {isLoading ? "loading" : (currentUser && likesData && likesData.includes(currentUser.id)) ? (
            <FavoriteOutlinedIcon className='text-red-500' onClick={handleLike} />
            ) : (
            <FavoriteBorderOutlinedIcon onClick={handleLike} />
        )}
            <span className="text-gray-400">{likesData && likesData.length}</span>
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
            <span className="font-semibold">Username: {post.username}</span>
            </div>
            <p className="text-gray-400">{post.desc}.</p>
        </div>
        {/* Comment input form */}
        {showComments && (
        <div className="mt-4 flex">
            <input
                type="text"
                placeholder="Add a Comment"
                className={`${isDarkMode ? 'bg-gray-800' : ''} border border-blue-500 rounded-l-lg p-2 focus:outline-none focus:ring focus:border-blue-300 w-full text-blue-500`}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
            />
            <button
                onClick={handleCommentSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg p-2"
            >
                Submit
            </button>
        </div>
        )}
              {/* Conditional rendering of Comments */}
            {showComments && <Comments comments={data}/>}
        </div>
    );
};

export default ViewPost;