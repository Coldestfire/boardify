import { Card, List } from "@prisma/client";

export type ListWithCards = List & { cards: Card[] };

export type CardWithList = Card & { list: List };


export interface ChecklistItem {
  items: any;
  id: string;
  cardId: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Checklist {
  id: string;
  title: string;
  completed: boolean;
}

export interface Label {
  id: string;
  title: string | undefined;
  color: string;
}
