import React, { useEffect, useState } from 'react';
import { Avatar, Button, IconButton } from '@mui/material';
import { Edit, Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import Posts from '../../components/Posts';
import Post from '../../components/Post';
import ViewPost from '../../components/ViewPost';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { makeRequest } from '../../axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import EditProfile from './EditProfile';

interface Props {}

interface PostType {
    id: number
    mediaUrl: string
    mediaType: string
    username: string
    desc: string
    userId: string
    createdAt: string
    profilePic: string
    likesCount: number
    commentsCount: number
}


function Profile(props: Props) {
    const [showPost, setShowPost] = useState<PostType | null>(null); 
    const [showEdit, setShowEdit] = useState(false)
    const [username, setUserName] = useState("")
    const [profilePicUrl, setProfilePicUrl] = useState<string>("")
    const isAuthenticated = useSelector((state: RootState) => state.auth.currentUser);
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);
    const userId = useParams()

    // const navigate = useNavigate()

    // if (!isAuthenticated) {
    //   window.location.href = "/login"
    // }
    // // useEffect(() => {
    // //     // Check if the user is already authenticated, and if so, redirect to homepage.
    // //     }
    // //   }, [isAuthenticated, navigate]);
    
    const { isLoading, error, data } = useQuery(['user'], () => 
        makeRequest.get("/users/find/" + userId.id).then((res)=>{
            console.log(res.data)
            setUserName(res.data.username)
            setProfilePicUrl(res.data.profilePic)
            return res.data;
        })
    )    

    const { isLoading: postsLoading, error: postsError, data: userPosts } = useQuery<PostType[]>(['userPosts', userId.id], () =>
        makeRequest.get(`/posts/user/${userId.id}`).then((res) => {
            console.log(res.data);
            return res.data;
        })
    );

    const openPost = (post: PostType) => {
        setShowPost(post);
    };

    const closePost = () => {
        setShowPost(null);
    };
    
    const queryClient = useQueryClient();

    const userData: any = queryClient.getQueryData(['user']); // Access the same 'user' query

    // Function to delete a post
    const deletePost = (postId: number) => {
        // Remove the post from the local state
        const updatedData = userPosts?.filter((post) => post.id !== postId);
        // Update the data using React Query's cache
        queryClient.setQueryData(['posts'], updatedData);
    };

    const handleShowEdit = () => {
        setShowEdit(true)
    }


    return (
        <>
        {showEdit && <EditProfile setShowEdit={setShowEdit} prevUserName={username} picture={profilePicUrl}/>}
        <div className={`bg-${isDarkMode ? 'gray-900' : 'gray-100'} min-h-screen`} style={{marginTop: '76px'}}>
            {/* Cover Photo */}
            <div className={`h-40 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-300'}`}></div>


            {/* Profile Info */}
            <div className="relative -mt-16 mx-4 flex justify-center items-center">
            <Avatar
                    className="w-20 h-20 border-4 border-white"
                    src={profilePicUrl || undefined} // Set the src attribute based on profilePicUrl
                />

                <div className="ml-4">
                    <h1 className="text-2xl font-semibold">{username && username}</h1>
                    <p className="text-gray-600">@{username && username}</p>
                    
                </div>
            </div>

            {/* Social Media Links */}
            <div className="flex justify-center mt-4 space-x-4">
                {/* <IconButton ><Facebook className={`${isDarkMode ? 'text-white' : 'bg-white'}`} /></IconButton>
                <IconButton><Twitter  className={`${isDarkMode ? 'text-white' : 'bg-white'}`} /></IconButton>
                <IconButton><Instagram className={`${isDarkMode ? 'text-white' : 'bg-white'}`}  /></IconButton>
                <IconButton><LinkedIn  className={`${isDarkMode ? 'text-white' : 'bg-white'}`} /></IconButton> */}
            </div>
            <div className="flex justify-center mt-2">
                <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    className="transition duration-300 bg-transparent hover:bg-blue-500 hover:text-white border-blue-500 text-blue-500 hover:border-transparent"
                    onClick={handleShowEdit}
                >
                    Edit Profile
                </Button>
            </div>
            {/* User Posts */}
            <div>
                {showPost ? (
                    <ViewPost post={showPost} onClose={closePost} onDeletePost={deletePost} />
                ) : (

                <div className="p-4">
                    {postsLoading ? (
                        "Loading..."
                    ) : postsError ? (
                        "An error occurred while fetching posts."
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4 p-4 sm:grid-cols-1">
                            {userPosts?.map((post: PostType) => (
                                <Post key={post.id} post={post} name={username} pic={profilePicUrl} onClick={()=>openPost(post)}/>
                            ))}
                        </div>
                    )}
                </div>
                )}
            </div>
        </div>
        </>
    );
}

export default Profile;
