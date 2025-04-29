// client/src/pages/Home.tsx

import React, { useEffect } from 'react';
import { useJobStore } from '../store/useJobStore';
import JobCard from '../components/JobCard';

const Home: React.FC = () => {
  const { jobs, isLoading, fetchJobs, hasMore } = useJobStore();

  useEffect(() => {
    if (jobs.length === 0) {
      void fetchJobs(); // ✅ Always fetch jobs initially (whether logged in or not)
    }
  }, [jobs.length, fetchJobs]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight * 0.9;

      if (isNearBottom && !isLoading && hasMore) {
        void fetchJobs();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchJobs, isLoading, hasMore]);

  if (isLoading && jobs.length === 0) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400">
        Loading jobs...
      </div>
    );
  }

  if (jobs.length === 0 && !isLoading) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400">
        No jobs found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <JobCard
        key={job.id}
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
        />
      ))}
      {isLoading && jobs.length > 0 && (
        <div className="text-center text-gray-600 dark:text-gray-400">
          Loading more jobs...
        </div>
      )}
    </div>
  );
};

export default Home;
