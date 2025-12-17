import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FormSubmission from '@/models/FormSubmission';
import { getCurrentUser } from '@/lib/auth';
import { requirePermission } from '@/lib/permissions';
export const runtime = 'nodejs';

function submissionsToRows(submissions: any[]) {
  return submissions.map((s) => ({
    id: s._id?.toString(),
    createdAt: s.createdAt,
    phoneNumber: s.phoneNumber,
    formId: s.formId?.toString(),
    ipAddress: s.ipAddress,
    submittedBy: s.submittedBy?.toString(),
    formData: JSON.stringify(s.formData || {}),
  }));
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !requirePermission(user.role as any, 'canManageUsers')) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const format = request.nextUrl.searchParams.get('format') || 'csv';

    await connectDB();
    const submissions = await FormSubmission.find({}).sort({ createdAt: -1 }).lean();
    const rows = submissionsToRows(submissions);

    if (format === 'csv') {
      const header = Object.keys(rows[0] || { id: '', createdAt: '', phoneNumber: '', formId: '', ipAddress: '', submittedBy: '', formData: '' }).join(',');
      const data = rows
        .map((r) =>
          [
            r.id,
            r.createdAt,
            r.phoneNumber,
            r.formId,
            r.ipAddress,
            r.submittedBy,
            r.formData?.replace(/"/g, '""'),
          ]
            .map((v) => `"${v ?? ''}"`)
            .join(',')
        )
        .join('\n');
      const csv = [header, data].join('\n');
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="submissions.csv"',
        },
      });
    }

    if (format === 'xlsx') {
      const XLSX = await import('xlsx');
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="submissions.xlsx"',
        },
      });
    }

    if (format === 'pdf') {
      const { PDFDocument, StandardFonts } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      let page = doc.addPage([595, 842]); // A4
      let y = 800;
      const lineHeight = 12;
      const maxWidth = 540;

      const drawLine = (text: string, size = 10) => {
        if (y < 40) {
          page = doc.addPage([595, 842]);
          y = 800;
        }
        page.drawText(text, { x: 30, y, size, font, maxWidth });
        y -= lineHeight;
      };

      drawLine('Submissions', 14);
      drawLine('--------------------', 10);

      rows.forEach((r) => {
        drawLine(`ID: ${r.id || ''}`);
        drawLine(`Date: ${r.createdAt || ''}`);
        drawLine(`Phone: ${r.phoneNumber || ''}`);
        drawLine(`Form ID: ${r.formId || ''}`);
        drawLine(`IP: ${r.ipAddress || ''}`);
        drawLine(`User: ${r.submittedBy || ''}`);
        drawLine(`Data: ${r.formData || ''}`);
        drawLine(' ');
      });

      const pdfBytes = await doc.save();
      const pdfBuffer = Buffer.from(pdfBytes);
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="submissions.pdf"',
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Unsupported format' }, { status: 400 });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to export' },
      { status: 500 }
    );
  }
}

