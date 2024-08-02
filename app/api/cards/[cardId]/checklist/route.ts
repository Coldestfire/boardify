import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Import the global db instance

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cardId = searchParams.get('cardId');

  if (!cardId) {
    return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
  }

  try {
    const checklists = await db.checklist.findMany({
      where: { cardId },
    });

    return NextResponse.json(checklists);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  try {
    const { cardId, title } = await request.json();

    if (!cardId || !title) {
      return NextResponse.json({ error: 'Card ID and title are required' }, { status: 400 });
    }

    const newChecklist = await db.checklist.create({
      data: {
        cardId,
        title,
        completed: false,
      },
    });

    return NextResponse.json(newChecklist);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
