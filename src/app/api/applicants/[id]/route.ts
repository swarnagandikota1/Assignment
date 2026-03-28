import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const applicant = db.applicants.find((a) => a.id === params.id);
  if (!applicant) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const prog = db.programs.find((p) => p.id === applicant.programId);
  return NextResponse.json({ data: { ...applicant, programName: prog?.name || '' } });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const idx = db.applicants.findIndex((a) => a.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json();
  db.applicants[idx] = {
    ...db.applicants[idx],
    ...body,
    id: params.id, // immutable
    admissionNumber: db.applicants[idx].admissionNumber, // immutable once set
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ data: db.applicants[idx], message: 'Applicant updated' });
}
