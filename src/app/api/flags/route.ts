import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FlagSubmission from '@/models/FlagSubmission';
import Challenge from '@/models/Challenge';

// GET /api/flags?challengeId=... - Get all flag submissions for a challenge
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get('challengeId');
    
    if (!challengeId) {
      return NextResponse.json({ success: false, error: 'Challenge ID is required' }, { status: 400 });
    }
    
    const flags = await FlagSubmission.find({ challengeId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: flags }, { status: 200 });
  } catch (error) {
    console.error('Error fetching flag submissions:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch flag submissions' }, { status: 500 });
  }
}

// POST /api/flags - Submit a new flag
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { challengeId, userId, flagText, note } = body;
    
    if (!challengeId || !userId || !flagText) {
      return NextResponse.json({ success: false, error: 'Challenge ID, user ID, and flag text are required' }, { status: 400 });
    }
    
    // Check if challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return NextResponse.json({ success: false, error: 'Challenge not found' }, { status: 404 });
    }
    
    const flagSubmission = new FlagSubmission({
      challengeId,
      userId,
      flagText,
      note: note || '',
      isCorrect: false // Default to false, admin can mark as correct
    });
    
    await flagSubmission.save();
    
    return NextResponse.json({ success: true, data: flagSubmission }, { status: 201 });
  } catch (error) {
    console.error('Error submitting flag:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit flag' }, { status: 500 });
  }
}