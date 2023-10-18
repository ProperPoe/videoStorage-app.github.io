import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Home/Home';
import Notifs from './pages/Notifications/Notifications';
import Profile from './pages/Profile/Profile';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import { connect } from 'react-redux';
import { RootState } from './store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { logout } from './store/authSlice'; // Import the logout action
import { makeRequest } from './axios';
import AuthGuard from './components/AuthGuard';


interface Props {
  currentUser: string | null;
  //logout: () => void; // Add the logout action to props
}
interface State {
  searchQuery: string
  notifyCount: number
}

const queryClient = new QueryClient();

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchQuery: '',
      notifyCount: 0
    };
  }
  handleSearch = (searchQuery: string) => {
    console.log('Search query:', searchQuery);
    this.setState({ searchQuery });
  };

  render() {
    const { currentUser } = this.props;
    const { notifyCount } = this.state;



    

    return (
      <QueryClientProvider client={queryClient}>
            <Router>
          {currentUser && <Navbar onSearch={this.handleSearch} notifyCount={notifyCount}  />}{/* Render Navbar only when authenticated */}
          <Routes>
            {/* The first page for non-authenticated users */}
            {!currentUser && 
              <Route path="/" element={<SignUp />}/>}
              <Route path="/login" element={<Login />} />
            {/* Authenticated routes */}

            {currentUser && (
              <>
                <Route path="/" element={<Homepage searchQuery={this.state.searchQuery} />} />
                <Route path="/notifications" element={<Notifs  />} />
                <Route path="/profile/:id" element={<Profile />} />
              </>
            )}
          </Routes>
        </Router>

      </QueryClientProvider>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  currentUser: state.auth.currentUser,
});


// export default connect(mapStateToProps, {logout})(App);
export default connect(mapStateToProps, { logout })(App)