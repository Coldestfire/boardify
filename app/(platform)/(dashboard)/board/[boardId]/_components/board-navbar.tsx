"use client";
import { Board } from "@prisma/client";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";
import AiSuggestion from "./ai-suggestion";

import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Spinner,
} from "@nextui-org/react";
import { Bot, LucideSparkle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getSuggestion } from "@/actions/sendSuggestion";
// import { redis } from "@/lib/redis";

interface BoardNavbarProps {
  data: Board;
}

export const BoardNavbar = ({ data }: BoardNavbarProps) => {
  const qc = useQueryClient();
  const [cachedBoardData, setCachedBoardData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const fetchCachedData = async () => {
  //     const cachedData = await redis.hget("boarddata", "boarddata");
  //     setCachedBoardData(cachedData);
  //   };

  //   fetchCachedData();
  // }, []);

  const refetchAiSuggestion = async () => {
    setIsLoading(true);
    try {
      await mutateAsync();
    } catch (error) {
      console.error("Error refetching AI suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAndRefetch = async () => {
      if (
        cachedBoardData !== null &&
        cachedBoardData !== JSON.stringify(data)
      ) {
        await refetchAiSuggestion();
      }
    };

    checkAndRefetch();
  }, [cachedBoardData, data]);


//aiSuggestions

const params = useParams<{ boardId: string }>();

  console.log(`params`, params);

  const {data: suggestions, mutateAsync, isPending: isFetchingSuggestions, error} = useMutation({
    mutationKey: ["get_suggestion_for_board", params.boardId],
    mutationFn: async () => {
      const suggestions = await getSuggestion({
        boardId: params.boardId,
      });
      console.log(suggestions + " from ai-suggestion");
      return suggestions;
    },
  });


  
  return (
    // adjust h below
    <div className="w-full h-fit z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      <BoardTitleForm data={data} />
      {/* REPLACE WITH AI SUGGESTION */}
      <div className="ml-auto mr-16">
        <Popover placement="bottom" showArrow={true}>
          <PopoverTrigger>
            <Button className="text-sm" onClick={refetchAiSuggestion}>
              <Bot /> click for AI suggestion
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            {isLoading ? (
              <div className="flex items-center justify-center px-5 py-2 md:py-5">
                <p className="flex items-center text-sm font-light p-5 pr-5 shadow-xl rounded-xl w-fit bg-white max-w-3xl text-[#0055D1]">
                  <p>
                    AI suggestion loading...
                    <LucideSparkle className="inline-block h-5 w-5 text-[#0055D1] ml-1.5 animate-spin" />
                  </p>
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center px-5 py-2 md:py-5">



      <p className='flex items-center text-sm font-light p-5 pr-5 shadow-xl rounded-xl w-fit bg-white max-w-3xl text-[#0055D1]'>
      
             {isFetchingSuggestions ? <p>AI suggestion loading...<LucideSparkle className="inline-block h-5 w-5 text-[#0055D1] ml-1.5 animate-spin" /></p>   : suggestions}
          </p>
    </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <div className="ml-auto">
        <BoardOptions id={data.id} />
      </div>
    </div>
  );
};
