import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Challenge from '@/models/Challenge';

// GET /api/challenges/:id - Get a specific challenge by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Challenge ID is required' }, { status: 400 });
    }
    
    const challenge = await Challenge.findById(id);
    
    if (!challenge) {
      return NextResponse.json({ success: false, error: 'Challenge not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: challenge }, { status: 200 });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch challenge' }, { status: 500 });
  }
}

// DELETE /api/challenges/:id - Delete a challenge
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Challenge ID is required' }, { status: 400 });
    }
    
    const challenge = await Challenge.findByIdAndDelete(id);
    
    if (!challenge) {
      return NextResponse.json({ success: false, error: 'Challenge not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Challenge deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete challenge' }, { status: 500 });
  }
}