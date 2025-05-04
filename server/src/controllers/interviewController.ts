import { Request, Response } from 'express';
import { interviewTemplates } from '../utils/interviewTemplates.js';
import { getOpenAIQuestions } from '../utils/openaiHelpers.js';

export const getInterviewQuestions = async (req: Request, res: Response): Promise<void> => {
  const { title, company } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Job title is required.' });
    return;
  }

  const staticQuestions = interviewTemplates[title] || [
    `What do you know about ${company ?? 'the company'}?`,
    `Why do you want to work at ${company ?? 'this organization'}?`,
    `Describe a project where you used skills relevant to a ${title} role.`,
    `What are the most important qualities for a ${title}?`,
    `How do you stay up to date with technology trends relevant to a ${title}?`,
    `Tell me about a time you faced a challenge in your work as a ${title}.`,
    `How do you prioritize tasks when working on multiple projects?`,
    `Describe a situation where you had to work with a difficult team member.`,
    `How do you handle tight deadlines and pressure?`,
    `What is your approach to problem-solving in a ${title} role?`,
  ];

  const prompt = `Generate 5 behavioral interview questions for a ${title} at ${company ?? 'a reputable company'}. Format as a plain numbered list. Do NOT include any personal opinions or advice.`;

  try {
    const dynamicQuestions = await getOpenAIQuestions(prompt);

    res.json({
      static: staticQuestions,
      dynamic: dynamicQuestions?.length ? dynamicQuestions : [],
    });
  } catch (error: any) {
    console.error('❌ OpenAI interview generation error:', error);
    res.json({
      static: staticQuestions,
      dynamic: [],
    });
  }
};
