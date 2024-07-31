import { fetcher } from '@/lib/fetcher';

// Function to create a label
export const createLabel = async (cardId: string, { title, color }: { title: string; color: string }) => {
  const response = await fetch(`/api/cards/${cardId}/labels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, color }),
  });

  if (!response.ok) {
    throw new Error('Failed to create label');
  }

  return response.json();
};

// Function to update a label
export const updateLabel = async (cardId: string, id: string, p0: { title: string; color: string; }, label: { id: string; title: string; color: string; }) => {
  const response = await fetch(`/api/cards/labels/${label.id}`, {
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

// Function to delete a label
export const deleteLabel = async (labelId: string) => {
  const response = await fetch(`/api/cards/labels/${labelId}`, {
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
