import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from '../../api/axiosClient';

const Login = () => {
    const { setUser, setToken } = useStateContext();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setGeneralError("");

        const payload = {email, password};
        
        axiosClient.post('/login', payload)
            .then((res) => {
                setUser(res.data.data.user);
                setToken(res.data.data.token);
            })
            .catch((err) => {
                if (err.response) {
                    if (err.response.status === 422) {
                        setErrors(err.response.data.errors);
                    } else if (err.response.status === 401) {                        
                        setGeneralError("Invalid credentials");
                    } else {
                        setGeneralError("Something went wrong. Please try again.");
                    }
                } else {
                    setGeneralError("Network error. Please check your connection.");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
                <form onSubmit={handleLogin}>
                    {generalError && (
                        <div className="mb-4 text-red-600 text-center font-medium">
                            {generalError}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter your email"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter your password"
                            required
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition duration-300 disabled:opacity-50"
                    >
                        {loading ? "Logging..." : "Login"}
                    </button>

                    <p className="mt-4 text-sm text-center text-gray-600">
                        Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login;