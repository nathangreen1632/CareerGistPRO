import { Request, Response } from 'express';
import { OpenAI } from 'openai';
import { getCache, setCache } from '../cache/redisCacheService.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const summarizeJobDescription = async (req: Request, res: Response): Promise<void> => {
  const { jobId, description } = req.body;

  if (!jobId || !description) {
    res.status(400).json({ error: 'Missing jobId or description.' });
    return;
  }

  const cacheKey = `summary:${jobId}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      res.json({ summary: cached, source: 'cache' });
      return;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `Summarize the following job description in 3-4 concise sentences:\n\n${description}`,
        },
      ],
    });

    const summary = completion.choices[0].message.content;
    await setCache(cacheKey, summary);

    res.json({ summary, source: 'openai' });
  } catch (error) {
    console.error('❌ OpenAI error:', error);
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
};
