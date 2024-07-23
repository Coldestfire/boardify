"use client";
import { Board } from "@prisma/client";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";
import AiSuggestion from "./ai-suggestion";

import React, { useEffect, useState } from "react";
import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import { Bot } from 'lucide-react';
import { useQueryClient } from "@tanstack/react-query";
// import { redis } from "@/lib/redis";

interface BoardNavbarProps {
  data: Board;
}

export const BoardNavbar =  ({ data }: BoardNavbarProps) => {
  const qc = useQueryClient();
  const [cachedBoardData, setCachedBoardData] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchCachedData = async () => {
  //     const cachedData = await redis.hget("boarddata", "boarddata");
  //     setCachedBoardData(cachedData);
  //   };

  //   fetchCachedData();
  // }, []);

  const refetchAiSuggestion = async () => {
    await qc.invalidateQueries({ queryKey: ["get_suggestion_for_board", data.id] });
  };

  useEffect(() => {
    const checkAndRefetch = async () => {
      if (cachedBoardData !== null && cachedBoardData !== JSON.stringify(data)) {
        await refetchAiSuggestion();
      }
    };

    checkAndRefetch();
  }, [data, cachedBoardData]);
  return (
    // adjust h below
    <div className="w-full h-fit z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
     
      <BoardTitleForm data={data} />
      {/* REPLACE WITH AI SUGGESTION */}
      <div className="ml-auto mr-16">
      <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <Button className="text-sm" onClick={refetchAiSuggestion}><Bot/> click for AI suggestion</Button>
      </PopoverTrigger>
      <PopoverContent>
         <AiSuggestion /> 
      </PopoverContent>
    </Popover>
    </div> 
      
      <div className="ml-auto">
    
        <BoardOptions id={data.id} />
        
      </div>
      
    </div>
  );
};