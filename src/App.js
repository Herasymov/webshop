import React, {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import jwtDecode from 'jwt-decode';
import refreshAccessToken from "./services/RequestService";
import axiosInstance from "./axiosAPI";

const checkAccessTokenValidity = async () => {
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');

    function isTokenExpiredCheck(token) {
        if (!token) {
            return true;
        }

        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decodedToken.exp < currentTime;
    }

    if (accessToken) {
        const isTokenExpired = isTokenExpiredCheck(accessToken);
        if (isTokenExpired && refreshToken) {
            try {
                const newToken = await refreshAccessToken(refreshToken);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            } catch (error) {
                console.error('Token refresh failed:', error);
            }
        }
    }
};

const App = () => {
    useEffect(() => {
        checkAccessTokenValidity();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="" element={<MainPage/>} />
            </Routes>
        </Router>
    );
};

export default App;
