import { NextRequest, NextResponse } from 'next/server';
import { db, checkSeatAvailability } from '@/lib/db';

// POST /api/admissions/allocate
// Locks a seat for an applicant
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { applicantId } = body;

  const idx = db.applicants.findIndex((a) => a.id === applicantId);
  if (idx === -1) return NextResponse.json({ error: 'Applicant not found' }, { status: 404 });

  const applicant = db.applicants[idx];

  if (applicant.status === 'SeatLocked' || applicant.status === 'Confirmed') {
    return NextResponse.json({ error: 'Seat already allocated for this applicant' }, { status: 409 });
  }

  // Check seat availability (key business rule)
  const { available, remaining, matrix } = checkSeatAvailability(applicant.programId, applicant.quotaType);
  if (!available) {
    return NextResponse.json(
      { error: `Cannot allocate. ${applicant.quotaType} quota is full.` },
      { status: 409 }
    );
  }

  // Lock seat: increment allocated counter
  const matrixIdx = db.seatMatrices.findIndex((sm) => sm.id === matrix!.id);
  const quotaIdx = db.seatMatrices[matrixIdx].quotas.findIndex((q) => q.quota === applicant.quotaType);
  db.seatMatrices[matrixIdx].quotas[quotaIdx].allocated += 1;

  // Update applicant status
  db.applicants[idx].status = 'SeatLocked';
  db.applicants[idx].updatedAt = new Date().toISOString();

  return NextResponse.json({
    data: db.applicants[idx],
    message: `Seat locked in ${applicant.quotaType} quota. ${remaining - 1} seats remaining.`,
  });
}
