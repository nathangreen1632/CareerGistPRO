import { Request, Response } from 'express';
import { OpenAI } from 'openai';
import db from '../database/models/index.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const summarizeJobDescription = async (req: Request, res: Response): Promise<void> => {
  const { jobId, description } = req.body;

  if (!jobId || !description) {
    res.status(400).json({ error: 'Missing jobId or description.' });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `Summarize the following job description in 4-5 concise sentences:\n\n${description}`,
        },
      ],
    });

    const summary = completion.choices[0].message.content ?? 'Summary not available.';

    const job = await db.Job.findOne({ where: { sourceId: jobId } });

    if (!job) {
      res.status(404).json({ error: 'Job not found. Cannot update summary.' });
      return;
    }

    await job.update({ summary });

    res.json({ summary, source: 'openai' });
  } catch (error) {
    console.error('❌ OpenAI error:', error);
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
};
