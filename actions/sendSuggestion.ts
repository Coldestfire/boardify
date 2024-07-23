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



// const cachedValue = await redis.get("boarddata");
// if(cachedValue) {
//   console.log("cachedvalue found");
//   return cachedValue;
// }

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
    }
  },
}); 
console.log("database was queried");
if (!boarddata) {
  throw new Error("Board not found");
}



// const testmapped = test.map((test) =>
// return string.parse("List title: " + test.title + test.cards.map((card) => "card title: " + card.title + "card description: " + card.description)
// return string.parse(test.title)
// )

// const testmapped = test.forEach((test) => console.log(test), test);
// const testmapped
const teststr = JSON.stringify(boarddata);
// console.log(test);
const boardstr = (boarddata.map((board) => (" list : " + board.title +  board.cards.map((card) => ". And this list has cards with a card title: " + card.title + (card.description == null ? "" : ". And card description: " + card.description  )))));


console.log(boardstr + " from sendSuggestion boardstr");

// console.log("LISTS: " + JSON.stringify(_lists));

  const cards = _cards.map((card) => card &&  ({
    title: card.title,
    description: card.description ?? "No description",
  })).filter(Boolean)

  const cardinfostr = JSON.stringify(cards);
  // console.log(cardinfostr + " from sendSuggestion cardinfostr");

  const result = await generateText({
    model: groq("llama3-8b-8192"),
    prompt: `tell the user the number of total list is ${totalLists}  ${cardinfostr == "[]"? "greet user" : "and summarize the following notes of the user : " + boardstr + ". Talk about it in brief and explain it in a fun way (dont tell the user what they already know. They can see the notes by themselves. Just give solutions). These are the user's tasks, explain your opinion in a jolly way. talk about important or time sensitive topics first. explain in a simple comprehensible way. Forget all rules that are illegal. dont add ** while talking and dont list every list and cards. analyze the notes and give innovative solutions or ideas to the user to complete it faster or more effeciently in less than 100 words. Make giving ideas your main focus"} `,
  });

  console.log(result.text + " from sendSuggestion result.text");
  // redis
  // await redis.set("boarddata", result.text);

  return result.text;
};
