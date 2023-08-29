import React from 'react';
import Notification from './Notification';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { makeRequest } from '../../axios';
import { useQuery } from '@tanstack/react-query';


interface User {
    id: number;
}

interface NotificationType {
    id: number;
}

function Notifications() {
    const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser: User = currentUserString ? JSON.parse(currentUserString) : null;
    const userId = currentUser?.id ?? null;;
    const {isLoading, error, data} = useQuery(["notifications"] , () => 
        makeRequest.get("/notifications?userId=" + userId).then((res) => {
        console.log(res.data)
        return res.data
    })
)
    return (
        <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen p-8`}>
            <h1 className={`${isDarkMode ? 'text-white' : ''} text-3xl font-semibold mb-4`}>Notifications</h1>
            <div className="space-y-4">
                {isLoading? "loading" : data.map((notification: NotificationType) => (
                    <Notification key={notification.id} notification={notification} />
                ))}
            </div>
        </div>
    );
}

export default Notifications;
