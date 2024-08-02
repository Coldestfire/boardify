import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function extractIds(url: string): { cardId: string | null; labelId: string | null } {
  const cardMatch = url.match(/\/api\/cards\/([^\/]+)\/labels/);
  const labelMatch = url.match(/\/labels\/([^\/]+)$/);
  return { cardId: cardMatch ? cardMatch[1] : null, labelId: labelMatch ? labelMatch[1] : null };
}

// Handler for creating a label
export async function POST(request: Request) {
  try {
    const { cardId } = extractIds(request.url);
    if (!cardId) {
      return NextResponse.error();
    }

    const { title, color } = await request.json();

    const newLabel = await db.label.create({
      data: {
        title,
        color,
        cards: {
          connect: { id: cardId },
        },
      },
    });
    console.log('Label created:', newLabel);
    return NextResponse.json(newLabel);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

// Handler for fetching labels for a card
export async function GET(request: Request) {
  try {
    const { cardId } = extractIds(request.url);
    if (!cardId) {
      return NextResponse.error();
    }

    const labels = await db.label.findMany({
      where: {
        cards: {
          some: { id: cardId },
        },
      },
    });

    return NextResponse.json(labels);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

// Handler for updating a label
export async function PUT(request: Request) {
  try {
    const { labelId } = extractIds(request.url);
    if (!labelId) {
      return NextResponse.error();
    }

    const { title, color } = await request.json();

    const updatedLabel = await db.label.update({
      where: { id: labelId },
      data: { title, color },
    });

    return NextResponse.json(updatedLabel);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

// Handler for deleting a label
export async function DELETE(request: Request) {
  try {
    const { labelId } = extractIds(request.url);
    if (!labelId) {
      return NextResponse.error();
    }

    await db.label.delete({
      where: { id: labelId },
    });

    return NextResponse.json({ message: 'Label deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
