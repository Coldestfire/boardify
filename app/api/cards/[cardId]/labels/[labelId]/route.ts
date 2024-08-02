import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Extracts the labelId from the URL
function extractLabelId(url: string): string | null {
  const labelMatch = url.match(/\/labels\/([^\/]+)/);
  return labelMatch ? labelMatch[1] : null;
}

// Handler for updating a label
export async function PUT(request: Request) {
  try {
    const labelId = extractLabelId(request.url);
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
    const labelId = extractLabelId(request.url);
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
