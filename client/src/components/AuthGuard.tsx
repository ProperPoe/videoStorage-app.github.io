import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import {ReactNode, useEffect} from 'react';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import React from "react"
// import React = require('react');

interface AuthGuardProps {
  children: ReactNode;
}

function AuthGuard({ children }: AuthGuardProps) {
    const location = useLocation();
    const navigate = useNavigate(); 
    const isAuthenticated = useSelector((state: RootState) => state.auth.currentUser);

    useEffect(() => {
      if (!isAuthenticated) {
        // Redirect unauthenticated users to the login page
        navigate('/login', { state: { from: location }, replace: true });
      }
    }, [isAuthenticated, navigate, location]);

  return <>{children}</>;
}

export default AuthGuard;