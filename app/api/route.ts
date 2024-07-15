import {StreamingTextResponse } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai'

export const runtime = 'edge';

export const maxDuration = 30;

export async function POST(req: any) {
    const { prompt }: { prompt: string } = await req.json();
    console.log(prompt)
    const promptsummary = `write a summary of the following: ${prompt} in less than 100 words`;
    console.log(prompt)

    const groq = createOpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: process.env.GROQ_API_KEY,
      });

      const  {text}  = await generateText({
        model: groq('llama3-8b-8192'),
        prompt: promptsummary,
      });

    console.log({text})

       return {
          messages: [
            prompt,
            {
              role: 'assistant' as const,
              content: text,
            },
          ]

    }
  }

    // return {
    //   messages: [
    //     ...history,
    //     {
    //       role: 'assistant' as const,
    //       content: text,
    //     },
