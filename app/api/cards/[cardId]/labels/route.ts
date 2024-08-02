import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function extractIds(url: string): { cardId: string | null; labelId: string | null } {
  const cardMatch = url.match(/\/api\/cards\/([^\/]+)\/labels/);
  const labelMatch = url.match(/\/labels\/([^\/]+)$/);
  return { cardId: cardMatch ? cardMatch[1] : null, labelId: labelMatch ? labelMatch[1] : null };
}

// Handler for creating or updating a label
export async function POST(request: Request) {
  try {
    const { cardId } = extractIds(request.url);
    if (!cardId) {
      return NextResponse.error();
    }

    const { title, color } = await request.json();

    const existingLabel = await db.label.findFirst({
      where: { cardId },
    });

    let newLabel;
    if (existingLabel) {
      newLabel = await db.label.update({
        where: { id: existingLabel.id },
        data: { title, color },
      });
    } else {
      newLabel = await db.label.create({
        data: { title, color, cardId },
      });
    }

    return NextResponse.json(newLabel);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
