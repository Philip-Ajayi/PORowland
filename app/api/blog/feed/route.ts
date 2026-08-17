import { NextResponse } from 'next/server';

const FEED_URL = 'https://operowland.blogspot.com/feeds/posts/default?alt=atom';

export async function GET() {
  try {
    const response = await fetch(FEED_URL, {
      // Ensure we get a fresh response; add any necessary headers
      headers: {
        'User-Agent': 'Next.js Blog Proxy',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds (optional)
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Feed fetch failed: ${response.status}` },
        { status: response.status }
      );
    }

    const xmlText = await response.text();
    return new NextResponse(xmlText, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Feed proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}