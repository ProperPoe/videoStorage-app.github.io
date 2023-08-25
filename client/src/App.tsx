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

interface Props {
  isAuthenticated: boolean;
}
interface State {}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isAuthenticated } = this.props;

    return (
      <Router>
        {isAuthenticated && <Navbar />} {/* Render Navbar only when authenticated */}
        <Routes>
          {/* The first page for non-authenticated users */}
          {!isAuthenticated && 
            <Route path="/" element={<SignUp />}/>}
            <Route path="/login" element={<Login />} />
          {/* Authenticated routes */}
          {isAuthenticated && (
            <>
              <Route path="/" element={<Homepage />} />
              <Route path="/notifications" element={<Notifs />} />
              <Route path="/profile" element={<Profile />} />
            </>
          )}
          </Routes>
      </Router>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(App);

