import React, { PureComponent } from 'react';
import PostForm from '../../components/PostForm';
import Posts from '../../components/Posts';
import ViewPost from '../../components/ViewPost';
import { Button } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { RootState } from '../../store/store'; 
import { toggleDarkMode } from '../../store/darkModeSlice'; 
import { connect } from 'react-redux';

// interface Posts {
//     id: number
// }

interface Props {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    searchQuery: string;
}

interface State {
    showPostForm: boolean;
    // posts: Posts[]
}



class Homepage extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showPostForm: false,
            // showPost: false
            // posts: []
        };
    }

    togglePostForm =() => {
        this.setState(prevState => ({
            showPostForm: !prevState.showPostForm
        }))
    }

    // toggleShowPost = () => {
    //     this.setState(prevState => ({
    //         showPost: !prevState.showPost
    //     }))
    // }

    handleClosePostForm = () => {
        this.setState({ showPostForm: false })
    }

    handleSearch = (searchQuery: string) => {
        // Call the callback function passed as a prop
        // if (this.props.onSearch) {
        //   this.props.onSearch(searchQuery);
        // }
        console.log('Search query:', searchQuery);
      };

    //   deletePost = (postId: any) => {
    //     // Implement the logic to delete the post from the posts state
    //     const updatedPosts = this.state.posts.filter((post) => post.id !== postId);
    //     this.setState({ posts: updatedPosts });
    // };

    render() {
        const { isDarkMode, toggleDarkMode } = this.props;
        const { showPostForm } = this.state;
        // const { showPost } = this.state;

        return (
            <div className={`bg-${isDarkMode ? 'gray-900' : 'gray-100'} dark:bg-gray-900 min-h-screen transition-colors duration-300`}>
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
                    {showPostForm ? <PostForm show={this.handleClosePostForm} /> : <Posts searchQuery={this.props.searchQuery}  />}
                </>

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

