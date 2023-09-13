import React, { useState } from 'react';
import Post from './Post';
import { makeRequest } from '../axios';
import { useQuery } from '@tanstack/react-query';
import ViewPost from './ViewPost';


interface PostType {
    id: number
    mediaUrl: string
    mediaType: string
    username: string
    desc: string
    userId: string
}

// interface Props {
//     showPost: ()=>void;
// }





function Posts(props: any) {
    const {  } = props;
    const [showPost, setShowPost] = useState<PostType | null>(null); 
    
    const {isLoading, error, data} = useQuery<PostType[]>(['posts'], () => {
        return makeRequest.get("/posts").then((res)=>{
            console.log(res.data)
            return res.data

        })
    })

    const openPost = (post: PostType) => {
        setShowPost(post);
    };

    const closePost = () => {
        setShowPost(null);
    };


    return (
        <>
        <div>
            {showPost ? (
                <ViewPost post={showPost} onClose={closePost} />
            ) : (
                <div className="grid md:grid-cols-2 gap-4 p-4 sm:grid-cols-1">
                    {isLoading ? "loading.." : data?.map((post) => (
                        <Post key={post.id} post={post} onClick={() => openPost(post)} />
                    ))}
                </div>
            )}
        </div>
        </>
    );
}

export default Posts;
