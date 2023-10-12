import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { login } from '../../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { updateUser } from '../../store/userSlice';


const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.currentUser);
  const [err, setErr] = useState("")
  
  useEffect(() => {
    // Check if the user is already authenticated, and if so, redirect to homepage.
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement);
    const formValues: { [key: string]: string } = {};

    formData.forEach((value, key) => {
      formValues[key] = value as string;
    });

    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', formValues, {
        withCredentials: true,
      });
      console.log(res.data)
      dispatch(login(res.data));
      dispatch(updateUser(res.data))
      
      navigate('/');
    } catch (error: any) {
      console.log(error.response.data)
      setErr(error.response.data)  
    }

  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="flex w-100 bg-white rounded-lg shadow-md overflow-hidden">
    {/* Signin Form */}
    <div className="p-8 w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
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
            <strong className='text-red-500 '>{err}</strong>
            <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
            Sign In
            </button>
        </div>
        </form>
        <div className="mt-4">
            <Link to="/" className="text-blue-500 hover:underline">
                Go back to Sign Up
            </Link>
        </div>
        
    </div>
    {/* Container on the Right with Blue Background */}
    <div className="bg-blue-500 w-1/2 p-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Welcome Back</h2>
        <p className="text-white">
        Log in to your account and explore ClipFlow. Share and discover new visuals from around the world.
        </p>
        {/* <a href="#" className="text-blue-300 hover:underline">Forgot password?</a> */}
    </div>
    </div>
</div>
  );
};

export default Login;

