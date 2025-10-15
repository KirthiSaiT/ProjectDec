import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CTF from '@/models/CTF';

// GET /api/ctfs - Get all CTFs
export async function GET() {
  try {
    await dbConnect();
    
    const ctfs = await CTF.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: ctfs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching CTFs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch CTFs' }, { status: 500 });
  }
}

// POST /api/ctfs - Create a new CTF
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { name } = body;
    
    if (!name) {
      return NextResponse.json({ success: false, error: 'CTF name is required' }, { status: 400 });
    }
    
    const ctf = new CTF({ name });
    await ctf.save();
    
    return NextResponse.json({ success: true, data: ctf }, { status: 201 });
  } catch (error) {
    console.error('Error creating CTF:', error);
    return NextResponse.json({ success: false, error: 'Failed to create CTF' }, { status: 500 });
  }
}