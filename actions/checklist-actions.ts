"use server";

import { Checklist } from '@/types';
import {db} from "@/lib/db"
import { revalidatePath } from 'next/cache';

export const fetchChecklists = async (cardId: string) => {
  const checklists = await db.checklist.findMany({
    where: {
      cardId,
    },
  });
  return checklists;
};

export const createChecklist = async (cardId: string, title: string) => {
  console.log("createChecklist", cardId, title)
  try {
    const createdChecklist = await db.checklist.create({
      data: {
        title,
        cardId,
      },
      
    });
    revalidatePath(`/cards/${cardId}`)
    console.log(createdChecklist)
    return createdChecklist;
  } catch(error){
    console.log(error);
  }
  
};

export const toggleChecklist = async (id: string, cardId: string, completed: boolean) => {
  const toggled = await db.checklist.update({
    where: {
      id,
    },
    data: {
      completed: !completed,
    },
  });
  revalidatePath(`/cards/${cardId}`)
  return toggled
};

export const deleteChecklist = async (id: string, cardId: string) => {
  await db.checklist.delete({
    where: {
      id,
    },
  });
  revalidatePath(`/cards/${cardId}`)
};
