import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl, {
      method: 'GET',
      // Backend fetch ignores browser CORS restrictions
      headers: {
        'Accept': 'image/*, application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const headers = new Headers();
    
    // Set headers to allow client browser caching and serving
    headers.set('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    
    // Crucial: Allow any origin (or same-origin)
    headers.set('Access-Control-Allow-Origin', '*');

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Failed to proxy image', { status: 500 });
  }
}
