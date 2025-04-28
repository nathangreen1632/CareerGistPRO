// client/src/store/useJobStore.ts

import { create } from 'zustand';
import { normalizeJobData } from '../utils/normalizeJobData';
import { JobDetails, UnifiedJob } from '../types/jobTypes'; // ✅ Clean import

interface JobStore {
  jobs: UnifiedJob[]; // ✅ Now using UnifiedJob
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
  summarizeJob: (jobId: string, description: string) => Promise<void>;
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],
  currentPage: 1,
  hasMore: true,
  isLoading: false,
  error: null,

  fetchJobs: async () => {
    const { currentPage, jobs } = get();
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`/api/jobs?page=${currentPage}`);
      const data = await response.json();

      const normalizedJobs = normalizeJobData(data.jobs as JobDetails[]); // ✅ Normalized properly

      set({
        jobs: [...jobs, ...normalizedJobs],
        currentPage: currentPage + 1,
        hasMore: currentPage < (data.totalPages ?? 1),
        isLoading: false,
      });
    } catch (error: any) {
      console.error('❌ Failed to load jobs:', error);
      set({ error: 'Failed to load jobs.', isLoading: false });
    }
  },

  summarizeJob: async (jobId: string, description: string) => {
    try {
      const response = await fetch('/api/summaries/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ jobId, description }),
      });

      const data = await response.json();

      set((state) => ({
        jobs: state.jobs.map((job) =>
          job.id === jobId ? { ...job, summary: data.summary } : job
        ),
      }));
    } catch (error: any) {
      console.error('❌ Failed to summarize job:', error);
    }
  },
}));
