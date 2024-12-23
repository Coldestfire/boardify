"use server";

import { Label } from '@/types';
import {db} from "@/lib/db"
import { revalidatePath } from 'next/cache';

export const fetchLabels = async (cardId: string) => {
  const labels = await db.label.findMany({
    where: {
      cardId,
    },
  });
  return labels;
};

export const createLabel = async (cardId: string, { title, color }: { title: string; color: string }) => {
  console.log("createLabel", cardId, title);
  try {
    // Step 1: Get the boardId from the cardId
    const card = await db.card.findUnique({
      where: { id: cardId },
      select: {
        list: {
          select: {
            boardId: true
          }
        }
      }
    });

    if (!card) {
      throw new Error('Card not found');
    }

    const boardId = card.list.boardId;
    
    // Step 2: Create the label
    const createdLabel = await db.label.create({
      data: {
        cardId,
        title,
        color
      },
    });

    console.log("Board Id is: ", boardId);

    // Step 3: Revalidate the paths
    revalidatePath(`/cards/${cardId}`);  // Revalidate the card path to show updated label

    console.log(createdLabel);
    return createdLabel;

  } catch (error) {
    console.log(error);
  }
};


export const deleteLabel = async (id: string, cardId: string) => {
  await db.label.delete({
    where: {
      id,
    },
  });
  revalidatePath(`/cards/${cardId}`)
};
