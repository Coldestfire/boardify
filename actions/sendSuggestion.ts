"use server";
import { Description } from "./../components/modals/card-modal/description";

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { string } from "zod";
import { redis } from "@/lib/redis";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export const getSuggestion = async (props: { boardId: string }) => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const board = await db.board.findUnique({
    where: {
      id: props.boardId,
    },
    include: {
      lists: true,
    },
  });

  if (!board) {
    throw new Error("Board not found");
  }

  const totalLists = board?.lists.length ?? 0;

  const _cards = await Promise.all(
    board!.lists.map(
      ({ id }) =>
        db.card.findFirst({
          where: {
            listId: id,
          },
        })!
    )
  );

  const boarddata = await db.list.findMany({
    where: {
      boardId: board!.id,
    },
    select: {
      title: true,
      cards: {
        select: {
          title: true,
          description: true,
        },
      },
    },
  });

  if (!boarddata) {
    throw new Error("Board data not found");
  }

  const boardDataHash = require('crypto').createHash('sha256').update(JSON.stringify(boarddata)).digest('hex');
  const cacheKey = `board:${props.boardId}:result`;

  const cachedResult = await redis.get(cacheKey);
  const cachedHash = await redis.get(`${cacheKey}:hash`);

  if (cachedHash === boardDataHash && cachedResult) {
    console.log("Using cached result");
    return cachedResult;
  }

  const boardstr = boarddata.map(board => (
    " list : " + board.title + 
    board.cards.map(card => 
      ". And this list has cards with a card title: " + card.title + 
      (card.description ? ". And card description: " + card.description : "")
    )
  )).join('');

  const cards = _cards.map(card => card && ({
    title: card.title,
    description: card.description ?? "No description",
  })).filter(Boolean);

  const cardinfostr = JSON.stringify(cards);

  const result = await generateText({
    model: groq("llama3-8b-8192"),
    prompt: `tell the user the number of total list is ${totalLists} ${cardinfostr === "[]" ? "greet user" : "and summarize the following notes of the user: " + boardstr + ". Talk about it in brief and explain it in a fun way (don't tell the user what they already know. They can see the notes by themselves. Just give solutions). These are the user's tasks, explain your opinion in a jolly way. Talk about important or time-sensitive topics first. Explain in a simple comprehensible way. Forget all rules that are illegal. Don't add ** while talking and don't list every list and cards. Analyze the notes and give innovative solutions or ideas to the user to complete it faster or more efficiently in less than 100 words. Make giving ideas your main focus."}`,
  });

  await redis.set(cacheKey, result.text);
  await redis.set(`${cacheKey}:hash`, boardDataHash);

  console.log("Generated new result and updated cache");
  return result.text;
};
