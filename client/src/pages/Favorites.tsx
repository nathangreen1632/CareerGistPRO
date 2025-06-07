import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import JobCard from '../components/JobCard';
import toast from 'react-hot-toast';
import { UnifiedJob } from '../types/jobTypes';
import { useJobStore } from '../store/useJobStore';

const Favorites: React.FC = () => {
  const { token, isLoggedIn } = useAuth();
  const { summarizeJob } = useJobStore();

  const [favoriteJobs, setFavoriteJobs] = useState<UnifiedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const redirectToLogin = useCallback(() => {
    window.location.href = '/login';
  }, []);

  const handleUnfavorite = useCallback((jobId: string) => {
    setFavoriteJobs(prev => prev.filter(j => j.id !== jobId));
  }, []);

  const normalizeData = useCallback((data: any[]): UnifiedJob[] => {
    return data.map(fav => ({
      id: fav.jobId,
      title: fav.title,
      company: fav.company,
      location: fav.location,
      description: fav.description ?? '',
      summary: fav.summary ?? '',
      applyLink: fav.url ?? '',
      logoUrl: fav.logoUrl,
      postedAt: fav.postedAt,
      salaryMin: fav.salaryMin,
      salaryMax: fav.salaryMax,
      salaryPeriod: fav.salaryPeriod,
      isRemote: undefined,
    }));
  }, []);

  const summarizeMissingJobs = useCallback(
    async (jobs: UnifiedJob[]) => {
      const tasks = jobs
        .filter(job => !job.summary && job.description)
        .map(job =>
          summarizeJob(job.id, job.description).catch(err =>
            console.error(`Failed to summarize job ${job.id}`, err)
          )
        );
      await Promise.all(tasks);
    },
    [summarizeJob]
  );

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const msg = await res.text();
        console.error('Fetch favorites failed:', msg);
        toast.error('Unable to load favorites. Please try again.');
        setError('Unable to load favorites');
        return;
      }

      const data = await res.json();
      const normalized = normalizeData(data);
      setFavoriteJobs(normalized);

      await summarizeMissingJobs(normalized);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      toast.error('Something went wrong. Please try again later.');
      setError('Unable to retrieve favorites');
    } finally {
      setLoading(false);
    }
  }, [token, normalizeData, summarizeMissingJobs]);

  useEffect(() => {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }
    void fetchFavorites();
  }, [isLoggedIn, redirectToLogin, fetchFavorites]);

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-600 dark:text-gray-400">
        Loading favorites...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        Error loading favorites: {error}
      </div>
    );
  }

  const uniqueFavoriteJobs = Array.from(
    new Map(favoriteJobs.map(job => [job.id, job])).values()
  );

  if (uniqueFavoriteJobs.length === 0) {
    return (
      <div className="text-center p-8 text-gray-600 dark:text-gray-400">
        You have no favorited jobs yet.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full px-4 sm:px-6 py-8 max-w-7xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        Your Favorited Jobs
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {uniqueFavoriteJobs.map(job => (
          <JobCard
            key={job.id}
            {...job}
            isFavorited
            showApplyButton
            onUnfavorite={() => handleUnfavorite(job.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
