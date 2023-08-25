import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface NotificationData {
    id: number;
    username: string;
    likedContent: string;
    timestamp: string;
}

interface Props {
    notification: NotificationData;
}

function Notification({ notification }: Props) {
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);

    return (
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : ''} flex justify-center items-center border-b border-gray-300 py-4`}>
            <div className="flex-shrink-0">
                <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={`https://i.pravatar.cc/100?u=${notification.id}`}
                    alt={`${notification.username} Avatar`}
                />
                <p className={`text-${isDarkMode ? 'white' : 'gray'}`}>{notification.username}</p>
            </div>
            <div className="ml-3">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {notification.username} liked your post
                </p>
                <p className="text-sm text-gray-500">
                    {notification.likedContent}
                </p>
                <p className="text-xs text-gray-400">{notification.timestamp}</p>
            </div>
        </div>
    );
}

export default Notification;
