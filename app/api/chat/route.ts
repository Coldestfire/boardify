
import { createOpenAI } from '@ai-sdk/openai';
import { CoreMessage, generateText, streamText } from 'ai'

export const runtime = 'edge';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: CoreMessage[] } = await req.json();

    const groq = createOpenAI({
        baseURL: 'https://api.groq.com/openai/v1/chat/completions',
        apiKey: process.env.GROQ_API_KEY,
      });

      const  result  = await streamText({
        model: groq('mixtral-8x7b-32768'),
        messages,
      });

    console.log(messages);

       return result.toAIStreamResponse();

  }

