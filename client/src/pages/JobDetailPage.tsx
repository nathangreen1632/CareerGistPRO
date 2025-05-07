import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UnifiedJob } from '../types/jobTypes'; // Create this if it doesn't exist
import JobCard from '../components/JobCard';

const JobDetailPage = () => {
  const { sourceId } = useParams();
  const [job, setJob] = useState<UnifiedJob | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${sourceId}`);
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error('Error fetching job details:', err);
      }
    };

    if (sourceId) void fetchJob();
  }, [sourceId]);

  return (
    <div className="p-4">
      {job ? <JobCard {...job} /> : <p>Loading job details...</p>}
    </div>
  );
};

export default JobDetailPage;
