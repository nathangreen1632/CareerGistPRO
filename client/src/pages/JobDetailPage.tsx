import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UnifiedJob } from '../types/jobTypes';
import JobCard from '../components/JobCard';
import { Helmet } from 'react-helmet-async';

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

  if (!job) {
    return <p className="p-4">Loading job details...</p>;
  }

  const title = `${job.title} at ${job.company}`;
  const description = job.summary ?? job.description?.slice(0, 200) ?? 'AI-enhanced job opportunity.';
  const image = 'https://www.careergistpro.com/og-default.jpg';
  const canonicalUrl = `https://www.careergistpro.com/job/${sourceId}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>

      <div className="p-4">
        <JobCard {...job} />
      </div>
    </>
  );
};

export default JobDetailPage;
