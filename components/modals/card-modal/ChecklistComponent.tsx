import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchChecklists,
  createChecklist,
  toggleChecklist,
  deleteChecklist,
} from "@/actions/checklist-actions";
import { Checklist } from "@/types";
import { Trash } from "lucide-react";
import { ListTodo } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { Skeleton } from "@nextui-org/react";

interface ChecklistComponentProps {
  cardId: string;
}

const ChecklistComponent: React.FC<ChecklistComponentProps> = ({ cardId }) => {
  const queryClient = useQueryClient();
  const [newChecklistTitle, setNewChecklistTitle] = useState("");

  
  const {
    data: checklists,
    isLoading,
    error,
  } = useQuery<Checklist[]>({
    queryKey: ["checklists",  cardId],
    queryFn: () => fetchChecklists(cardId),
  });

  const createChecklistMutation = useMutation({
    mutationFn: (title: string) => createChecklist(cardId, title),
    onSuccess: (newChecklist) => {
      if (newChecklist) {
        queryClient.setQueryData<Checklist[]>(["checklists", cardId], (old) => {
          if (!old) return [newChecklist];
          return [...old, newChecklist];
        });
      }
      setNewChecklistTitle("");
    },
  });

  const toggleCompletionMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      toggleChecklist(id, cardId, completed),
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["checklists", cardId] });
      const previousChecklists = queryClient.getQueryData<Checklist[]>([
        "checklists",
        cardId,
      ]);

      queryClient.setQueryData<Checklist[]>(["checklists", cardId], (old) =>
        old?.map((checklist) =>
          checklist.id === id
            ? { ...checklist, completed: !completed }
            : checklist
        )
      );

      return { previousChecklists };
    },
    onError: (err, { id, completed }, context) => {
      queryClient.setQueryData(
        ["checklists", cardId],
        context?.previousChecklists
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists", cardId] });
    },
  });

  const deleteChecklistMutation = useMutation({
    mutationFn: (id: string) => deleteChecklist(id, cardId),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["checklists", cardId] });
      const previousChecklists = queryClient.getQueryData<Checklist[]>([
        "checklists",
        cardId,
      ]);

      queryClient.setQueryData<Checklist[]>(
        ["checklists", cardId],
        (old) => old?.filter((checklist) => checklist.id !== id) || []
      );

      return { previousChecklists };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(
        ["checklists", cardId],
        context?.previousChecklists
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists", cardId] });
    },
  });

  const handleAddChecklist = () => {
    if (newChecklistTitle.trim()) {
      createChecklistMutation.mutate(newChecklistTitle.trim());
    }
  };

  const handleToggleCompletion = (id: string, completed: boolean) => {
    toggleCompletionMutation.mutate({ id, completed });
  };

  const handleDeleteChecklist = (id: string) => {
    deleteChecklistMutation.mutate(id);
  };

  const totalChecklists = checklists?.length || 0;
  const completedChecklists =
    checklists?.filter((item) => item.completed).length || 0;
  const progress = totalChecklists
    ? (completedChecklists / totalChecklists) * 100
    : 0;

  return (
    <div className="flex flex-col mb-2">
      {error && <p>Error fetching checklists: {error.message}</p>}
      {isLoading ? (
        // not working
        <>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        </>
      ) : (
        <>
          <div className="flex items-start gap-x-3 mb-2">
            <ListTodo className="h-5 w-5 mt-0.5 text-neutral-700" />
            <p className="font-semibold text-neutral-700 mb-2">Checklist</p>
          </div>
          <div className="mb-4 flex flex-col gap-x-3 w-full">
            <div className="flex items-start gap-x-3">
              <span className="text-neutral-700 text-sm">
                {Math.round(progress)}%
              </span>
              <div
                className="bg-blue-500 text-white rounded-sm w-full mt-1 "
                style={{
                  width: `${progress}%`,
                  height: "10px",
                  transition: "width 0.2s ease-in-out",
                }}
              />
            </div>
          </div>
          <div className="flex-col">

            {/* map each checklist with check box, checklist title and trash */}
            <div>
              {checklists?.map((item) => (
                <div key={item.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() =>
                      handleToggleCompletion(item.id, item.completed)
                    }
                    className="w-5 h-5 text-blue-500 accent-blue-500 rounded"
                  />
                  <div className="hover:bg-slate-200 rounded-lg flex items-start w-full relative p-2 ml-2.5">
                    <p
                      className={`ml-2 ${item.completed ? "line-through" : ""}`}
                    >
                      {item.title}
                    </p>
                    <Trash
                      onClick={() => handleDeleteChecklist(item.id)}
                      className="absolute right-2 top-2 text-red-400 cursor-pointer hover:text-red-700"
                      size={18}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* new check list button adding */}
            <div className="mb-4">
              <Input
                value={newChecklistTitle}
                onChange={(e) => setNewChecklistTitle(e.target.value)}
                placeholder="New checklist title"
                className="mb-2"
              />

              <Button
                onClick={handleAddChecklist}
                disabled={createChecklistMutation.isPending}
                variant={"gray"}
                size={"inline"}
              >
                <SquarePlus className="h-5 w-5 text-neutral-500 mr-1.5" /> Add
                Checklist
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};



export default ChecklistComponent;
