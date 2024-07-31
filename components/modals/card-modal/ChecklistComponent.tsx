import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { createChecklistItem, updateChecklistItem, deleteChecklistItem } from '@/actions/checklist-actions';
import { ChecklistItem } from '@/types';

interface ChecklistComponentProps {
  cardId: string;
}

const ChecklistComponent: React.FC<ChecklistComponentProps> = ({ cardId }) => {
  const queryClient = useQueryClient();
  const [newChecklistTitle, setNewChecklistTitle] = useState('');

  // Fetch checklists
  const { data: checklists = [], isLoading } = useQuery({
    queryKey: ['checklists', cardId],
    queryFn: () => fetch(`/api/cards/${cardId}/checklists`).then(res => res.json()),
  });

  // Mutations
  const createChecklistMutation = useMutation({
    mutationFn: (title: string) => createChecklistItem({ cardId, title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists', cardId] });
      setNewChecklistTitle('');
    },
  });

  const updateChecklistMutation = useMutation({
    mutationFn: (item: ChecklistItem) => updateChecklistItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists', cardId] });
    },
  });

  const deleteChecklistMutation = useMutation({
    mutationFn: (itemId: string) => deleteChecklistItem({ id: itemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists', cardId] });
    },
  });

  const handleAddChecklist = () => {
    if (newChecklistTitle.trim()) {
      createChecklistMutation.mutate(newChecklistTitle.trim());
    }
  };

  const handleToggleItem = (item: ChecklistItem) => {
    updateChecklistMutation.mutate({ ...item, completed: !item.completed });
  };

  const handleDeleteItem = (itemId: string) => {
    deleteChecklistMutation.mutate(itemId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Checklists</h3>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {checklists.map((checklist: ChecklistItem) => (
            <div key={checklist.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span>{checklist.title}</span>
                <Button onClick={() => handleDeleteItem(checklist.id)}>Delete</Button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={checklist.completed}
                  onChange={() => handleToggleItem(checklist)}
                />
                <span>{checklist.title}</span>
              </div>
            </div>
          ))}
        </>
      )}
      <Popover>
        <PopoverTrigger>
          <Button>Add Checklist</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Input
            value={newChecklistTitle}
            onChange={(e) => setNewChecklistTitle(e.target.value)}
            placeholder="New checklist title"
          />
          <Button className="mt-2" onClick={handleAddChecklist}>Add</Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ChecklistComponent;