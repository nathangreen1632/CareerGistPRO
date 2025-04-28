// client/src/components/JobCard.tsx

import React, { useState, useEffect } from 'react';
import { useJobStore } from '../store/useJobStore';
import SkeletonLoader from "./SkeletonLoader";
import toast from "react-hot-toast";

interface JobCardProps {
  id: string;
  title: string;
  company?: string;
  location?: string;
  description: string;
  summary?: string;
  applyLink?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: string;
  benefits?: string[];
  isRemote?: boolean;
  postedAt?: string;
  logoUrl?: string;
}

const JobCard: React.FC<JobCardProps> = ({
                                           id,
                                           title,
                                           company,
                                           location,
                                           description,
                                           summary,
                                           applyLink,
                                           salaryMin,
                                           salaryMax,
                                           salaryPeriod,
                                           benefits,
                                           isRemote,
                                           postedAt,
                                           logoUrl,
                                         }) => {
  const { summarizeJob } = useJobStore();
  const token = localStorage.getItem('token');
  const isLoggedIn = Boolean(token);

  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to favorite jobs.');
      return;
    }

    try {
      if (isFavorited) {
        const response = await fetch(`/api/favorites/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to unfavorite job.');
        }

        setIsFavorited(false);
        toast.success('Job unfavorited!');
      } else {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ jobId: id, title, company, location, description, applyLink }),
        });

        if (!response.ok) {
          throw new Error('Failed to favorite job.');
        }

        setIsFavorited(true);
        toast.success('Job favorited!');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Something went wrong.');
    }
  };

  useEffect(() => {
    const fetchSummary = async () => {
      if (!summary && description) {
        try {
          await summarizeJob(id, description);
        } catch (error) {
          console.error('Failed to summarize job:', error);
        }
      }
    };

    void fetchSummary();
  }, [id, description, summary, summarizeJob]);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all w-full max-w-3xl mx-auto my-4">
      <div className="flex flex-col space-y-2">
        {logoUrl && (
          <img src={logoUrl} alt={`${company} logo`} className="h-12 w-auto object-contain mb-2" />
        )}

        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400">
          {company} — {location} {isRemote && <span className="ml-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Remote</span>}
        </p>

        {(salaryMin || salaryMax) && (
          <p className="text-sm text-green-600 dark:text-green-400">
            {salaryMin && `$${salaryMin.toLocaleString()}`} - {salaryMax && `$${salaryMax.toLocaleString()}`} {salaryPeriod && `/ ${salaryPeriod.toLowerCase()}`}
          </p>
        )}

        {summary ? (
          <p className="text-gray-700 dark:text-gray-300 mt-2">{summary}</p>
        ) : (
          <div className="mt-2">
            <SkeletonLoader height="h-4" width="w-3/4" />
            <SkeletonLoader height="h-4" width="w-5/6" />
          </div>
        )}

        {benefits && benefits.length > 0 && (
          <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside mt-2">
            {benefits.slice(0, 3).map((benefit, idx) => (
              <li key={idx}>{benefit.replace(/_/g, ' ')}</li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-4 mt-4">
          {applyLink && isLoggedIn ? (
            <a
              href={applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              View Full Job
            </a>
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-600">
              {isLoggedIn ? 'No job link available' : 'Login to apply'}
            </span>
          )}

          {isLoggedIn && (
            <button
              onClick={handleToggleFavorite}
              className="text-sm text-red-500 hover:underline"
            >
              {isFavorited ? 'Unfavorite' : 'Favorite'}
            </button>
          )}
        </div>

        {postedAt && (
          <p className="text-xs text-gray-400 mt-2">Posted {postedAt}</p>
        )}
      </div>
    </div>
  );
};

export default JobCard;
