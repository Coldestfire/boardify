import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { cardId: string } }) {
  const cardId = params.cardId;

  try {
    const checklists = await db.checklist.findMany({
      where: { cardId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(checklists);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}