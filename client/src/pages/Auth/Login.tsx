import React from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';


const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement);
    const formValues: { [key: string]: string } = {};

    formData.forEach((value, key) => {
      formValues[key] = value as string;
    });

    dispatch(login());
    
    navigate('/');
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
        <div className="flex justify-end">
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
        Log in to your account and explore our app. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Sed ac ante vel nunc ullamcorper lacinia eu a dolor.
        </p>
        <a href="#" className="text-blue-300 hover:underline">Forgot password?</a>
    </div>
    </div>
</div>
  );
};

export default SignUp;

