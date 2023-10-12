import React from 'react';
import { Avatar } from '@mui/material';

interface Props {
  user: string;
  text: string;
  pic: string;
}

function Comment(props: Props) {
    const {user, text, pic} = props
    console.log(pic, text)
    return (
        <div className="flex items-center mb-2 mt-2">
        <Avatar alt={user} src={pic} sx={{ width: 40, height: 40, marginRight: 2 }} />
        <span className="font-semibold">{user}:</span>
        <p className="text-gray-600 ml-2">{text}</p>
      </div>
    )
}

export default Comment