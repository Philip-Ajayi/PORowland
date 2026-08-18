import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { Sermon } from '@/lib/models/Sermon';

// Optional but useful if you deploy to edge runtime
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const speaker =
      req.nextUrl.searchParams.get('speaker') ?? 'Pastor Ope Rowland';

    const sermons = await Sermon.find({ speaker })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(sermons);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}