import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Challenge from '@/models/Challenge';

// GET /api/challenges?ctfId=... - Get all challenges for a CTF
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const ctfId = searchParams.get('ctfId');
    
    if (!ctfId) {
      return NextResponse.json({ success: false, error: 'CTF ID is required' }, { status: 400 });
    }
    
    const challenges = await Challenge.find({ ctfId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: challenges }, { status: 200 });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch challenges' }, { status: 500 });
  }
}

// POST /api/challenges - Create a new challenge
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { ctfId, title, description, category, fileUrl } = body;
    
    if (!ctfId || !title || !description || !category) {
      return NextResponse.json({ success: false, error: 'CTF ID, title, description, and category are required' }, { status: 400 });
    }
    
    const challenge = new Challenge({
      ctfId,
      title,
      description,
      category,
      fileUrl: fileUrl || ''
    });
    
    await challenge.save();
    
    return NextResponse.json({ success: true, data: challenge }, { status: 201 });
  } catch (error) {
    console.error('Error creating challenge:', error);
    return NextResponse.json({ success: false, error: 'Failed to create challenge' }, { status: 500 });
  }
}