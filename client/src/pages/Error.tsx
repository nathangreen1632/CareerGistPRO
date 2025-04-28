// client/src/pages/Error.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const Error: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Page Not Found</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Error;
