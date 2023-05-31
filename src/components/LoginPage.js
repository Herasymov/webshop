import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../axiosAPI";

const LoginPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const userToken = localStorage.getItem('token');
    useEffect(() => {
        if (userToken) {
            navigate('/');
        }
    }, [userToken, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const url = isLogin ? 'login/' : 'register/';

        const userData = {
            username,
            password,
        };

        try {
            const timestamp = Date.now();
            const response = await axiosInstance.post(url+`?timestamp=${timestamp}`, userData);

            if (response.status === 200) {
                const data = response.data;
                const token = data.access;
                localStorage.setItem('token', token);
                localStorage.setItem('refresh_token', data.refresh)
                navigate('/');
            } else {
                const errorData = response.data;
                setError(errorData.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    const handleSwitchForm = () => {
        setIsLogin(!isLogin);
        setUsername('');
        setPassword('');
        setError('');
    };

    return (
        <div className="flex items-center justify-center h-screen bg-purple-500">
            <div className="w-80 p-6 bg-white rounded-md shadow-md">
                <h1 className="text-3xl font-bold text-center">
                    {isLogin ? 'Login' : 'Register'}
                </h1>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div>
                        <label htmlFor="username" className="block mb-1">
                            Username:
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="password" className="block mb-1">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    {error && <div className="text-red-500 mt-2">{error}</div>}
                    <button
                        type="submit"
                        className="w-full mt-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-600"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <button
                    onClick={handleSwitchForm}
                    className="block mt-4 mx-auto text-purple-700 hover:underline"
                >
                    {isLogin ? 'Switch to Register' : 'Switch to Login'}
                </button>
            </div>
        </div>
    );

};

export default LoginPage;
