import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { Item } from '@/lib/models/Sermon';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const category = req.nextUrl.searchParams.get('category');
    
    // Build filter dynamically if category query param exists
    const query = category ? { category } : {};

    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
