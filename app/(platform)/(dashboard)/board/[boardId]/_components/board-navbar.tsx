import { Board } from "@prisma/client";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";
import AiSuggestion from "./ai-suggestion";

import React from "react";
import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import { Bot } from 'lucide-react';

interface BoardNavbarProps {
  data: Board;
}

export const BoardNavbar = async ({ data }: BoardNavbarProps) => {
  return (
    // adjust h below
    <div className="w-full h-fit z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
     
      <BoardTitleForm data={data} />
      {/* REPLACE WITH AI SUGGESTION */}
      <div className="ml-auto mr-16">
      <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <Button className="text-sm"><Bot/> click for AI suggestion</Button>
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