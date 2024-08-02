import { db } from '@/lib/db';
import { fetcher } from '@/lib/fetcher';
import { revalidatePath } from 'next/cache';

export const createLabel = async (cardId: string,  title: string, color: string) => {
  try {
    const createdLabel = await db.label.create({
      data: {
        cardId,
        title,
        color,
        
      },
      
    });
    revalidatePath(`/cards/${cardId}`)
    console.log(createdLabel)
    return createdLabel;
  } catch(error){
    console.log(error);
  }
};

export const fetchLabels = async (cardId: string) => {
  const labels = await db.label.findMany({
    where: {
      cardId: cardId,
      },
  });
  console.log(labels + " from label actions")
  return labels;
};

export const updateLabel = async (label: { id: string; title: string; color: string }, cardId: string) => {
  const response = await fetch(`/api/cards/${cardId}/labels/${label.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(label),
  });

  if (!response.ok) {
    throw new Error('Failed to update label');
  }

  return response.json();
};

export const deleteLabel = async (labelId: string, cardId: string) => {
  const response = await fetch(`/api/cards/${cardId}/labels`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: labelId }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete label');
  }

  return response.json();
};
