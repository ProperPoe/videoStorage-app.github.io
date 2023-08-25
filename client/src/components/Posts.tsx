import React from 'react';
import Post from './Post';

interface PostType {
    id: number;
    title: string;
    imageUrl: string;
    likes: number;
    comments: number;
}

interface Props {
    posts: PostType[];
}

function Posts(props: Props) {
    const { posts } = props;
    
    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            {posts.map(post => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
}

export default Posts;
