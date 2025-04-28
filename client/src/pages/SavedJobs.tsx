// client/src/pages/SavedJobs.tsx

import React, { useEffect, useState } from 'react';
import { useJobStore } from '../store/useJobStore';
import JobCard from '../components/JobCard';
import {UnifiedJob} from "../types/jobTypes";

const SavedJobs: React.FC = () => {
  const { jobs } = useJobStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<typeof jobs>([]);

  const token = localStorage.getItem('token');
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }

    const fetchSavedJobs = async () => {
      try {
        const response = await fetch('/api/saved-jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch saved jobs');
        }

        const data = await response.json();

        const normalizedSavedJobs = data.map((job: any) => ({
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

        setSavedJobs(normalizedSavedJobs);
      } catch (err: any) {
        console.error('Error fetching saved jobs:', err);
        setError(err.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    void fetchSavedJobs();
  }, [isLoggedIn, token]);

  if (loading) {
    return <div className="text-center p-8 text-gray-600 dark:text-gray-400">Loading saved jobs...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error loading saved jobs: {error}</div>;
  }

  if (!savedJobs.length) {
    return <div className="text-center p-8 text-gray-600 dark:text-gray-400">You have no saved jobs yet.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        Your Saved Jobs
      </h1>
      <div className="space-y-6">
        {savedJobs.map((job: UnifiedJob) => (
          <JobCard
            key={job.id}
            id={job.id}
            title={job.title}
            company={job.company}
            location={job.location}
            description={job.description}
            summary={job.summary}
            applyLink={job.applyLink}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;
