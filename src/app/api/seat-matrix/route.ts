import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const programId = searchParams.get('programId');

  let matrices = db.seatMatrices.map((sm) => {
    const prog = db.programs.find((p) => p.id === sm.programId);
    return { ...sm, programName: prog?.name || '', programCode: prog?.code || '' };
  });

  if (programId) {
    matrices = matrices.filter((m) => m.programId === programId);
  }

  return NextResponse.json({ data: matrices });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { programId, academicYear, totalIntake, kcetSeats, comedkSeats, managementSeats, supernumerary } = body;

  if (!programId || !totalIntake) {
    return NextResponse.json({ error: 'programId and totalIntake required' }, { status: 400 });
  }

  const program = db.programs.find((p) => p.id === programId);
  if (!program) {
    return NextResponse.json({ error: 'Program not found' }, { status: 404 });
  }

  // Key rule: total quota = total intake
  const kcet = Number(kcetSeats) || 0;
  const comedk = Number(comedkSeats) || 0;
  const mgmt = Number(managementSeats) || 0;
  const intake = Number(totalIntake);

  if (kcet + comedk + mgmt !== intake) {
    return NextResponse.json(
      { error: `Quota total (${kcet + comedk + mgmt}) must equal intake (${intake})` },
      { status: 400 }
    );
  }

  // Check if matrix already exists
  const existing = db.seatMatrices.findIndex((sm) => sm.programId === programId);
  const matrix = {
    id: existing >= 0 ? db.seatMatrices[existing].id : uuidv4(),
    programId,
    academicYear: academicYear || '2025-26',
    totalIntake: intake,
    quotas: [
      { quota: 'KCET' as const, total: kcet, allocated: existing >= 0 ? db.seatMatrices[existing].quotas.find(q => q.quota === 'KCET')?.allocated || 0 : 0 },
      { quota: 'COMEDK' as const, total: comedk, allocated: existing >= 0 ? db.seatMatrices[existing].quotas.find(q => q.quota === 'COMEDK')?.allocated || 0 : 0 },
      { quota: 'Management' as const, total: mgmt, allocated: existing >= 0 ? db.seatMatrices[existing].quotas.find(q => q.quota === 'Management')?.allocated || 0 : 0 },
    ],
    supernumerary: Number(supernumerary) || 0,
    supernumeraryAllocated: existing >= 0 ? db.seatMatrices[existing].supernumeraryAllocated : 0,
  };

  if (existing >= 0) {
    db.seatMatrices[existing] = matrix;
  } else {
    db.seatMatrices.push(matrix);
  }

  return NextResponse.json({ data: matrix, message: 'Seat matrix saved' }, { status: 201 });
}
