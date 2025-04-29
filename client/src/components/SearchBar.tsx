// client/src/components/SearchBar.tsx

import React, { useState } from 'react';
import { useJobStore } from '../store/useJobStore';

const SearchBar: React.FC = () => {
  const { updateSearchFilters, resetSearchFilters } = useJobStore();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(25); // Default 25 miles

  const handleSearch = () => {
    updateSearchFilters({ title, location, radius });
  };

  const handleReset = () => {
    setTitle('');
    setLocation('');
    setRadius(25);
    resetSearchFilters();
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8 mb-6">
      <input
        type="text"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
      />
      <select
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
      >
        <option value={10}>10 miles</option>
        <option value={15}>15 miles</option>
        <option value={20}>20 miles</option>
        <option value={25}>25 miles</option>
        <option value={50}>50 miles</option>
      </select>
      <button
        onClick={handleSearch}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
      >
        Search
      </button>
      <button
        onClick={handleReset}
        className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg shadow-md transition"
      >
        Reset
      </button>
    </div>
  );
};

export default SearchBar;
