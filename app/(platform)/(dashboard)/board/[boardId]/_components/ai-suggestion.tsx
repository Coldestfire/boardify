"use client";

import React from "react";
import { useChat } from "ai/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

import { useState } from "react";
import { getSuggestion } from "@/actions/sendSuggestion";
import { readStreamableValue } from "ai/rsc";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { LucideSparkle } from "lucide-react";

function AiSuggestion() {
  const params = useParams<{ boardId: string }>();

  console.log(`params`, params);

  const {data: suggestions, isPending: isFetchingSuggestions, error} = useQuery({
    queryKey: ["get_suggestion_for_board", params.boardId],
    queryFn: async () => {
      const suggestions = await getSuggestion({
        boardId: params.boardId,
      });

      return suggestions;
    },

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchIntervalInBackground: false,
    refetchInterval: 60 * 1000, // 60 seconds
  });

  return (
    <div className="flex items-center justify-center px-5 py-2 md:py-5">



      <p className='flex items-center text-sm font-light p-5 pr-5 shadow-xl rounded-xl w-fit bg-white max-w-3xl text-[#0055D1]'>
      
             {isFetchingSuggestions ? <p>AI suggestion loading...<LucideSparkle className="inline-block h-5 w-5 text-[#0055D1] ml-1.5" /></p>   : suggestions}
          </p>
    </div>
  );
}

export default AiSuggestion;
