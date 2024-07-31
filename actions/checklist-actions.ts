import { db } from '@/lib/db';
import { Checklist } from '@prisma/client';

interface CreateChecklistItemInput {
  cardId: string;
  title: string;
}

interface DeleteChecklistItemInput {
  id: string;
}

interface UpdateChecklistItemInput extends Checklist {}

export const createChecklistItem = async ({ cardId, title }: CreateChecklistItemInput): Promise<Checklist> => {
  return await db.checklist.create({
    data: {
      cardId,
      title,
      completed: false,
    },
  });
};


export const deleteChecklistItem = async ({ id }: DeleteChecklistItemInput): Promise<Checklist> => {
  return await db.checklist.delete({
    where: { id },
  });
};

export const updateChecklistItem = async (item: UpdateChecklistItemInput): Promise<Checklist> => {
  return await db.checklist.update({
    where: { id: item.id },
    data: item,
  });
};