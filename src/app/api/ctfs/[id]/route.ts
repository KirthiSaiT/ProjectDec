import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CTF from '@/models/CTF';

// DELETE /api/ctfs/:id - Delete a CTF
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'CTF ID is required' }, { status: 400 });
    }
    
    const ctf = await CTF.findByIdAndDelete(id);
    
    if (!ctf) {
      return NextResponse.json({ success: false, error: 'CTF not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'CTF deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting CTF:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete CTF' }, { status: 500 });
  }
}