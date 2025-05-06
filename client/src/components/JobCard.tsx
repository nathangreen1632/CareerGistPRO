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
  isRemote?: string | boolean | null;
  postedAt?: string;
  logoUrl?: string;
  isFavorited?: boolean;
  onUnfavorite?: () => void;
  matchScore?: number;
}

const JobCard: React.FC<JobCardProps> = (props) => {
  const {
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
    matchScore,
    isFavorited: initialFavorite = false,
  } = props;

  const { summarizeJob } = useJobStore();
  const token = localStorage.getItem('token');
  const isLoggedIn = Boolean(token);

  const [isFavorited, setIsFavorited] = useState<boolean>(initialFavorite);

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

        if (props.onUnfavorite) {
          props.onUnfavorite();
        }

        if (response.status === 401) {
          toast.error('Session expired. Please login again.');
          return;
        }

        if (!response.ok) {
          console.error('Unfavorite request failed:', await response.text());
          toast.error('Unable to remove favorite. Please try again.');
          return;
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
          body: JSON.stringify({
            jobId: id, // this MUST match Job.sourceId
            title,
            company,
            location,
            description,
            applyLink,
            summary: summary ?? '',
            logoUrl: logoUrl ?? null,
            postedAt: postedAt ?? null,
            salaryMin: typeof salaryMin === 'number' ? salaryMin : 0,
            salaryMax: typeof salaryMax === 'number' ? salaryMax : 0,
            salaryPeriod: salaryPeriod ?? 'unknown',
          }),


        });

        if (!response.ok) {
          console.error('Favorite request failed:', await response.text());
          toast.error('Unable to save favorite. Please try again.');
          return;
        }

        setIsFavorited(true);
        toast.success('Job Favorited!');
      }
    } catch (error) {
      console.error('Unexpected error in favorite toggle:', error);
      toast.error('Something went wrong. Please try again later.');
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
    <div className="relative bg-white dark:bg-gray-800 px-4 py-6 sm:px-6 sm:py-6 rounded-2xl shadow-md hover:shadow-lg transition-all w-full max-w-screen-sm sm:max-w-2xl md:max-w-3xl mx-auto my-4">
      {typeof matchScore === 'number' && (
        <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
          Match Score: {matchScore}%
        </div>
      )}

      <div className="flex flex-col gap-3">
        {logoUrl && (
          <img
            src={logoUrl}
            alt={`${company} logo`}
            className="h-12 w-auto object-contain mb-1 sm:mb-2"
          />
        )}

        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 break-words">
          {title}
        </h2>

        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 break-words">
          {company} — {location}{' '}
          {isRemote && (
            <span className="ml-1 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mt-1 sm:mt-0">
            Remote
          </span>
          )}
        </p>

        {(typeof salaryMin === 'number' || typeof salaryMax === 'number') && (
          <p className="text-sm sm:text-base text-green-600 dark:text-green-400 break-words">
            {typeof salaryMin === 'number' ? `$${salaryMin.toLocaleString()}` : ''}
            {(typeof salaryMin === 'number' && typeof salaryMax === 'number') && ' - '}
            {typeof salaryMax === 'number' ? `$${salaryMax.toLocaleString()}` : ''}
          </p>
        )}

        {summary ? (
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-1 sm:mt-2 break-words">
            {summary}
          </p>
        ) : (
          <div className="mt-1 sm:mt-2 space-y-1">
            <SkeletonLoader height="h-4" width="w-3/4" />
            <SkeletonLoader height="h-4" width="w-5/6" />
          </div>
        )}

        {benefits && benefits.length > 0 && (
          <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 list-disc list-inside mt-1 sm:mt-2 space-y-1">
            {benefits.slice(0, 3).map((benefit, idx) => (
              <li key={idx}>{benefit.replace(/_/g, ' ')}</li>
            ))}
          </ul>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2 mt-4">
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
            <span className="text-sm text-gray-400 dark:text-gray-500">
            {isLoggedIn ? 'No job link available' : 'Login to apply'}
          </span>
          )}

          {isLoggedIn && (
            <button
              onClick={handleToggleFavorite}
              className={`text-sm font-semibold hover:underline transition ${
                isFavorited ? 'text-red-500' : 'text-green-400'
              }`}
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
