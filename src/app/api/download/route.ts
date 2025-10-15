import { NextRequest } from 'next/server';
import { downloadFile } from '@/lib/upload';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');
    
    if (!fileId) {
      return new Response(
        JSON.stringify({ success: false, error: 'File ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { buffer, contentType, filename } = await downloadFile(fileId);
    
    // Create headers for file download
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    
    return new Response(buffer, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to download file' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}