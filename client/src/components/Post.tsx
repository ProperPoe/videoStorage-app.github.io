import React from 'react';
import { Avatar, Card, CardActions, CardContent, CardHeader, IconButton, Typography } from '@mui/material';
import { CommentOutlined, FavoriteBorderOutlined, PlayCircleOutline, FavoriteOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface PostType {
    id:number
   desc: string
   username: string
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

    // const toggleViewPost = () => {
    //     showPost()
    // }

    return (
        <Card className={cardClassName} onClick={onClick} >
            {/* Thumbnail */}
            <div className="w-full h-56 bg-gray-300 relative">
                <PlayCircleOutline className="absolute inset-1/2 text-gray-700 text-5xl transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <CardContent className={`p-2 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} m-0` }>
                {/* User Info */}
                <CardHeader
                    avatar={<Avatar />}
                    title={`${post.username}`}
                    subheader="5 minutes ago"
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
                        <Typography variant="body2" className={isDarkMode ? 'text-white' : 'text-gray-700'}>12</Typography>
                    </div>
                    <div className="flex items-center">
                        <IconButton size="small">
                            <CommentOutlined fontSize="small" className={iconColor} />
                        </IconButton>
                        <Typography variant="body2" className={isDarkMode ? 'text-white' : 'text-gray-700'}>5</Typography>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default Post;
