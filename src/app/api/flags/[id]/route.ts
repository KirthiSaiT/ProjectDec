import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FlagSubmission from '@/models/FlagSubmission';

// PUT /api/flags/:id - Update flag submission (mark as correct/incorrect)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const body = await req.json();
    const { isCorrect } = body;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Flag submission ID is required' }, { status: 400 });
    }
    
    const flagSubmission = await FlagSubmission.findByIdAndUpdate(
      id,
      { isCorrect },
      { new: true }
    );
    
    if (!flagSubmission) {
      return NextResponse.json({ success: false, error: 'Flag submission not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: flagSubmission }, { status: 200 });
  } catch (error) {
    console.error('Error updating flag submission:', error);
    return NextResponse.json({ success: false, error: 'Failed to update flag submission' }, { status: 500 });
  }
}

// DELETE /api/flags/:id - Delete a flag submission
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Flag submission ID is required' }, { status: 400 });
    }
    
    const flagSubmission = await FlagSubmission.findByIdAndDelete(id);
    
    if (!flagSubmission) {
      return NextResponse.json({ success: false, error: 'Flag submission not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Flag submission deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting flag submission:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete flag submission' }, { status: 500 });
  }
}