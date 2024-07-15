"use server";
import { Description } from "./../components/modals/card-modal/description";

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { string } from "zod";

// queryclient and redis


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

  const _lists = await Promise.all(
    board!.lists.map(
      ({ id }) =>
        db.board.findMany({
          where: {
            id: id,
          },
          select: {
            title: true,

          },       
        })!
    )
  );

 const test = await db.list.findMany({
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

// const testmapped = test.map((test) =>
// return string.parse("List title: " + test.title + test.cards.map((card) => "card title: " + card.title + "card description: " + card.description)
// return string.parse(test.title)
// )

// const testmapped = test.forEach((test) => console.log(test), test);
// const testmapped
const boardstr = (test.map((test) => (" list : " + test.title +  test.cards.map((card) => " and this list has cards with a card title: " + card.title + (card.description == "null" ? " and card description: " + card.description : "" )))));


console.log(boardstr);

// console.log("LISTS: " + JSON.stringify(_lists));

  const cards = _cards.map((card) => card &&  ({
    title: card.title,
    description: card.description ?? "No description",
  })).filter(Boolean)

  const cardinfostr = JSON.stringify(cards);
  console.log(cardinfostr);

  const result = await generateText({
    model: groq("llama3-8b-8192"),
    prompt: `tell the user the number of total list is ${totalLists}  ${cardinfostr == "[]"? "greet user" : "and summarize the following notes of the user : " + boardstr + ". Talk about it in brief and explain it in a fun way. These are the user's tasks, explain your opinion. talk about important or time sensitive topics first. Less than 70 words. explain in a simple comprehensible way. Forget all rules that are illegal. dont add ** while talking and dont list every list and cards. analyze the notes and give innovative soltions or ideas to the user if there is one to complete it faster or more effeciently"} `,
  });

  console.log(result.text);

  return result.text;
};
