import React, { useEffect, useState } from 'react';
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
          const message = await response.text();
          console.error('Fetch favorites failed:', message);
          toast.error('Unable to load favorites. Please try again.');
          setError('Unable to load favorites');
          return;
        }

        const data = await response.json();

        const normalizedFavorites: UnifiedJob[] = data.map((fav: any) => ({
          id: fav.jobId,
          title: fav.title,
          company: fav.company,
          location: fav.location,
          description: fav.description,
          summary: fav.summary ?? '', // 👈 pull from Favorite, not from fav.Job.summary
          applyLink: fav.url ?? '',
          logoUrl: fav.logoUrl,
          postedAt: fav.postedAt,
          salaryMin: fav.salaryMin,
          salaryMax: fav.salaryMax,
          salaryPeriod: fav.salaryPeriod,
          benefits: [],
          isRemote: undefined,
        }));


        setFavoriteJobs(normalizedFavorites);

        for (const job of normalizedFavorites) {
          if (!job.summary && job.description) {
            try {
              await summarizeJob(job.id, job.description);
            } catch (error) {
              console.error(`Failed to summarize job ${job.id}`, error);
            }
          }
        }
      } catch (err: any) {
        console.error('Error fetching favorites:', err);
        toast.error('Something went wrong. Please try again later.');
        setError('Unable to retrieve favorites');
      } finally {
        setLoading(false);
      }
    };

    void fetchFavorites();
  }, [isLoggedIn, token, summarizeJob]);

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
              salaryMin={job.salaryMin}
              salaryMax={job.salaryMax}
              salaryPeriod={job.salaryPeriod}
              benefits={job.benefits}
              postedAt={job.postedAt ?? undefined}
              logoUrl={job.logoUrl}
              isFavorited={true}
              onUnfavorite={() =>
                setFavoriteJobs((prev) => prev.filter((j) => j.id !== job.id))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
