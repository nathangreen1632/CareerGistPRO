import React from 'react';
import { useRecommendedJobs } from '../hooks/useRecommendedJobs';
import JobCard from './JobCard';

const RecommendedJobs: React.FC = () => {
  const { recommendations, isLoading, isError } = useRecommendedJobs();

  if (isLoading) {
    return <div className="text-center text-gray-500 dark:text-gray-400 mt-6">Loading recommended jobs...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500 mt-6">Failed to load recommendations.</div>;
  }

  if (recommendations.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400 mt-6">No recommended jobs found.</div>;
  }

  return (
    <div className="mt-10 space-y-6 px-4 sm:px-6">
      <h2 className="text-2xl font-bold text-center sm:text-left text-gray-800 dark:text-white mb-2">
        Recommended For You
      </h2>

      {recommendations.map(({ job, score }) => (
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
            isRemote={job.isRemote}
            postedAt={job.postedAt ?? undefined}
            logoUrl={job.logoUrl}
          />

          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            Match Score: {score}%
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedJobs;
