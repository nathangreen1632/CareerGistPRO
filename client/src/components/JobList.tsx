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

    observer.current = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        try {
          await fetchJobs();
        } catch (err) {
          console.error('Error fetching more jobs:', err);
        }
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, fetchJobs]);


  useEffect(() => {
    (async () => {
      try {
        await fetchJobs();
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    })();
  }, [searchFilters]);

  useEffect(() => {
    (async () => {
      try {
        const toSummarize = jobs.filter(j => !j.summary && j.description);
        await Promise.all(
          toSummarize.map(j => summarizeJob(j.id, j.description))
        );
      } catch (err) {
        console.error('Error summarizing jobs:', err);
      }
    })();
  }, [jobs, summarizeJob]);


  return (
    <div className="flex flex-col items-center space-y-4 py-8 px-4 sm:px-6">
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
        <div className="flex flex-col items-center space-y-4 w-full px-4">
          {[...Array(3)].map((_) => (
            <div
              key={_}
              className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-md w-full max-w-full sm:max-w-2xl md:max-w-3xl"
            >
              <SkeletonLoader height="h-6" width="w-1/2" />
              <SkeletonLoader height="h-4" width="w-3/4" />
              <SkeletonLoader height="h-4" width="w-2/3" />
            </div>
          ))}
        </div>
      )}

      {!hasMore && !isLoading && (
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">No more jobs.</p>
      )}
    </div>
  );
};

export default JobList;
