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

        const data = await response.json();

        if (!response.ok) {
          console.error('Fetch applied jobs failed:', data);
          setError(data.error || 'Failed to fetch applied jobs');
          return;
        }

        const jobMap = new Map<string, any>();
        jobs.forEach((j) => jobMap.set(j.sourceId ?? j.id, j));

        const normalizedAppliedJobs = data.map((entry: any) => ({
          id: entry.jobId,
          title: entry.title,
          company: entry.company,
          location: entry.location,
          description: entry.Job?.description ?? '',
          summary: entry.Job?.summary ?? '',
          applyLink: entry.Job?.url ?? entry.applyLink ?? '',
          salaryMin: entry.Job?.salaryMin,
          salaryMax: entry.Job?.salaryMax,
          salaryPeriod: entry.Job?.salaryPeriod,
          postedAt: entry.Job?.postedAt,
          logoUrl: entry.Job?.logoUrl,
          benefits: entry.Job?.benefits ?? [],
          isRemote: entry.Job?.isRemote,
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

  const handleRemoveApplied = async (jobId: string) => {
    try {
      const res = await fetch(`/api/applied/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error('Failed to remove applied job:', await res.text());
        return;
      }

      setAppliedJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error('Unexpected error removing applied job:', err);
    }
  };


  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        Jobs You've Applied To
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
            salaryMin={job.salaryMin}
            salaryMax={job.salaryMax}
            salaryPeriod={job.salaryPeriod}
            logoUrl={job.logoUrl}
            postedAt={job.postedAt}
            isRemote={job.isRemote}
            isAppliedView={true}
            showApplyButton={true}
            onRemoveApplied={() => handleRemoveApplied(job.id)}
          />

        ))}
      </div>
    </div>
  );
};

export default AppliedTo;
