import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getOpenAIQuestions = async (prompt: string): Promise<string[]> => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI interview coach that writes behavioral and technical interview questions for software developers.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
    });

    const rawText = completion.choices[0]?.message?.content ?? '';

    // 🧠 Parse numbered list (e.g., "1. Question", "2. Question")
    const questions = rawText
      .split(/\n+/)
      .map((line) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((q) => q.length > 10); // Filter out junk lines

    return questions;
  } catch (err) {
    console.error('❌ OpenAI API error:', err);
    return [];
  }
};
