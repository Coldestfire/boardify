"use client";
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { createLabel, fetchLabels, deleteLabel } from '@/actions/label-actions';
import { Label } from '@/types';

const predefinedColors = ['#f00', '#0f0', '#00f', '#ffa500', '#ffff00', '#800080'];

interface LabelComponentProps {
  cardId: string;
}

const LabelComponent: React.FC<LabelComponentProps> = ({ cardId }) => {
  const queryClient = useQueryClient();
  const [newLabelTitle, setNewLabelTitle] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('');
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [deletingLabelId, setDeletingLabelId] = useState<string | null>(null);

  const { data: labels, isLoading, error } = useQuery<Label[]>({
    queryKey: ["labels", cardId],
    queryFn: async () => {
      const result = await fetchLabels(cardId);
      return result ?? [];
    },
  });

  const createLabelMutation = useMutation({
    mutationFn: ({ title, color }: { title: string; color: string }) =>
      createLabel(cardId, { title, color }),
    onSuccess: (newLabel) => {
      if (newLabel) {
        queryClient.setQueryData<Label[]>(["labels", cardId], (old) => {
          if (!old) return [newLabel];
          return [...old, newLabel];
        });
      }
      setNewLabelTitle('');
      setNewLabelColor('');
      setPopoverOpen(false); // Close the popover after label creation
    },
  });

  const deleteLabelMutation = useMutation({
    mutationFn: ({ id, cardId }: { id: string; cardId: string }) =>
      deleteLabel(id, cardId),
    onMutate: async ({ id }) => {
      // Cancel any ongoing queries for labels
      await queryClient.cancelQueries({ queryKey: ["labels", cardId] });
  
      // Snapshot the previous state
      const previousLabels = queryClient.getQueryData<Label[]>(["labels", cardId]);
  
      // Optimistically update the labels
      queryClient.setQueryData<Label[]>(["labels", cardId], (old) =>
        old?.filter((label) => label.id !== id)
      );
  
      // Return a context object with the previous state
      return { previousLabels };
    },
    onError: (_error, _variables, context) => {
      // Rollback to the previous state if the mutation fails
      if (context?.previousLabels) {
        queryClient.setQueryData(["labels", cardId], context.previousLabels);
      }
    },
    onSettled: () => {
      // Invalidate the query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["labels", cardId] });
      setDeletingLabelId(null); // Reset deletingLabelId
    },
  });

  const handleAddLabel = () => {
    if (!newLabelColor) {
      alert("Please select a color for the label.");
      return;
    }
    createLabelMutation.mutate({ title: newLabelTitle, color: newLabelColor });
  };

  const handleDeleteLabel = (id: string) => {
    // setDeletingLabelId(id);
    deleteLabelMutation.mutate({ id, cardId });
  };

  return (
    <div className="flex flex-col mb-2">
      {error && <p>Error fetching labels: {error.message}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger>
              <Button
                className="text-sm"
                variant="gray"
                size="inline"
                style={{
                  marginTop: "10px",
                  width: "100%",
                  textAlign: "left",
                  paddingRight: "6px",
                }}
              >
                Add Label
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4">
                <Input
                  value={newLabelTitle}
                  onChange={(e) => setNewLabelTitle(e.target.value)}
                  placeholder="Label title (optional)"
                  className="mb-2"
                />
                <div className="flex flex-wrap mb-2 ml-2">
                  {predefinedColors.map((color) => (
                    <div
                      key={color}
                      className={`h-6 w-6 mr-2.5 rounded-full cursor-pointer ${newLabelColor === color ? "ring-2 ring-blue-500" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewLabelColor(color)}
                    />
                  ))}
                </div>
                <Button onClick={handleAddLabel}>
                  {createLabelMutation.status === "pending"  ? "Adding..." : "Add"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex flex-wrap space-x-2 mt-2">
          {labels?.map((label: Label) => (
    <div
      key={label.id}
      className="flex items-center justify-between rounded-lg h-8 px-5 py-5 mr-2 mb-2"
      style={{ backgroundColor: label.color }}
      title={label.title}
    >
      <span className="text-slate-200 text-sm font-bold">
        {deletingLabelId === label.id ? "Deleting..." : label.title}
      </span>
      {deletingLabelId !== label.id && (
        <Button
          onClick={() => handleDeleteLabel(label.id)}
          variant="ghost"
          size="sm"
          className="ml-auto bg-transparent border-none"
        >
         X
        </Button>
      )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LabelComponent;
