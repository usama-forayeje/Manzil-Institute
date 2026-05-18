import { NextRequest, NextResponse } from 'next/server';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        error: 'Background removal API Key is missing. Please contact administrator.' 
      }, { status: 500 });
    }

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_file_b64: image.replace(/^data:image\/\w+;base64,/, ''),
        size: 'auto',
        bg_color: 'B0E0F8',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorCode = errorData.errors?.[0]?.code;

      // Handle specific credit/limit errors
      if (response.status === 402 || response.status === 403 || errorCode === 'insufficient_credits') {
        return NextResponse.json({ 
          error: 'LIMIT_EXCEEDED',
          message: 'দুঃখিত! এই মাসের ফ্রি ৫০টি ছবির লিমিট শেষ হয়ে গেছে। দয়া করে আগামী মাসের ১ তারিখ পর্যন্ত অপেক্ষা করুন অথবা প্রিমিয়াম ক্রেডিট যোগ করুন।' 
        }, { status: 403 });
      }

      if (response.status === 429) {
        return NextResponse.json({ 
          error: 'RATE_LIMIT',
          message: 'একসাথে অনেকগুলো ছবির রিকোয়েস্ট পাঠানো হয়েছে। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।' 
        }, { status: 429 });
      }

      throw new Error(errorData.errors?.[0]?.title ?? 'Background removal failed');
    }

    const arrayBuffer = await response.arrayBuffer();
    const resultBuffer = Buffer.from(arrayBuffer);
    const sharp = require('sharp');
    const finalBuffer = await sharp(resultBuffer).jpeg({ quality: 90 }).toBuffer();

    return NextResponse.json({
      result: `data:image/jpeg;base64,${finalBuffer.toString('base64')}`,
    });
  } catch (err: any) {
    console.error('[remove-bg] API Error:', err);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'সার্ভারে সমস্যা হয়েছে। দয়া করে ম্যানুয়ালি ব্যাকগ্রাউন্ড রিমুভ করা ছবি আপলোড করুন।' },
      { status: 500 }
    );
  }
}
