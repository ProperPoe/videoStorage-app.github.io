import React from 'react';
import { Avatar } from '@mui/material';

interface Props {
  user: string;
  text: string;
}

function Comment(props: Props) {
    const {user, text} = props

    return (
        <div className="flex items-center mb-2">
        <Avatar alt={user} src={`https://via.placeholder.com/40`} sx={{ width: 40, height: 40, marginRight: 2 }} />
        <span className="font-semibold">{user}:</span>
        <p className="text-gray-600 ml-2">{text}</p>
      </div>
    )
}

export default Comment