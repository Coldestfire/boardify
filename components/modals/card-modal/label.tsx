"use client";
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { createLabel, fetchLabels } from '@/actions/label-actions';
import { Label } from '@/types';

const predefinedColors = ['#f00', '#0f0', '#00f', '#ffa500','#ffff00', '#800080', ];

interface LabelComponentProps {
  cardId: string;
}

const LabelComponent: React.FC<LabelComponentProps> = ({ cardId }) => {
  const queryClient = useQueryClient();
  const [newLabelTitle, setNewLabelTitle] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('');

  const { data: labels, isLoading, error } = useQuery<Label[]>({
    queryKey: ["labels", cardId],
    queryFn: async () => {
      const result = await fetchLabels(cardId);
      return result ?? [];
    },
  });

  const createLabelMutation = useMutation({
    mutationFn: ({ title, color }: { title: string; color: string }) =>
      createLabel(cardId, title, color),
    onSuccess: (newLabel) => {
      if (newLabel) {
        queryClient.setQueryData<Label[]>(["labels", cardId], (old) => {
          if (!old) return [newLabel];
          return [...old, newLabel];
        });
      }
      setNewLabelTitle('');
      setNewLabelColor('');
    },
  });

  const handleAddLabel = () => {
  
      createLabelMutation.mutate({title: newLabelTitle, color: newLabelColor });
    
  
  };



  return (
    <div className="flex flex-col mb-2">
      {error && <p>Error fetching labels: {error.message}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
      <>
          <Popover>
            <PopoverTrigger>
              <Button className="text-sm" variant={'gray'} size={'inline'} style={{marginTop: "10px", width: "100%", textAlign: "left", paddingRight: "60px"}}>Add Label</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4">
                <Input
                  value={newLabelTitle}
                  onChange={(e) => setNewLabelTitle(e.target.value)}
                  placeholder="Label title"
                  className="mb-2"
                />
                <div className="flex flex-wrap mb-2 ml-2">
                  {predefinedColors.map((color) => (
                    <div
                      key={color}
                      className={`h-6 w-6 mr-2.5  rounded-full cursor-pointer ${newLabelColor === color ? 'ring-2 ring-blue-500' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewLabelColor(color)}
                    />
                  ))}
                </div>
                <Button onClick={handleAddLabel} >
                  Add
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex flex-wrap space-x-2 mt-2">
            {labels?.map((label: Label) => (
              <div
                key={label.id}
                className="flex items-center justify-between rounded-lg h-8 px-2 mr-2 mb-2 "
                style={{ backgroundColor: label.color }}
                title={label.title}
              >
                <span className="text-white text-sm font-medium">{label.title}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
    
  );
};

export default LabelComponent;
