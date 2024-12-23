"use client";

import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";

import { useCardModal } from "@/hooks/use-card-modal";
import { fetchLabels} from '@/actions/label-actions';
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/types";




interface CardItemProps {
  data: Card;
  index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
  const cardModal = useCardModal();

  const { data: labels, isLoading, error } = useQuery<Label[]>({
    queryKey: ["labels", data.id], // Data will be refetched when the query key is invalidated
    queryFn: async () => {
      const result = await fetchLabels(data.id);
      return result ?? [];
    },
    
  }
);
  

  // if (isLoading) {
  //   return <div></div>;
  // }

  {labels?.map((label: Label) => (
   console.log(label.title)
  ))}

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => cardModal.onOpen(data.id)}
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm flex justify-between"
        >
          {data.title}
          
          <div className="flex items-center gap-x-1">
            {labels?.map((label: Label) => (
              <span
                key={label.id}
                style={{ backgroundColor: label.color }}
                className="inline-block w-5 h-5 rounded-full"
                title={label.title} // Optional: show label title on hover
              />
            ))}
          </div>

          
        </div>
      )}
    </Draggable>
  );
};