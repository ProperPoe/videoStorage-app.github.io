import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Home/Home';
import Notifs from './pages/Notifications/Notifications';
import Profile from './pages/Profile/Profile';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import { connect } from 'react-redux';
import { RootState } from './store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface Props {
  currentUser: string | null;
}
interface State {}

const queryClient = new QueryClient();

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { currentUser } = this.props;

    return (
      <QueryClientProvider client={queryClient}>
        <Router>
          {currentUser && <Navbar />} {/* Render Navbar only when authenticated */}
          <Routes>
            {/* The first page for non-authenticated users */}
            {!currentUser && 
              <Route path="/" element={<SignUp />}/>}
              <Route path="/login" element={<Login />} />
            {/* Authenticated routes */}
            {currentUser && (
              <>
                <Route path="/" element={<Homepage />} />
                <Route path="/notifications" element={<Notifs />} />
                <Route path="/profile" element={<Profile />} />
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

export default connect(mapStateToProps)(App);

