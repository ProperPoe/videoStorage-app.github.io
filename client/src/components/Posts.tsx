import React, { useState } from 'react';
import Post from './Post';
import { makeRequest } from '../axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ViewPost from './ViewPost';


interface PostType {
    id: number
    mediaUrl: string
    mediaType: string
    username: string
    desc: string
    userId: string
    createdAt: string
    profilePic: string
}
interface PostsProps {
    searchQuery: string;
}

function Posts(props: PostsProps) {
    const [showPost, setShowPost] = useState<PostType | null>(null); 
    const [posts, setPosts] = useState<PostType[]>([]);


    
    const { isLoading, error, data } = useQuery<PostType[]>(['posts'], () => {
        return makeRequest.get('/posts').then((res) => {
            console.log(res.data);
            return res.data;
        });
    });

    const queryClient = useQueryClient();


    const openPost = (post: PostType) => {
        setShowPost(post);
    };

    const closePost = () => {
        setShowPost(null);
    };

    // Filter the posts based on the searchQuery
    const filteredData = data?.filter((post) =>
    post.desc.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
    post.username.toLowerCase().includes(props.searchQuery.toLowerCase())
    );

    

    // Function to delete a post
    const deletePost = (postId: number) => {
      // Remove the post from the local state
      const updatedData = data?.filter((post) => post.id !== postId);
      // Update the data using React Query's cache
      queryClient.setQueryData(['posts'], updatedData);
    };

    return (
        <>
            <div>
                {showPost ? (
                    <ViewPost post={showPost} onClose={closePost} onDeletePost={deletePost}/>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4 p-4 sm:grid-cols-1">
                        {isLoading
                            ? "loading.."
                            : filteredData?.map((post) => (
                                <Post key={post.id} post={post} onClick={() => openPost(post)} />
                            ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Posts;
