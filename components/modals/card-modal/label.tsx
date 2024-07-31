import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { createLabel, getLabelsForCard } from '@/actions/label-actions';
import { Label } from '@prisma/client';

interface LabelComponentProps {
  cardId: string;
  labels: Label[];
}


const LabelComponent: React.FC<LabelComponentProps> = ({ cardId, labels }) => {
  const queryClient = useQueryClient();
  const [newLabelTitle, setNewLabelTitle] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('');

  const createLabelMutation = useMutation({
    mutationFn: ({ title, color }: { title: string; color: string }) =>
      createLabel(cardId, { title, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels', cardId] });
      setNewLabelTitle('');
      setNewLabelColor('');
    },
  });

  const handleAddLabel = () => {
    if (newLabelTitle.trim() && newLabelColor.trim()) {
      createLabelMutation.mutate({ title: newLabelTitle.trim(), color: newLabelColor.trim() });
    }
  };


  return (
    <div className="flex justify-between items-center mb-2">
      <Popover>
        <PopoverTrigger>
          <Button className="text-sm">Add Label</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="p-4">
            <Input
              value={newLabelTitle}
              onChange={(e) => setNewLabelTitle(e.target.value)}
              placeholder="Label title"
              className="mb-2"
            />
            <Input
              value={newLabelColor}
              onChange={(e) => setNewLabelColor(e.target.value)}
              placeholder="Label color"
              className="mb-2"
            />
            <Button onClick={handleAddLabel} disabled={createLabelMutation.isPending}>
              Add
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex space-x-2">
        {labels.map((label) => (
          <span
            key={label.id}
            className="rounded-full h-4 w-4"
            style={{ backgroundColor: label.color }}
            title={label.title}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default LabelComponent;
