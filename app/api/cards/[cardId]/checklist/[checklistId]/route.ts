import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; 

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const checklistId = searchParams.get('checklistId');
    const { title, completed } = await request.json();

    if (!checklistId) {
      return NextResponse.json({ error: 'Checklist ID is required' }, { status: 400 });
    }

    const updatedChecklist = await db.checklist.update({
      where: { id: checklistId },
      data: { title, completed },
    });

    return NextResponse.json(updatedChecklist);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const checklistId = searchParams.get('checklistId');

    if (!checklistId) {
      return NextResponse.json({ error: 'Checklist ID is required' }, { status: 400 });
    }

    await db.checklist.delete({
      where: { id: checklistId },
    });

    return NextResponse.json({ message: 'Checklist deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
