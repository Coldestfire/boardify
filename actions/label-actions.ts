import { db } from '@/lib/db';
import { Label } from '@prisma/client';

export const createLabel = async (cardId: string, data: { title: string; color: string }): Promise<Label> => {
  try {
    const label = await db.label.create({
      data: {
        ...data,
        cards: {
          connect: { id: cardId }
        }
      }
    });
    return label;
  } catch (error) {
    console.error('Failed to create label:', error);
    throw new Error('Failed to create label');
  }
};

export const updateLabel = async (labelId: string, data: { title: string; color: string }): Promise<Label> => {
  try {
    const label = await db.label.update({
      where: { id: labelId },
      data
    });
    return label;
  } catch (error) {
    console.error('Failed to update label:', error);
    throw new Error('Failed to update label');
  }
};

export const deleteLabel = async (labelId: string): Promise<Label> => {
  try {
    const label = await db.label.delete({
      where: { id: labelId }
    });
    return label;
  } catch (error) {
    console.error('Failed to delete label:', error);
    throw new Error('Failed to delete label');
  }
};

export const getLabelsForCard = async (cardId: string): Promise<Label[]> => {
  try {
    const labels = await db.label.findMany({
      where: {
        cards: {
          some: { id: cardId }
        }
      }
    });
    return labels;
  } catch (error) {
    console.error('Failed to get labels for card:', error);
    throw new Error('Failed to get labels for card');
  }
};