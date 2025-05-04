// client/src/pages/Register.tsx

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

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
        navigate('/');
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
      <form
        onSubmit={handleRegister}
        className="flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 space-y-4 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Register</h2>

        <input
          type="text"
          autoComplete="given-name"
          placeholder="First Name"
          className="p-3 border border-gray-300 dark:border-gray-600 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <input
          type="text"
          autoComplete="family-name"
          placeholder="Last Name"
          className="p-3 border border-gray-300 dark:border-gray-600 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <input
          type="email"
          autoComplete="email"
          placeholder="Email"
          className="p-3 border border-gray-300 dark:border-gray-600 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Input */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="off"
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {password && confirmPassword && password !== confirmPassword && (
          <p className="text-sm text-red-500">Passwords do not match.</p>
        )}

        <button
          type="submit"
          className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
