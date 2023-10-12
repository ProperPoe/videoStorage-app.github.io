import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import store, { AppDispatch, RootState } from '../store/store';
import { toggleDarkMode } from '../store/darkModeSlice';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { Menu, MenuItem, IconButton, Popover } from '@mui/material';
import { Home, Person, Notifications, Search, Menu as MenuIcon, AccountCircle, FiberManualRecord, ExitToApp, WindowSharp } from '@mui/icons-material';
import Homepage from '../pages/Home/Home';
import Profile from '../pages/Profile/Profile';
import Notifs from '../pages/Notifications/Notifications';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../axios';
import { updateUser } from '../store/userSlice';
import { fetchCount } from '../store/countSlice';

interface Props {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onSearch: (searchQuery: string) => void;
  notifyCount: number;
  user: {
    id: number;
    username: string;
    profilePic: string | null;
  };
  fetchCount: () => void;
  count: number;
}

const Navbar: React.FC<Props> = (props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);
  const [anchorLogoutMenu, setAnchorLogoutMenu] = useState<HTMLElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [count, setCount] = useState<number | undefined>(undefined);
  
    // Create a useEffect to fetch the count when the component mounts
    useEffect(() => {
      props.fetchCount(); // Assuming fetchCount dispatches the action to get the count
    }, []);
  
    // Use this useEffect to update the local state when props.count changes
    useEffect(() => {
      if (props.count !== undefined) {
        setCount(props.count);
      }
    }, [props.count]);
  

  const navigate = useNavigate();

  const toggleDarkMode = () => {
    props.toggleDarkMode();
  };

  const handleLogoutView = (event: React.MouseEvent<HTMLElement>) => {
    setIsLogoutMenuOpen(!isLogoutMenuOpen);
    const shouldOpenMenu = anchorLogoutMenu !== event.currentTarget;
    setAnchorLogoutMenu(shouldOpenMenu ? event.currentTarget : null);
  };

  const handleConfirmLogout = () => {
    makeRequest.post('/auth/logout').then((res) => {
      sessionStorage.removeItem('currentUser');
      window.location.href = '/login'; // Use navigate to redirect
    });
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    if (props.onSearch) {
      props.onSearch(searchQuery);
    }
    navigate('/')
  };

  const handleLogo = () => {
    window.location.href = "/"
  };

  return (
    <>
      <div className={`bg-gray-800 py-4 ${props.isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <IconButton
              sx={{ color: props.isDarkMode ? 'white' : 'black', fontSize: '24px' }}
              color="inherit"
              edge="start"
              aria-label="menu"
              aria-controls="menu"
              aria-haspopup="true"
              onClick={(event) => setAnchorEl(event.currentTarget)}
            >
              <MenuIcon />
            </IconButton>
            <div className={`text-xl font-bold cursor-pointer ${props.isDarkMode ? 'text-white' : 'text-black'}`} onClick={handleLogo}>
              ClipFlow
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-white space-x-4 lg:flex hidden">
              <Link to="/" className={`hover:text-blue-400 transition duration-300 hover:underline hover:scale-110 ${props.isDarkMode ? 'text-white' : 'text-black'}`}>
                <Home />
              </Link>
              <Link
                to={`/profile/${props.user.id}`}
                className={`hover:text-blue-400 transition duration-300 hover:underline hover:scale-110 ${props.isDarkMode ? 'text-white' : 'text-black'}`}
              >
                <Person />
              </Link>
              <Link
                to="/notifications"
                className={`hover:text-blue-400 transition duration-300 hover:underline hover:scale-110 relative ${props.isDarkMode ? 'text-white' : 'text-black'}`}
              >
                <Notifications />
                {props.count > 0 && (
                  <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs absolute top-0 right-1 transform translate-x-1/2 -translate-y-1/2">
                    {props.count}
                  </span>
                )}
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex flex-col lg:items-start items-center">
                {!props.user.profilePic ? (
                  <AccountCircle className={`text-gray-500 ${props.isDarkMode ? 'text-white' : 'text-black'}`} fontSize="small" />
                ) : (
                  props.user.profilePic && (
                    <img src={props.user.profilePic} alt={`${props.user.username}'s profile`} className="w-5 h-5 rounded-full" />
                  )
                )}
                <div className="flex items-center">
                  <span
                    className={`cursor-pointer hover:text-blue-400 transition duration-300 hover:underline hover:scale-105 text-sm ${props.isDarkMode ? 'text-white' : 'text-black'}`}
                    onClick={handleLogoutView}
                  >
                    {props.user.username}
                  </span>
                  <div className="flex items-center">
                    <FiberManualRecord className={`${isLogoutMenuOpen ? 'text-red-500' : 'text-green-500'} mr-1`} />
                    <span className={`text-xs ${props.isDarkMode ? 'text-white' : 'text-black'}`}></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:hidden flex">
              <Link
                to="/notifications"
                className={`hover:text-blue-400 transition duration-300 hover:underline hover:scale-110 relative ${props.isDarkMode ? 'text-white' : 'text-black'}`}
              >
                <Notifications />
                {props.count > 0 && (
                  <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs absolute top-0 right-1 transform translate-x-1/2 -translate-y-1/2">
                    {props.count}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {props.isDarkMode ? (
            <DarkModeOutlinedIcon onClick={toggleDarkMode} className="cursor-pointer hover:text-gray-300 transition duration-300 text-white" />
          ) : (
            <WbSunnyOutlinedIcon onClick={toggleDarkMode} className="cursor-pointer hover:text-gray-300 transition duration-300 text-black" />
          )}

          <div className="flex items-center lg:flex hidden">
            <input
              type="text"
              placeholder="Search"
              className={`rounded-l-lg px-3 py-2 ${props.isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'} focus:outline-none`}
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button
              className={`rounded-r-lg px-4 py-2 ${props.isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-200 text-gray-800 hover:bg-blue-300'} bg-blue-500 text-white hover:bg-blue-600 transition duration-300`}
              onClick={handleSearch}
            >
              <Search />
            </button>
          </div>
        </div>
      </div>

      <Menu id="menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem>
          <input
            type="text"
            placeholder="Search"
            className={`rounded-l-lg px-3 py-2 ${props.isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'} focus:outline-none`}
          />
          <button
            className={`rounded-r-lg px-4 py-2 ${props.isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-200 text-gray-800 hover:bg-blue-300'} bg-blue-500 text-white hover:bg-blue-600 transition duration-300`}
            onClick={handleSearch}
          >
            <Search />
          </button>
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Link to="/">Home</Link>
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Link to={`/profile/${props.user.id}`}>Profile</Link>
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Link to="/notifications">Notifications</Link>
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Link to="/login">Login</Link>
        </MenuItem>
      </Menu>

      {isLogoutMenuOpen && (
        <Popover
          open={isLogoutMenuOpen}
          anchorEl={anchorLogoutMenu}
          onClose={handleLogoutView}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuItem onClick={handleConfirmLogout}>Logout</MenuItem>
        </Popover>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  isDarkMode: state.darkMode.isDarkMode,
  user: state.user,
  count: state.count.count,
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      toggleDarkMode,
      updateUser,
      fetchCount,
    },
    dispatch
  );

// export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
