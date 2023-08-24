import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {Menu, MenuItem, IconButton} from '@mui/material'
import {Home, Person, Notifications, Search, Menu as MenuIcon} from '@mui/icons-material'

interface Props {}
interface State {}

class Navbar extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render() {
        return (
            <>
            <div className='bg-gray-800 py-4'>
                <div className='container mx-auto flex justify-between items-center'>
                    <div className='flex items-center'>
                        <IconButton
                            sx={{color: 'white'}}
                            color='inherit'
                            edge='start'
                            aria-label='menu'
                            aria-controls='menu'
                            aria-haspopup="true"
                        >
                            <MenuIcon />
                        </IconButton>
                        {/* Logo */}
                        <div className='text-white text-xl font-bold'>Logo</div>

                    </div>
                    {/* Hamburger Icon */}

                    {/* Navigation Links */}
                    <div className='text-white space-x-4'>
                        <a href="#" className='hover:text-blue-400 transition duration-300 hover:underline hover:scale-110'><Home/></a>
                        <a href="#" className='hover:text-blue-400 transition duration-300 hover:underline hover:scale-110'><Person/></a>
                        <a href="#" className='hover:text-blue-400 transition duration-300 hover:underline hover:scale-110'><Notifications/></a>
                        <a href="#" className='hover:text-blue-300 transition duration-300 hover:underline hover:scale-110'>Login</a>
                    </div>
                     {/* Seach Input */}
                     <div className='flex items-center'>
                        <input type="text" placeholder='Search' className='rounded-l-lg px-3 py-2 bg-gray-700 text-gray-200 focus:outline-none' />
                        <button className='rounded-r-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition duration-300'><Search /></button>
                     </div>
                </div>
            </div>
            </>
        )
    }
}

// const mapStateToProps = (state) => ({
    
// })

// const mapDispatchToProps = (dispatch) => ({
    
// })

export default  (Navbar) /*connect(mapStateToProps, mapDispatchToProps)*/
