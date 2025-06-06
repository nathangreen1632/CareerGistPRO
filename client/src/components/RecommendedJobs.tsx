import React from 'react';
import { useRecommendedJobs } from '../hooks/useRecommendedJobs';
import JobCard from './JobCard';

const RecommendedJobs: React.FC = () => {
  const { recommendations, isLoading, isError } = useRecommendedJobs();

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-6">
        Loading recommended jobs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-6">
        Failed to load recommendations.
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-6">
        No recommended jobs found.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full px-4 sm:px-6 py-8 max-w-7xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Recommended For You
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map(({ job, score }) => (
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
            isRemote={job.isRemote}
            postedAt={job.postedAt ?? undefined}
            logoUrl={job.logoUrl}
            matchScore={score}
          />
        ))}
      </div>
    </div>
  );

};

export default RecommendedJobs;