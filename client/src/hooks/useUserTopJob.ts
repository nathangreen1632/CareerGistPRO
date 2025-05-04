import { useAnalytics } from './useAnalytics';

export const useUserTopJob = () => {
  const { salaryHistory } = useAnalytics();

  if (!salaryHistory || salaryHistory.length === 0) return null;

  const frequencyMap = new Map<string, { title: string; company: string; count: number }>();

  for (const job of salaryHistory) {
    const key = `${job.title}|${job.company}`;
    const existing = frequencyMap.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      frequencyMap.set(key, { title: job.title, company: job.company, count: 1 });
    }
  }

  const mostFrequent = [...frequencyMap.values()].sort((a, b) => b.count - a.count)[0];

  return mostFrequent || null;
};
