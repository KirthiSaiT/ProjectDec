import { GridFSBucket, MongoClient, ObjectId } from 'mongodb';
import { Writable } from 'stream';
import { pipeline } from 'stream/promises';

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = 'ctf_platform';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

export async function uploadFile(fileBuffer: Buffer, filename: string, contentType: string): Promise<string> {
  const client = new MongoClient(MONGODB_URI!);
  
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const bucket = new GridFSBucket(db);
    
    // Delete existing file with same name if exists
    const existingFiles = await bucket.find({ filename }).toArray();
    if (existingFiles.length > 0) {
      await bucket.delete(existingFiles[0]._id);
    }
    
    // Create a readable stream from the buffer
    const readable = require('stream').Readable.from(fileBuffer);
    
    // Upload the file
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: contentType
    });
    
    await pipeline(readable, uploadStream);
    
    // Return the file ID as a string
    return uploadStream.id.toString();
  } finally {
    await client.close();
  }
}

export async function downloadFile(fileId: string): Promise<{ buffer: Buffer, contentType: string, filename: string }> {
  const client = new MongoClient(MONGODB_URI!);
  
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const bucket = new GridFSBucket(db);
    
    const fileObject = await bucket.find({ _id: new ObjectId(fileId) }).toArray();
    
    if (fileObject.length === 0) {
      throw new Error('File not found');
    }
    
    const file = fileObject[0];
    
    // Create a writable stream to collect the data
    const chunks: Buffer[] = [];
    const writable = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      }
    });
    
    // Download the file
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    
    await pipeline(downloadStream, writable);
    
    return {
      buffer: Buffer.concat(chunks),
      contentType: file.contentType || 'application/octet-stream',
      filename: file.filename
    };
  } finally {
    await client.close();
  }
}