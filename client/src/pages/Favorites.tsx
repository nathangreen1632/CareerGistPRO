// client/src/pages/Favorites.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import JobCard from '../components/JobCard';
import toast from 'react-hot-toast';
import { UnifiedJob } from '../types/jobTypes';

const Favorites: React.FC = () => {
  const { token, isLoggedIn } = useAuth();
  const [favoriteJobs, setFavoriteJobs] = useState<UnifiedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();

        const normalizedFavorites = data.map((job: any) => ({
          id: job.jobId,
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          summary: job.summary ?? '',
          applyLink: job.url ?? '',
          salaryMin: undefined,
          salaryMax: undefined,
          salaryPeriod: undefined,
          benefits: [],
          isRemote: undefined,
          postedAt: undefined,
          logoUrl: undefined,
        }));

        setFavoriteJobs(normalizedFavorites);
      } catch (err: any) {
        console.error('Error fetching favorites:', err);
        setError(err.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    void fetchFavorites();
  }, [isLoggedIn, token]);

  const handleUnfavorite = async (jobId: string) => {
    try {
      const response = await fetch(`/api/favorites/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      setFavoriteJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      toast.success('Job unfavorited!');
    } catch (err: any) {
      console.error('Error removing favorite:', err);
      toast.error('Failed to unfavorite job.');
    }
  };

  if (loading) {
    return <div className="text-center p-8 text-gray-600 dark:text-gray-400">Loading favorites...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error loading favorites: {error}</div>;
  }

  if (favoriteJobs.length === 0) {
    return <div className="text-center p-8 text-gray-600 dark:text-gray-400">You have no favorited jobs yet.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        Your Favorited Jobs
      </h1>
      <div className="space-y-6">
        {favoriteJobs.map((job) => (
          <div key={job.id} className="relative">
            <JobCard
              id={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              description={job.description}
              summary={job.summary}
              applyLink={job.applyLink}
            />
            <button
              onClick={() => handleUnfavorite(job.id)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl text-sm shadow-md"
            >
              Unfavorite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
