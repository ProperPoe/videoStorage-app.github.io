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
    showPost: ()=>void;
}



function Posts(props: Props) {
    const { posts, showPost } = props;
    

    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            {posts.map(post => (
                <Post key={post.id} post={post} showPost={showPost} />
            ))}
        </div>
    );
}

export default Posts;
