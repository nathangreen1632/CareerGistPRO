// client/src/pages/Register.tsx

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        login(data.token);
        toast.success('Registered successfully!');
        navigate('/'); // Redirect after successful registration
      } else {
        toast.error(data.message ?? 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Registration error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleRegister} className="flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 space-y-4 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Register</h2>

        <input
          type="text"
          placeholder="First Name"
          className="p-3 border border-gray-300 dark:border-gray-600 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="p-3 border border-gray-300 dark:border-gray-600 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="p-3 border border-gray-300 dark:border-gray-600 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 border border-gray-300 dark:border-gray-600 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
