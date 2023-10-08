import React from 'react';
import { Avatar, Card, CardActions, CardContent, CardHeader, IconButton, Typography } from '@mui/material';
import { CommentOutlined, FavoriteBorderOutlined, PlayCircleOutline, FavoriteOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import moment from 'moment';
import { makeRequest } from '../axios';
import { useQuery } from '@tanstack/react-query';


interface PostType {
    id:number
    desc: string
   mediaUrl: string
   mediaType: string
   username: string
   createdAt: string
   profilePic: string
   likesCount: number
   commentsCount: number
}

interface Props {
    post: PostType;
    onClick: () => void;
   
}

function Post(props: Props) {
    const { post, onClick } = props;
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);

    // Define class names based on dark mode
    const cardClassName = `w-81 h-95 shadow-md rounded-md m-4 relative transition transform hover:scale-105 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'} cursor-pointer`;
    const iconColor = isDarkMode ? 'text-white' : 'text-gray-700';

    const { isLoading, error, data} = useQuery(['comments'], ()=>{
        return makeRequest.get(`/comments?postId=${post.id}`).then((res)=>{
            console.log(res.data)
            return res.data;
        })
    })
    // const toggleViewPost = () => {
    //     showPost()
    // }
    // console.log("Media Type:", post.mediaType);
    // console.log("Media URL:", post.mediaUrl);
    return (
        <Card className={cardClassName} onClick={onClick} >
            {/* Thumbnail */}
            <div className="w-full h-56 bg-gray-300 relative">
            {post.mediaType && post.mediaType === 'image' ? (
                <img src={post.mediaUrl} alt="media" className="w-full h-56 bg-gray-300 relative" />
            ) : (
                <video src={post.mediaUrl} className="w-full h-56 bg-gray-300 relative" controls />
            )}
            </div>
            <CardContent className={`p-2 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} m-0` }>
                {/* User Info */}
                <CardHeader
                    avatar={<Avatar src={post.profilePic}/>}
                    title={`${post.username}`}
                    subheader={`${moment(post.createdAt).fromNow()}`}
                    subheaderTypographyProps={{
                        style: {
                            color: isDarkMode ? 'white' : 'gray',
                        },
                    }}
                    className='p-2'
                />
                {/* Likes and Comments */}
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center">
                        <IconButton size="small">
                            <FavoriteBorderOutlined fontSize="small" className={iconColor} />
                        </IconButton>
                        <Typography variant="body2" className={isDarkMode ? 'text-white' : 'text-gray-700'}>{post.likesCount}</Typography>
                    </div>
                    <div className="flex items-center">
                        <IconButton size="small">
                            <CommentOutlined fontSize="small" className={iconColor} />
                        </IconButton>
                        <Typography variant="body2" className={isDarkMode ? 'text-white' : 'text-gray-700'}>{post.commentsCount}</Typography>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default Post;
