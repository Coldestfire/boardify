import { z } from "zod";
import { List } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { CountList } from "./schema";

export type InputType = z.infer<typeof CountList>;