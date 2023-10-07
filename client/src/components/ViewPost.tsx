import React, { useState } from 'react';
import { FavoriteBorderOutlined, Edit, Delete, Lock, CloudDownload, ChatBubbleOutline, Favorite, Close } from '@mui/icons-material';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined"
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined"
import { Avatar, Button, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Comments from './Comments';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../axios';
import EditPost from './EditPost';
import { fetchCount } from '../store/countSlice';
import { ThunkDispatch } from '@reduxjs/toolkit'


//type UpdateDescFunction = (newDesc: string) => void;

interface PostType{
    id: number
    username: string
    desc: string
    userId: string
}

interface User{
    id: number
}

interface Props{
    post: PostType; 
    onClose: () => void;
    onDeletePost: (postId: any) => void
}

const ViewPost = (props: Props) => {
    const {post, onClose, onDeletePost} = props;
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);
    const currentUserString = sessionStorage.getItem('currentUser');
    const currentUser: User | null = currentUserString ? JSON.parse(currentUserString) : null;
    const [showComments, setShowComments] = useState(false); 
    const [desc, setDesc] = useState(""); 
    const [postDesc, setPostDesc] = useState(post.desc); 
    const [showEdit, setShowEdit] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();

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

    const likeMutation = useMutation(async (liked: boolean) => {
        if (liked) {
            await makeRequest.delete("/likes?postId=" + post.id);
            await makeRequest.delete("/notifications?postId=" + post.id);
        } else {
            await makeRequest.post("/likes", { postId: post.id });
        }
    }, {
        onSuccess: (data, variables, context) => {
    
            // Invalidate and refetch
            queryClient.invalidateQueries(["likes"]);

        },
    })


    const handleCommentSubmit = async (e: any) => {
        e.preventDefault();
    
        mutation.mutate();
    
        try {
                await makeRequest.post("/notifications", {
                fromUserId: currentUser?.id,
                toUserId: post.userId,
                type: 'comment',
                postId: post.id,
            });
    
            makeRequest.post("/count", { toUserId: post.userId, type: 'comment', postId: post.id});

            dispatch(fetchCount())
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    };
    
    const handleLike = async () => {
        if (currentUser) {
            likeMutation.mutate(likesData.includes(currentUser.id));
            
            try {
                    await makeRequest.post("/notifications", {
                    fromUserId: currentUser.id,
                    toUserId: post.userId,
                    type: 'like',
                    postId: post.id,
                });
    
                makeRequest.post("/count", { toUserId: post.userId, type: 'like', postId: post.id, fromUserId: currentUser.id});

                dispatch(fetchCount())
            } catch (error) {
                console.error('Error creating notification:', error);
            }
        }
    };

    const toggleViewPost = () => {
        onClose();
    }
    const handleShowEdit = () => {
        if(!showEdit){
            setShowEdit(true)
        }else{
            setShowEdit(false)
        }
    }

    const handleDeletePost = async () => {
        try {
          await makeRequest.delete(`/posts/${post.id}`);

          onDeletePost(post.id);
        
          onClose();
        } catch (error) {
          console.error('Error deleting post:', error);
        }
      };

      const updateDesc = (newDesc: string) => {
        setPostDesc(newDesc); // Update the desc in ViewPost
      };
    

    return (
        <>
        {showEdit && <EditPost setShowEdit={setShowEdit} desc={postDesc} postId={post.id} updateDesc={updateDesc} />}
        <div className={`max-w-2xl mx-auto p-8 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md`}>
            {/* Close icon */}
        <button
            className="absolute top-25 right-40 text-gray-400 hover:text-gray-600 cursor-pointer"
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
        <div className="flex items-center mb-4 gap-2">
        {isLoading ? "loading" : (currentUser && likesData && likesData.includes(currentUser.id)) ? (
            <FavoriteOutlinedIcon className='text-red-500' onClick={handleLike} />
            ) : (
                <FavoriteBorderOutlinedIcon onClick={handleLike} />
                )}
            <span className="text-gray-400">{likesData && likesData.length} likes</span>
        </div>

        {/* Actions section */}
        <div className="flex items-center mb-4">
            <Edit className="text-gray-400 text-lg cursor-pointer hover:text-blue-500 mr-4" onClick={handleShowEdit}/>
            <Delete className="text-gray-400 text-lg cursor-pointer hover:text-red-500 mr-4" onClick={handleDeletePost} />
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
            <p className="text-gray-400">{postDesc}</p>
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
        </>
    );
};

export default ViewPost;