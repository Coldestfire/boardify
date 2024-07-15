"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { CountList } from "./schema";
import { InputType } from "./types";

const handler = async (data: InputType): Promise<any> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Error: not authorized"
    };
  }

  const { id, boardId } = data;
  let count;

  try {
 

   count = await db.list.count({
      where: {
        board: {
          orgId,
        },
      },
    });

    count.toString();
    console.log(count);

  } catch (error) {
    return {
      error: "Failed to count",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return count;
};

export const countList = createSafeAction(CountList, handler);