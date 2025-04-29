// client/src/components/JobList.tsx

import { useEffect, useRef, useCallback } from 'react';
import { useJobStore } from '../store/useJobStore';
import JobCard from './JobCard';
import SkeletonLoader from './SkeletonLoader';
import { UnifiedJob } from '../types/jobTypes';

const JobList = () => {
  const { jobs, fetchJobs, isLoading, hasMore, summarizeJob, searchFilters } = useJobStore();
  const observer = useRef<IntersectionObserver | null>(null);

  const lastJobRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        void fetchJobs(); // ✅ Will refetch using the current searchFilters automatically
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, fetchJobs]);

  useEffect(() => {
    // 👇 When search filters change, reset jobs and refetch from page 1
    void fetchJobs();
  }, [searchFilters]);

  useEffect(() => {
    // ✅ Summarize only jobs without a summary
    jobs.forEach((job) => {
      if (!job.summary && job.description) {
        void summarizeJob(job.id, job.description);
      }
    });
  }, [jobs, summarizeJob]);

  return (
    <div className="flex flex-col items-center space-y-4 py-8">
      {jobs.map((job: UnifiedJob, index) => {
        const jobCard = (
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
        );

        if (index === jobs.length - 1) {
          return (
            <div ref={lastJobRef} key={job.id}>
              {jobCard}
            </div>
          );
        }
        return jobCard;
      })}

      {isLoading && (
        <div className="flex flex-col items-center space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md w-full max-w-3xl"
            >
              <SkeletonLoader height="h-6" width="w-1/2" />
              <SkeletonLoader height="h-4" width="w-3/4" />
              <SkeletonLoader height="h-4" width="w-2/3" />
            </div>
          ))}
        </div>
      )}

      {!hasMore && !isLoading && (
        <p className="text-gray-500 dark:text-gray-400">No more jobs.</p>
      )}
    </div>
  );
};

export default JobList;
