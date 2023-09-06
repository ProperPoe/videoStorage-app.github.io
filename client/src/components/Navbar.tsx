import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux';
import store, {AppDispatch, RootState} from '../store/store';
import { toggleDarkMode } from '../store/darkModeSlice';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
//import { HomeOutlined } from '@mui/icons-material';
import {Menu, MenuItem, IconButton, Popover} from '@mui/material'
import {Home, Person, Notifications, Search, Menu as MenuIcon, AccountCircle, FiberManualRecord, ExitToApp} from '@mui/icons-material'
import Homepage from '../pages/Home/Home'
import Profile from '../pages/Profile/Profile'
import Notifs from '../pages/Notifications/Notifications'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../axios';

interface Props {
    isDarkMode: boolean;
    toggleDarkMode: () => void
}
interface State {
    anchorEl: null | HTMLElement;
    notifyCount: number;
    logout: boolean;
    anchorLogoutMenu: HTMLElement | null;
    isLogoutMenuOpen: boolean;
}
interface User{
  id: number
  username: string
}

class Navbar extends PureComponent<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
          anchorEl: null,
          notifyCount: 0,
          logout: false,
          anchorLogoutMenu: null,
          isLogoutMenuOpen: false
        };
      }
      componentDidMount() {
        // Fetch notifications data and update the state with the count
        this.fetchNotificationsData();
    }

    fetchNotificationsData = () => {
        const currentUserString = sessionStorage.getItem('currentUser');
        const currentUser: User | null = currentUserString ? JSON.parse(currentUserString) : null;

        if (currentUser) {
            makeRequest.get(`/notifications?userId=${currentUser.id}`)
                .then((res) => {
                    const notificationsData = res.data;
                    this.setState({ notifyCount: notificationsData.length });
                })
                .catch((error) => {
                    console.error('Error fetching notifications data:', error);
                });
        }
    };
    
      handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({ anchorEl: event.currentTarget });
      };
    
      handleClose = () => {
        this.setState({ anchorEl: null });
      };

      toggleDarkMode = () => {
        this.props.toggleDarkMode();
      }

      handleLogoutView = (event: React.MouseEvent<HTMLElement>) => {
        this.setState((prevState) => ({
          isLogoutMenuOpen: !prevState.isLogoutMenuOpen,
      }));
        // Use a separate variable to toggle the menu
        const shouldOpenMenu = this.state.anchorLogoutMenu !== event.currentTarget;
    
        this.setState({
            anchorLogoutMenu: shouldOpenMenu ? event.currentTarget : null,
        });
    };
    
      handleConfirmLogout = () => {
        sessionStorage.removeItem('currentUser');
        //this.props.navigation.navigate('/')
      };

    render() {
        const {notifyCount} = this.state
        const {anchorEl} = this.state;
        const {anchorLogoutMenu,logout} = this.state;
        const {isDarkMode} = this.props;

        const currentUserString = sessionStorage.getItem('currentUser');
        const currentUser: User | null = currentUserString ? JSON.parse(currentUserString) : null;

        // Define the classes for light and dark modes
        const lightModeClasses = 'bg-white text-black';
        const darkModeClasses = 'bg-gray-700 text-white';

        // Determine which classes to use based on the dark mode state
        const navbarClasses = isDarkMode ? darkModeClasses : lightModeClasses;

 

        return (
            <>
            <div className={`bg-gray-800 py-4 ${navbarClasses}`} >
                <div className='container mx-auto flex justify-between items-center'>
                    <div className='flex items-center'>
                    <IconButton
                        sx={{ color: isDarkMode ? 'white' : 'black', fontSize: '24px' }}
                        color='inherit'
                        edge='start'
                        aria-label='menu'
                        aria-controls='menu'
                        aria-haspopup='true'
                        onClick={this.handleClick}
                    >
                        <MenuIcon />
                    </IconButton>
                    {/* Logo */}
                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Logo</div>


                    </div>
                    {/* Hamburger Icon */}

                    {/* Navigation Links */}
                    <div className='flex items-center space-x-4' >

                      <div className='text-white space-x-4 lg:flex hidden'>
                          <Link to="/" className={`hover:text-blue-400 transition duration-300 hover:underline hover:scale-110 ${isDarkMode ? 'text-white' : 'text-black'}`}><Home/></Link>
                          <Link to="/profile" className={`hover:text-blue-400 transition duration-300 hover:underline hover:scale-110 ${isDarkMode ? 'text-white' : 'text-black'}`}><Person/></Link>
                          <Link to="/notifications" className={`hover:text-blue-400 transition duration-300 hover:underline hover:scale-110 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            <Notifications />
                            {notifyCount > 0 && (
                                <span className="ml-1">{notifyCount}</span>
                            )}
                          </Link>

                          
                            {/* <ExitToApp className={`hover:text-blue-400 transition duration-300 hover:scale-110 ${isDarkMode ? 'text-white' : 'text-black'}`} /> */}
                      </div>

                      <div className="flex items-center space-x-2">
                          <div className='flex flex-col lg:items-start items-center'>
                              <AccountCircle className={`text-gray-500 ${isDarkMode ? 'text-white' : 'text-black'}`} fontSize="small" />
                              <div className="flex items-center">
                                  <span className={`cursor-pointer hover:text-blue-400 transition duration-300 hover:underline hover:scale-105 text-sm ${isDarkMode ? 'text-white' : 'text-black'}`} onClick={this.handleLogoutView}>{currentUser && currentUser.username}</span>
                                  <div className="flex items-center">
                                      <FiberManualRecord className={`${this.state.isLogoutMenuOpen ? 'text-red-500' : 'text-green-500'} mr-1`} />
                                      <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-black'}`}></span>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className='lg:hidden flex'>
                      <Link to="/notifications" className={`hover:text-blue-400 transition duration-300 hover:underline hover:scale-110 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            <Notifications />
                            {notifyCount > 0 && (
                                <span className="ml-1">{notifyCount}</span>
                            )}
                      </Link>
                      </div>
                    </div>
                    {/* Lightmode/Darkmode */}
                    {this.props.isDarkMode ?  (
                        <DarkModeOutlinedIcon onClick={this.toggleDarkMode} className={`cursor-pointer hover:text-gray-300 transition duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                       ):(
                        <WbSunnyOutlinedIcon onClick={this.toggleDarkMode} className={`cursor-pointer hover:text-gray-300 transition duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                    )

                    }

                     {/* Seach Input */}
                     <div className='flex items-center lg:flex hidden'>
                        <input type="text" placeholder='Search' className={`rounded-l-lg px-3 py-2  ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'} focus:outline-none`} />
                        <button className={`rounded-r-lg px-4 py-2 ${isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-200 text-gray-800 hover:bg-blue-300'} bg-blue-500 text-white hover:bg-blue-600 transition duration-300`}><Search /></button>
                     </div>
                </div>
            </div>

            {/* Hamburger Menu */}
            <Menu
                id="menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
                
            >
                <MenuItem>
                    <input
                        type="text"
                        placeholder="Search"
                        className={`rounded-l-lg px-3 py-2 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'} focus:outline-none`}
                    />
                    <button className={`rounded-r-lg px-4 py-2 ${isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-200 text-gray-800 hover:bg-blue-300'} bg-blue-500 text-white hover:bg-blue-600 transition duration-300`}>
                        <Search />
                    </button>
                </MenuItem>
                <MenuItem onClick={this.handleClose}><Link to="/">Home</Link></MenuItem>
                <MenuItem onClick={this.handleClose}><Link to="/profile">Profile</Link></MenuItem>
                <MenuItem onClick={this.handleClose}><Link to="/notifications">Notifications</Link></MenuItem>
                <MenuItem onClick={this.handleClose}><Link to="/login">Login</Link></MenuItem>
            </Menu>

            {/* Logout Menu */}
            {this.state.isLogoutMenuOpen && (
            <Popover
                open={this.state.isLogoutMenuOpen}
                anchorEl={anchorLogoutMenu}
                onClose={this.handleLogoutView}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <MenuItem onClick={this.handleConfirmLogout}>Logout</MenuItem>
            </Popover>
        )}
            </>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkMode.isDarkMode,
  });

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      toggleDarkMode,
    },
    dispatch
  );

export default  connect(mapStateToProps, mapDispatchToProps)(Navbar)
