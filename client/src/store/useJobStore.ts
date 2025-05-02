import { create } from 'zustand';
import { normalizeAdzunaData } from '../utils/normalizeAdzunaData'; // 🛠 switched to Adzuna normalizer
import { UnifiedJob } from '../types/jobTypes'; // ✅ Clean import

interface SearchFilters {
  title?: string;
  location?: string;
  radius?: number;
}

interface JobStore {
  jobs: UnifiedJob[];
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  searchFilters: SearchFilters;
  fetchJobs: () => Promise<void>;
  summarizeJob: (jobId: string, description: string) => Promise<void>;
  updateSearchFilters: (filters: SearchFilters) => void;
  resetSearchFilters: () => void;
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],
  currentPage: 1,
  hasMore: true,
  isLoading: false,
  error: null,
  searchFilters: {},

  fetchJobs: async () => {
    const { currentPage, jobs, searchFilters } = get();
    try {
      set({ isLoading: true, error: null });

      const queryParams = new URLSearchParams({
        page: String(currentPage),
        ...(searchFilters.title ? { title: searchFilters.title } : {}),
        ...(searchFilters.location ? { location: searchFilters.location } : {}),
        ...(searchFilters.radius ? { radius: String(searchFilters.radius) } : {}),
      }).toString();

      const response = await fetch(`/api/jobs?${queryParams}`);
      const data = await response.json();

      const normalizedJobs = normalizeAdzunaData(data.jobs ?? []).map(job => ({
        ...job,
        isRemote: typeof job.isRemote === 'boolean'
          ? job.isRemote ? 'remote' : undefined
          : job.isRemote
      })); // 🛠 updated to Adzuna and patched isRemote to string

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
          Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
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

  updateSearchFilters: (filters: SearchFilters) => {
    set((state) => ({
      ...state,
      searchFilters: {
        ...state.searchFilters,
        ...filters,
      },
      jobs: [],
      currentPage: 1,
      hasMore: true,
    }));
  },

  resetSearchFilters: () => {
    set((state) => ({
      ...state,
      searchFilters: {},
      jobs: [],
      currentPage: 1,
      hasMore: true,
    }));
  },
}));
