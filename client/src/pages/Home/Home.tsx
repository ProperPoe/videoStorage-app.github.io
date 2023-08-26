import React, { PureComponent } from 'react';
import PostForm from '../../components/PostForm';
import Posts from '../../components/Posts';
import ViewPost from '../../components/ViewPost';
import { Button } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { RootState } from '../../store/store'; 
import { toggleDarkMode } from '../../store/darkModeSlice'; 
import { connect } from 'react-redux';



interface Props {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

interface State {
    showPostForm: boolean;
    showPost: boolean;
}

const samplePosts = [
    { id: 1, title: 'First Post', imageUrl: 'https://example.com/image1.jpg', likes: 10, comments: 5 },
    { id: 2, title: 'Second Post', imageUrl: 'https://example.com/image2.jpg', likes: 20, comments: 8 },
    { id: 3, title: 'Second Post', imageUrl: 'https://example.com/image2.jpg', likes: 20, comments: 8 },
    { id: 4, title: 'Second Post', imageUrl: 'https://example.com/image2.jpg', likes: 20, comments: 8 },
];

class Homepage extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showPostForm: false,
            showPost: false
        };
    }

    togglePostForm =() => {
        this.setState(prevState => ({
            showPostForm: !prevState.showPostForm
        }))
    }

    toggleShowPost = () => {
        this.setState(prevState => ({
            showPost: !prevState.showPost
        }))
    }

    handleClosePostForm = () => {
        this.setState({ showPostForm: false })
    }

    render() {
        const { isDarkMode, toggleDarkMode } = this.props;
        const { showPostForm } = this.state;
        const { showPost } = this.state;

        return (
            <div className={`bg-${isDarkMode ? 'gray-900' : 'gray-100'} dark:bg-gray-900 min-h-screen transition-colors duration-300`}>
                {showPost === false ? (
                <>
                    <div className={`flex justify-end p-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        <Button
                            variant="contained"
                            startIcon={<AddCircleOutline />}
                            onClick={this.togglePostForm}
                            className={`bg-blue-500 hover:bg-blue-600 text-white transition duration-300 ${isDarkMode ? 'bg-blue-700' : 'bg-blue-500'}`}
                        >
                            Create New Post
                        </Button>
                    </div>
                    {showPostForm ? <PostForm show={this.handleClosePostForm} /> : <Posts showPost={this.toggleShowPost} posts={samplePosts} />}
                </>
                ):(
                    <ViewPost showPost={this.toggleShowPost} />
                )}

            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkMode.isDarkMode,
});

const mapDispatchToProps = {
    toggleDarkMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);

