import { z } from "zod";

export const CountList = z.object({
  id: z.string(),
  boardId: z.string(),
});