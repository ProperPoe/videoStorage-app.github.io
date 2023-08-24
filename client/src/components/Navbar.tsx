import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
import {Menu, MenuItem, IconButton} from '@mui/material'
import {Home, Person, Notifications, Search, Menu as MenuIcon} from '@mui/icons-material'
import Homepage from '../pages/Home/Home'
import Profile from '../pages/Profile/Profile'
import Notifs from '../pages/Notifications/Notifications'
import { Link } from 'react-router-dom'

interface Props {}
interface State {
    anchorEl: null | HTMLElement;
    darkModeIcon: boolean;
}

class Navbar extends PureComponent<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
          anchorEl: null,
          darkModeIcon: false,
        };
      }
    
      handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({ anchorEl: event.currentTarget });
      };
    
      handleClose = () => {
        this.setState({ anchorEl: null });
      };

      toggleDarkMode = () => {
        this.setState((prevState) => ({
            darkModeIcon: !prevState.darkModeIcon
        }))
      }

    render() {
        const {anchorEl, darkModeIcon} = this.state;

        return (
            <>
            <div className='bg-gray-800 py-4'>
                <div className='container mx-auto flex justify-between items-center'>
                    <div className='flex items-center'>
                        <IconButton
                            sx={{color: 'white', fontSize: '24px'}}
                            color='inherit'
                            edge='start'
                            aria-label='menu'
                            aria-controls='menu'
                            aria-haspopup="true"
                            onClick={this.handleClick}
                        >
                            <MenuIcon />
                        </IconButton>
                        {/* Logo */}
                        <div className='text-white text-xl font-bold'>Logo</div>

                    </div>
                    {/* Hamburger Icon */}

                    {/* Navigation Links */}
                    <div className='text-white space-x-4 lg:flex hidden'>
                        <Link to="/" className='hover:text-blue-400 transition duration-300 hover:underline hover:scale-110'><Home/></Link>
                        <Link to="/profile" className='hover:text-blue-400 transition duration-300 hover:underline hover:scale-110'><Person/></Link>
                        <Link to="/notifications" className='hover:text-blue-400 transition duration-300 hover:underline hover:scale-110'><Notifications/></Link>
                        <Link to="/login" className='hover:text-blue-300 transition duration-300 hover:underline hover:scale-110'>Login</Link>
                    </div>
                    {/* Lightmode/Darkmode */}
                    {darkModeIcon ? (
                        <DarkModeOutlinedIcon onClick={this.toggleDarkMode} className='text-white cursor-pointer hover:text-gray-300 transition duration-300' />
                       ):(
                        <WbSunnyOutlinedIcon onClick={this.toggleDarkMode} className='text-white cursor-pointer hover:text-gray-300 transition duration-300' />
                    )

                    }

                     {/* Seach Input */}
                     <div className='flex items-center'>
                        <input type="text" placeholder='Search' className='rounded-l-lg px-3 py-2 bg-gray-700 text-gray-200 focus:outline-none' />
                        <button className='rounded-r-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition duration-300'><Search /></button>
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
                <MenuItem onClick={this.handleClose}><Link to="/">Home</Link></MenuItem>
                <MenuItem onClick={this.handleClose}><Link to="/profile">Profile</Link></MenuItem>
                <MenuItem onClick={this.handleClose}><Link to="/notifications">Notifications</Link></MenuItem>
                <MenuItem onClick={this.handleClose}><Link to="/login">Login</Link></MenuItem>
            </Menu>
            </>
        )
    }
}

// const mapStateToProps = (state) => ({
    
// })

// const mapDispatchToProps = (dispatch) => ({
    
// })

export default  (Navbar) /*connect(mapStateToProps, mapDispatchToProps)*/
