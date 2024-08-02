import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

import { ChromePicker } from 'react-color';
import { createLabel, fetchLabels } from '@/actions/label-actions';
import {Label} from '@/types';

const predefinedColors = ['#f00', '#0f0', '#00f', '#ffa500', '#800080', '#ffff00'];

interface LabelComponentProps {
  cardId: string;
}

const LabelComponent: React.FC<LabelComponentProps> = ({ cardId}) => {
  const queryClient = useQueryClient();
  
  const [newLabelTitle, setNewLabelTitle] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('');
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [editLabelTitle, setEditLabelTitle] = useState('');
  const [editLabelColor, setEditLabelColor] = useState('');


  const {
    data: labels,
    isLoading,
    error,
  } = useQuery<Label[]>({
    queryKey: ["labels",  cardId],
    queryFn: () => fetchLabels(cardId),
  });
  
  const createLabelMutation = useMutation({
    mutationFn: ({ title, color }: { title: string; color: string }) =>
      createLabel(cardId,  title, color ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels', cardId] });
      setNewLabelTitle('');
      setNewLabelColor('');
    },
  });

  // const updateLabelMutation = useMutation({
  //   mutationFn: (label: { id: string; title: string; color: string }) =>
  //     updateLabel(cardId, label),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['labels', cardId] });
  //     setEditingLabelId(null);
  //     setEditLabelTitle('');
  //     setEditLabelColor('');
  //   },
  // });

  // const deleteLabelMutation = useMutation({
  //   mutationFn: (labelId: string) => deleteLabel(cardId, labelId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['labels', cardId] });
  //   },
  // });

  const handleAddLabel = () => {
    if (newLabelTitle.trim() && newLabelColor.trim()) {
      createLabelMutation.mutate({ title: newLabelTitle.trim(), color: newLabelColor.trim() });
    }
  };

  const handleEditLabel = (id: string, title: string, color: string) => {
    setEditingLabelId(id);
    setEditLabelTitle(title);
    setEditLabelColor(color);
  };

  // const handleUpdateLabel = () => {
  //   if (editingLabelId && editLabelTitle.trim() && editLabelColor.trim()) {
  //     updateLabelMutation.mutate({
  //       id: editingLabelId,
  //       title: editLabelTitle.trim(),
  //       color: editLabelColor.trim(),
  //     });
  //   }
  // };

  // const handleDeleteLabel = (labelId: string) => {
  //   deleteLabelMutation.mutate(labelId);
  // };

  return (
    <div className="flex flex-col mb-2">
      <Popover>
        <PopoverTrigger>
          <Button className="text-sm" variant={'gray'} size={'inline'}>Add Label</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="p-4">
            {predefinedColors.map((color) => (
              <div key={color} className="flex items-center mb-2">
                <input type="checkbox" className="mr-2" />
                <div
                  className="flex-grow h-6 rounded"
                  style={{ backgroundColor: color }}
                />
                <Popover>
                  <PopoverTrigger>
                    <Button onClick={() => { setNewLabelColor(color); }}>Add Title</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Input
                      value={newLabelTitle}
                      onChange={(e) => setNewLabelTitle(e.target.value)}
                      placeholder="Label title"
                      className="mb-2"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            ))}
            <div className="flex items-center mb-2">
              <ChromePicker
                color={newLabelColor}
                onChange={(color: { hex: React.SetStateAction<string>; }) => setNewLabelColor(color.hex)}
              />
            </div>
            <Button onClick={handleAddLabel} disabled={createLabelMutation.isPending}>
              Add
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap space-x-2 mt-2">
        {labels?.map((label: Label) => (
          <div
            key={label.id}
            className="flex items-center justify-between rounded-lg h-6 w-24 px-2"
            style={{ backgroundColor: label.color }}
            title={label.title}
          >
            <span>{label.title}</span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditLabel(label.id, label.title, label.color)}
                className="text-blue-500"
              >
                Add Title
              </button>
              <button
                // onClick={() => handleDeleteLabel(label.id)}
                className="text-red-500"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default LabelComponent;
