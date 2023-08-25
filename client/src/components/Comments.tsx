import React from 'react';
import Comment from './Comment';

interface Props {
  id: number;
  user: string;
  text: string;
}

interface CommentsProps {
  comments: Props[];
}

function Comments(props: CommentsProps) {
    const {comments} = props

    return (
        <div>
        {comments.map((comment) => (
          <Comment key={comment.id} user={comment.user} text={comment.text} />
        ))}
      </div>
    )
}

export default Comments
