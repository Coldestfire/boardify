import { db } from '@/lib/db';
import { fetcher } from '@/lib/fetcher';
import { revalidatePath } from 'next/cache';

export const createLabel = async (cardId: string, title: string, color: string) => {
  try {
    const createdLabel = await db.label.create({
      data: {
        cardId,
        title,
        color,
      },
    });
    revalidatePath(`/cards/${cardId}`);
    console.log(createdLabel);
    return createdLabel;
  } catch (error) {
    console.log(error);
  }
};

export const fetchLabels = async (cardId: string) => {
  try {
    const labels = await db.label.findMany({
      where: {
        cardId,
      },
    });
    console.log(labels + " from label actions");
    return labels;
  } catch (error) {
    console.log(error);
  }
};

export const createLabelTitle = async (id: string, cardId: string, title: string) => {
  const labeltitle = await db.checklist.update({
    where: {
      id,
    },
    data: {
      title: title,
    },
  });
  revalidatePath(`/cards/${cardId}`);
  return labeltitle;
};

export const deleteLabel = async (id: string, cardId: string) => {
  await db.label.delete({
    where: {
      id,
    },
  });
  revalidatePath(`/cards/${cardId}`);
};
