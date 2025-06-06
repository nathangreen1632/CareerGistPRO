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
        navigate('/');
      } else {
        toast.error(data.message ?? 'Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Login error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 sm:p-8 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Login
        </h2>

        <input
          type="email"
          autoComplete="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;