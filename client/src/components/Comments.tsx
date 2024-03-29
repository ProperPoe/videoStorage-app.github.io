import React from 'react';
import Comment from './Comment';

interface CommentType {
  id: number;
  username: string;
  desc: string;
  profilePic: string
}

interface CommentsProps {
  comments: CommentType[];
}

function Comments(props: CommentsProps) {
    const {comments} = props

    return (
        <div>
        {comments.map((comment) => (
          <Comment key={comment.id} user={comment.username} text={comment.desc} pic={comment.profilePic} />
        ))}
      </div>
    )
}

export default Comments
