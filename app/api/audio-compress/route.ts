import fs from 'fs';
import path from 'path';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import { NextRequest, NextResponse } from 'next/server'; // Use NextRequest and NextResponse for app directory

const upload = multer({ dest: 'uploads/' });

const runMiddleware = (req: NextRequest, res: NextResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        reject(result);
      }
      resolve(result);
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    const res = NextResponse.next(); 

    await runMiddleware(req, res, upload.single('audio'));

    const file = (req as any).file;
    console.log(file,"fileeee")

    // Check if a file is uploaded
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const inputFile = file.path;
    const outputFile = `uploads/compressed_${file.filename}.mp3`;

    // Perform audio compression with ffmpeg
    ffmpeg(inputFile)
      .audioBitrate('128k') // Set desired bitrate for compression
      .save(outputFile)
      .on('end', () => {
        // Set headers to prompt download of the compressed file
        res.headers.set('Content-Disposition', `attachment; filename=${path.basename(outputFile)}`);
        res.headers.set('Content-Type', 'audio/mpeg');

        // Stream the compressed file to the response
        const stream = fs.createReadStream(outputFile);
        stream.pipe(res);

        // Clean up temporary files after streaming
        stream.on('close', () => {
          fs.unlinkSync(inputFile);
          fs.unlinkSync(outputFile);
        });
      })
      .on('error', (err) => {
        console.error('Error compressing audio:', err);
        return NextResponse.json({ error: 'Audio compression failed' }, { status: 500 });
      });

    return res; // Return response
  } catch (error) {
    console.error('Error in audio compression API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
