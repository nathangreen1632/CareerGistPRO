import fetch from "node-fetch";

const JSEARCH_API_URL: string = process.env.JSEARCH_API_URL ?? "";
const JSEARCH_API_KEY: string = process.env.RAPIDAPI_KEY ?? "";
const RAPIDAPI_HOST: string = process.env.RAPIDAPI_HOST ?? "";

export const getJobListings = async (query: string) => {
  try {
    const response = await fetch(`${JSEARCH_API_URL}?query=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": JSEARCH_API_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST
      }
    });

    if (!response.ok) {
      throw new Error(`JSearch API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("JSearch API error:", error);
    throw new Error("Failed to fetch job listings.");
  }
};
