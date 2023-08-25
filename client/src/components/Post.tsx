import React from 'react';
import { Avatar, Card, CardActions, CardContent, CardHeader, IconButton, Typography } from '@mui/material';
import { CommentOutlined, FavoriteBorderOutlined, PlayCircleOutline } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface Props {}

function Post(props: Props) {
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);

    // Define class names based on dark mode
    const cardClassName = `w-64 h-96 overflow-hidden shadow-md rounded-md m-4 relative transition transform hover:scale-105 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`;
    const iconColor = isDarkMode ? 'text-white' : 'text-gray-700';

    return (
        <Card className={cardClassName}>
            {/* Thumbnail */}
            <div className="w-full h-56 bg-gray-300 relative">
                <PlayCircleOutline className="absolute inset-1/2 text-gray-700 text-5xl transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <CardContent className={`p-2 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
                {/* User Info */}
                <CardHeader
                avatar={<Avatar />}
                title="Username"
                subheader="5 minutes ago"
                className="p-2"
                />
                {/* Likes and Comments */}
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center">
                        <IconButton size="small">
                            <FavoriteBorderOutlined fontSize="small" className={iconColor} />
                        </IconButton>
                        <Typography variant="body2" className={isDarkMode ? 'text-white' : 'text-gray-700'}>12 Likes</Typography>
                    </div>
                    <div className="flex items-center">
                        <IconButton size="small">
                            <CommentOutlined fontSize="small" className={iconColor} />
                        </IconButton>
                        <Typography variant="body2" className={isDarkMode ? 'text-white' : 'text-gray-700'}>5 Comments</Typography>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default Post;
