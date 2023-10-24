import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../store/authSlice';
import axios from 'axios';
import { updateUser } from '../../store/userSlice';
import { RootState } from '../../store/store';

interface Props {
  login: (currentUser: any) => any;
}

const SignUp: React.FC<Props> = ({ login }) => {
        
    const [err, setErr] = useState<string>('');
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const formValues: { [key: string]: string } = {};

        formData.forEach((value, key) => {
        formValues[key] = value as string;
        });

        try {
        await axios.post('https://clip-flow-c44deb5c5c24.herokuapp.com/api/auth/register', formValues)
        // const res = await axios.post('http://localhost:4000/api/auth/register', formValues);

        // sessionStorage.setItem('currentUser', JSON.stringify())
        // dispatch(login(res.data));
        // dispatch(updateUser(res.data))
        
        navigate('/login');
        } catch (error: any) {
        console.log(error.response.data);
        setErr(error.response.data);
        }
        console.log('Form values:', formValues);
    };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex sm:w-3/4 bg-white sm:rounded-lg  shadow-md overflow-hidden">
        <div className="bg-blue-500 w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Welcome to ClipFlow!</h2>
          <p className="text-white">
            Discover amazing features and benefits of ClipFlow. Share videos, clips, and images with other members from around the world. Once you Sign Up, you will be navigated to the login page to Sign in!
          </p>
          <Link to="/login" className="text-blue-300 hover:underline">
            Already have an account? Sign In
          </Link>
        </div>
        <div className="p-8 w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
          <form onSubmit={handleFormSubmit}>
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
            <div className="flex justify-end space-x-12 items-center">
              <strong className='text-red-500'>{err}</strong>
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
  );
};

const mapDispatchToProps = {
  login,
};

export default connect(null, mapDispatchToProps)(SignUp);
