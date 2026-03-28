import { NextRequest, NextResponse } from 'next/server';
import { db, generateAdmissionNumber } from '@/lib/db';

// POST /api/admissions/confirm
// Confirms admission: fee must be paid + seat must be locked
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { applicantId } = body;

  const idx = db.applicants.findIndex((a) => a.id === applicantId);
  if (idx === -1) return NextResponse.json({ error: 'Applicant not found' }, { status: 404 });

  const applicant = db.applicants[idx];

  // Already confirmed
  if (applicant.status === 'Confirmed' && applicant.admissionNumber) {
    return NextResponse.json({
      data: applicant,
      message: 'Already confirmed',
      admissionNumber: applicant.admissionNumber,
    });
  }

  // Must have seat locked first
  if (applicant.status !== 'SeatLocked') {
    return NextResponse.json({ error: 'Seat must be locked before confirmation' }, { status: 400 });
  }

  // Key rule: fee must be paid
  if (applicant.feeStatus !== 'Paid') {
    return NextResponse.json(
      { error: 'Admission can only be confirmed after fee is paid.' },
      { status: 400 }
    );
  }

  // Get program + institution details
  const program = db.programs.find((p) => p.id === applicant.programId);
  if (!program) return NextResponse.json({ error: 'Program not found' }, { status: 404 });

  // Generate unique, immutable admission number
  const admissionNumber = generateAdmissionNumber(
    'EIT',
    new Date().getFullYear().toString(),
    program.courseType,
    program.code,
    applicant.quotaType
  );

  db.applicants[idx].admissionNumber = admissionNumber;
  db.applicants[idx].status = 'Confirmed';
  db.applicants[idx].updatedAt = new Date().toISOString();

  return NextResponse.json({
    data: db.applicants[idx],
    admissionNumber,
    message: `Admission confirmed! Number: ${admissionNumber}`,
  });
}
