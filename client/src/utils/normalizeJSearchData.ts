import { JobDetails } from '../types/jobTypes';

export const normalizeJSearchData = (rawJobs: JobDetails[]) => {
  return rawJobs.map((job) => ({
    id: job.job_id,
    title: job.job_title,
    company: job.employer_name,
    location: job.job_location,
    description: job.job_description,
    summary: '',
    applyLink: job.job_apply_link ?? job.job_google_link ?? '',
    isRemote: job.job_is_remote,
    postedAt: job.job_posted_at,
    highlights: job.job_highlights,
    salaryMin: job.job_min_salary,
    salaryMax: job.job_max_salary,
    salaryPeriod: job.job_salary_period,
    benefits: job.job_benefits ?? [],
    logoUrl: job.employer_logo ?? '',
  }));
};