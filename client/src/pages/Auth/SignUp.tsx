import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { login } from '../../store/authSlice'
import axios from 'axios'

interface Props {
    login: (currentUser: any) => void; // Add the login action to props
  }
interface State {}

class SignUp extends PureComponent<Props, State> {
    constructor(props: any) {
        super(props)

        this.state = {
            
        }
    }
    handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const formData = new FormData(event.target as HTMLFormElement);
        const formValues: { [key: string]: string } = {}; //initializes an empty object that will hold the form values.

        formData.forEach((value, key) => {
            formValues[key] = value as string; //assigns the value to the corresponding property in the formValues object using the key as the property name.
        });
        
        try {
            await axios.post('http://localhost:4000/api/auth/register' , formValues)
            
            this.props.login(formValues.username);
        } catch (error) {
            console.log(error)
        }
        console.log('Form values:', formValues);
    };

    render() {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="flex w-97 bg-white rounded-lg shadow-md overflow-hidden">
                {/* Container on the Left with Blue Background */}
                <div className="bg-blue-500 w-1/2 p-8">
                    <h2 className="text-2xl font-semibold text-white mb-4">Welcome to Our App</h2>
                    <p className="text-white">
                    Discover amazing features and benefits of our app. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Sed ac ante vel nunc ullamcorper lacinia eu a dolor.
                    </p>
                    <Link to="/login" className="text-blue-300 hover:underline">
                        Already have an account? Sign In
                    </Link>
                </div>
                {/* Signup Form */}
                <div className="p-8 w-1/2">
                    <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
                    <form onSubmit={this.handleFormSubmit}>
                    <div className="mb-6">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                        Username
                        </label>
                        <input
                        type="text"
                        id="username"
                        name="username"
                        className="mt-1 p-3 w-full border rounded-md focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                        Email
                        </label>
                        <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 p-3 w-full border rounded-md focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                        Password
                        </label>
                        <input
                        type="password"
                        id="password"
                        name="password"
                        className="mt-1 p-3 w-full border rounded-md focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                        >
                        Sign Up
                        </button>
                    </div>
                    </form>
                </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = {
    login, 
  };

export default connect(null, mapDispatchToProps)(SignUp);
