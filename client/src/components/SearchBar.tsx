import React, { useState } from 'react';
import { useJobStore } from '../store/useJobStore';
import { LocateFixed } from 'lucide-react';
import { API_BASE } from "../utils/api";

const SearchBar: React.FC = () => {
  const { updateSearchFilters, resetSearchFilters } = useJobStore();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(25);

  const handleSearch = () => {
    updateSearchFilters({ title, location, radius });

    if (title.trim()) {
      const payload = {
        title: title.trim(),
        location: location.trim(),
        query: `${title} ${location}`.trim(),
      };

      fetch(`${API_BASE}/analytics/search-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.warn("🔁 Failed to log search term:", err);
      });
    }
  };

  const handleReset = () => {
    setTitle('');
    setLocation('');
    setRadius(25);
    resetSearchFilters();
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition): Promise<void> => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const city = data?.address?.city ?? data?.address?.town ?? data?.address?.village ?? '';
          const state = data?.address?.state ?? '';
          const resolved = `${city}, ${state}`;

          setLocation(resolved);
          updateSearchFilters({ title, location: resolved, radius });
        } catch (err) {
          console.error('Reverse geocoding failed:', err);
          alert('Failed to retrieve city/state from your location.');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to access your location.');
      }
    );
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-8 mb-6 px-4">
      <input
        type="text"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full sm:w-auto flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full sm:w-auto flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
      />
      <select
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
      >
        <option value={10}>10 miles</option>
        <option value={15}>15 miles</option>
        <option value={20}>20 miles</option>
        <option value={25}>25 miles</option>
        <option value={50}>50 miles</option>
        <option value={100}>100 miles</option>
      </select>
      <div className="flex gap-2">
        <button
          onClick={handleGeolocation}
          aria-label="Use current location"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white hover:bg-emerald-300 text-black text-sm font-medium shadow-md transition"
        >
          <LocateFixed className="w-4 h-4 text-black" />
        </button>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
        >
          Search
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg shadow-md transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
