import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import ExamPaperPDF from '@/components/exam-papers/pdf-templates/exam-paper-pdf';
import { fetchCompleteExamPaper } from '@/lib/exam-paper-data';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const examPaperId = params.id;

    // Fetch complete exam paper data
    const { examPaper, sections } = await fetchCompleteExamPaper(examPaperId);

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      ExamPaperPDF({ examPaper, sections })
    );

    // Create filename
    const filename = `${examPaper.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_exam_paper.pdf`;

    // Return PDF response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function HEAD() {
  // For preflight checks
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
    },
  });
}