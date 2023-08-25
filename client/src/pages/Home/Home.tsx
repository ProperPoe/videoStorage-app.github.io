import React, { PureComponent } from 'react';
import PostForm from '../../components/PostForm';
import Posts from '../../components/Posts';
import ViewPost from '../../components/ViewPost';

interface Props {}
interface State {}

const samplePosts = [
    { id: 1, title: 'First Post', imageUrl: 'https://example.com/image1.jpg', likes: 10, comments: 5 },
    { id: 2, title: 'Second Post', imageUrl: 'https://example.com/image2.jpg', likes: 20, comments: 8 },
    { id: 3, title: 'Second Post', imageUrl: 'https://example.com/image2.jpg', likes: 20, comments: 8 },
    { id: 4, title: 'Second Post', imageUrl: 'https://example.com/image2.jpg', likes: 20, comments: 8 },
];

class Homepage extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
           <>
            {/* <h1 className="text-3xl font-bold underline">Hiiii!</h1>
            <PostForm/>*/}
            {/* <Posts posts={samplePosts} />  */}
            <ViewPost/>
           </> 
        );
    }
}

export default Homepage;

