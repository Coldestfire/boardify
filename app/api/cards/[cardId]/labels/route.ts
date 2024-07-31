import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, color } = await req.json();
    const { cardId } = params;

    const card = await db.card.findUnique({
      where: {
        id: cardId,
        list: {
          board: {
            orgId,
          },
        },
      },
    });

    if (!card) {
      return new NextResponse("Card not found", { status: 404 });
    }

    const label = await db.label.create({
      data: {
        title,
        color,
        cards: {
          connect: { id: cardId },
        },
      },
    });

    return NextResponse.json(label);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}