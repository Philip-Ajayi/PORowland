import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { Sermon } from '@/lib/models/Sermon';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const speaker =
      req.nextUrl.searchParams.get('speaker') ?? 'Pastor Ope Rowland';

    // Fetch only the 3 most recent sermons
    const sermons = await Sermon.find({ speaker })
      .sort({ date: -1 })
      .limit(3)
      .lean();

    return NextResponse.json(sermons);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
