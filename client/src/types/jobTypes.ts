export interface JobDetails {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo?: string | null;
  employer_website?: string | null;
  job_publisher: string;
  job_employment_type: string;
  job_employment_types?: string[];
  job_apply_link?: string;
  job_apply_is_direct?: boolean;
  apply_options?: ApplyOption[];
  job_description: string;
  job_is_remote: boolean;
  job_posted_at: string | null;
  job_posted_at_timestamp?: number | null;
  job_posted_at_datetime_utc?: string | null;
  job_location: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_latitude?: number;
  job_longitude?: number;
  job_highlights?: JobHighlights;
  job_onet_soc?: string;
  job_onet_job_zone?: string;
  job_google_link?: string;
  job_benefits?: string[];
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_period?: string;
  job_salary?: number | null;
}

export interface ApplyOption {
  publisher: string;
  apply_link: string;
  is_direct: boolean;
}

export interface JobHighlights {
  Qualifications?: string[];
  Benefits?: string[];
  Responsibilities?: string[];
}

// client/src/types/jobTypes.ts

export interface UnifiedJob {
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
  postedAt?: string | null;
  logoUrl?: string;
  url?: string;
  jobId?: string;
}
