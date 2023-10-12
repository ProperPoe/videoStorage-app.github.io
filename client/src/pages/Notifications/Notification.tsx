import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Visibility, Delete } from '@mui/icons-material';
import { makeRequest } from '../../axios';

interface NotificationData {
    id: number;
    fromUserId: number;
    type: string
    username: string
    postId: number
}

interface Props {
    notification: NotificationData;
    notifyCount: (countUpdater: (prevCount: number) => number) => void;
    removeNotification: (notificationId: number) => void
}

function Notification({ notification, notifyCount, removeNotification }: Props) {
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);
    const currentUserString = sessionStorage.getItem("currentUser");
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

    console.log(currentUser)


    const handleSeenClick = () => {
        console.log(notification.fromUserId, notification.postId, notification.type)
        makeRequest.delete(`/count?postId=${notification.postId}&type=${notification.type}&fromUserId=${notification.fromUserId}`);
        

    };
    const handleDeleteClick = () => {
        makeRequest.delete(`/notifications?postId=${notification.postId}&fromUserId=${notification.fromUserId}`);
        makeRequest.delete(`/count?postId=${notification.postId}&type=${notification.type}&fromUserId=${notification.fromUserId}`);
        removeNotification(notification.id)

    };



    return (
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : ''} flex justify-between border-b border-gray-300 py-4`}>
            <div className="">
                <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={`https://i.pravatar.cc/100?u=${notification.id}`}
                    alt={`USERNAMEHERE Avatar`}
                />
                <p className={`text-${isDarkMode ? 'white' : 'gray'}`}>USERNAME</p>
            </div>
            <div className="ml-3 flex flex-col justify-start">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentUser.username === notification.username ? `YOU left a ${notification.type} on your post`
                    :
                    `${notification.username} left a ${notification.type} on your post`
                    }
                </p>
                <p className="text-sm text-gray-500">
                    LIKED CONTENT HERE
                </p>
                <p className="text-xs text-gray-400">TIME STAMPS</p>
            </div>
            <div className="flex justify-end space-x-2">
                {/* Eye Icon */}
                <Visibility className="text-blue-500 cursor-pointer" onClick={handleSeenClick} />
                
                {/* Trash Icon */}
                <Delete className="text-red-500 cursor-pointer" onClick={handleDeleteClick}/>
            </div>
        </div>
    );
}

export default Notification;
