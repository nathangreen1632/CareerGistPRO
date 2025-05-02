// client/src/pages/Login.tsx

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        login(data.token);
        toast.success('Logged in successfully!');
        navigate('/'); // Redirect to homepage or dashboard
      } else {
        toast.error(data.message ?? 'Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Login error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleLogin} className="flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 space-y-4 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Login</h2>

        <input
          type="email"
          autoComplete="email"
          placeholder="Email"
          className="p-3 border border-gray-300 dark:border-gray-600 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          className="p-3 border border-gray-300 dark:border-gray-600 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />


        <button type="submit" className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
