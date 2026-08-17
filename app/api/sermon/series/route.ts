import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { Sermon } from '@/lib/models/Sermon';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const speaker =
      req.nextUrl.searchParams.get('speaker') ?? 'Pastor Ope Rowland';

    const series = await Sermon.distinct('series', { speaker });

    // Remove any null/undefined values
    return NextResponse.json(series.filter(Boolean));
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}