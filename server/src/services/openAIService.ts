import fetch, { Response } from "node-fetch";

const CAREER_GIST_URL: string = process.env.CAREER_GIST_URL ?? "";
const CAREER_GIST_API: string = process.env.CAREER_GIST_API ?? "";

export const generateEnhancedJobData = async (jobData: any) => {
  try {
    const jobs = Array.isArray(jobData)
      ? jobData
      : jobData.jobs ?? jobData.listings ?? Object.values(jobData);

    if (!Array.isArray(jobs) || jobs.length === 0) {
      console.error("Job data is not in the expected format or is empty.");
      return [];
    }

    const MAX_JOBS = 15;
    const limitedJobs = jobs.slice(0, MAX_JOBS);

    const prompt = `You are an API that returns JSON. 
      Format your response as a **valid JSON array** of job objects without any markdown formatting, text explanations, or backticks. 
      Here is the job data that needs summarization and enhancement:

      ${JSON.stringify(limitedJobs, null, 2)}
      
      The JSON structure must follow this format and order:
      [
        {
          "job_id": "If available",
          "job_title": "Job Title",
          "job_details": "If available",
          "employer_name": "Company Name",
          "job_publisher": "If available",
          "employer_name": "Company Name",
          "job_location": "City, State, Country",
          "job_description": "Give a detailed, but concise, job description that is **500 words or less**",
          "job_employment_type": "If available",
          "job_apply_link": "URL to the job posting",
          "job_highlights": {
            "Responsibilities": "If available",
            "Qualifications": "If available",
            "Benefits": "If available",
          },
          "job_is_remote": "If available",
          "job_posted_at": "If available",
          "job_salary": "If available",
          "job_is_remote": "If available",
          "responsibilities": "Give a detailed, but concise, job description that is **250 words or less**",
          "qualifications": "List of qualifications",
          "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
          "url": "URL to the job posting",
          "job_posted_at": "If available",
        }
      ]
      
      Ensure there is no additional formatting, explanations, or surrounding text. Return **ONLY** a valid JSON array.`;

    const response: Response = await fetch(CAREER_GIST_URL ?? "", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CAREER_GIST_API}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    if (!data.choices?.[0]?.message?.content) {
      return jobData; // Ensure raw data is returned

    } try {
      const question = JSON.parse(data.choices[0].message.content); // change to real variable name
      return question.map((job: any) => ({ // change to real variable name
        job_id: job.job_id,
        job_title: job.job_title,
        employer_name: job.employer_name,
        job_publisher: job.job_publisher,
        job_location: job.job_location,
        job_description: job.job_description,
        job_employment_type: job.job_employment_type,
        job_apply_link: job.job_apply_link,
        job_highlights: job.job_highlights,
        job_is_remote: job.job_is_remote,
        job_posted_at: job.job_posted_at,
        job_city: job?.job_city,
        job_state: job?.job_state,
        job_country: job?.job_country,
      }));
    } catch {
      return [];
    }
  } catch {
    return [];
  }
};
