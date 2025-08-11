import { NextRequest, NextResponse } from 'next/server';
import { fetchCompleteExamPaper } from '@/lib/exam-paper-data';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const examPaperId = params.id;

    // Fetch complete exam paper data
    const data = await fetchCompleteExamPaper(examPaperId);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching exam paper preview data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch preview data', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}