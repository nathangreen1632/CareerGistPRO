// client/src/hooks/useRecommendedJobs.ts

import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { UnifiedJob } from '../types/jobTypes';

interface ScoredJob {
  job: UnifiedJob;
  score: number;
}

export const useRecommendedJobs = () => {
  const { token } = useAuth();
  const [recommendations, setRecommendations] = useState<ScoredJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!token) return;

      setIsLoading(true);
      setIsError(false);

      try {
        const response = await fetch('/api/recommendations', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setRecommendations(data);
        } else {
          setIsError(true);
        }
      } catch (err) {
        console.error('❌ Failed to load recommendations:', err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRecommendations();
  }, [token]);

  return { recommendations, isLoading, isError };
};
