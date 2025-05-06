import React, { useEffect, useState } from 'react';
import { useJobStore } from '../store/useJobStore';
import JobCard from '../components/JobCard';
import {UnifiedJob} from "../types/jobTypes";

const AppliedTo: React.FC = () => {
  const { jobs } = useJobStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<typeof jobs>([]);

  const token = localStorage.getItem('token');
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }

    const fetchAppliedJobs = async () => {
      try {
        const response = await fetch('/api/applied', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch applied jobs');
        }

        const data = await response.json();

        const normalizedAppliedJobs = data.map((job: any) => ({
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

        setAppliedJobs(normalizedAppliedJobs);
      } catch (err: any) {
        console.error('Error fetching applied jobs:', err);
        setError(err.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    void fetchAppliedJobs();
  }, [isLoggedIn, token]);

  if (loading) {
    return <div className="text-center p-8 text-gray-600 dark:text-gray-400">Loading applied jobs...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error loading applied jobs: {error}</div>;
  }

  if (!appliedJobs.length) {
    return <div className="text-center p-8 text-gray-600 dark:text-gray-400">You have not applied to any jobs yet.</div>;
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        Jobs You Applied To
      </h1>
      <div className="space-y-6">
        {appliedJobs.map((job: UnifiedJob) => (
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

export default AppliedTo;
