import { NextRequest } from 'next/server';
import { uploadFile } from '@/lib/upload';
import formidable from 'formidable';
import { Writable } from 'stream';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Get the form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ success: false, error: 'No file provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Check file size (50MB limit)
    if (buffer.length > 50 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ success: false, error: 'File size exceeds 50MB limit' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Upload file
    const fileId = await uploadFile(buffer, file.name, file.type);
    
    return new Response(
      JSON.stringify({ success: true, fileId, filename: file.name }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to upload file' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}