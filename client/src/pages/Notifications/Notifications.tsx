import React from 'react';
import Notification from './Notification';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const sampleNotifications = [
    { id: 1, username: 'User123', likedContent: 'Your awesome photo', timestamp: '2 hours ago' },
    { id: 2, username: 'User456', likedContent: 'Your post about nature', timestamp: '5 hours ago' },
];

function Notifications() {
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);

    return (
        <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen p-8`}>
            <h1 className={`${isDarkMode ? 'text-white' : ''} text-3xl font-semibold mb-4`}>Notifications</h1>
            <div className="space-y-4">
                {sampleNotifications.map(notification => (
                    <Notification key={notification.id} notification={notification} />
                ))}
            </div>
        </div>
    );
}

export default Notifications;
