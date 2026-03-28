import { NextRequest, NextResponse } from 'next/server';
import { db, checkSeatAvailability } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_DOCS = [
  { name: '10th Marks Card', status: 'Pending' as const },
  { name: '12th Marks Card / Diploma', status: 'Pending' as const },
  { name: 'Qualifying Exam Rank Card', status: 'Pending' as const },
  { name: 'Transfer Certificate', status: 'Pending' as const },
  { name: 'Aadhar Card', status: 'Pending' as const },
  { name: 'Passport Photo', status: 'Pending' as const },
  { name: 'Caste Certificate (if applicable)', status: 'Pending' as const },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const programId = searchParams.get('programId');

  let applicants = db.applicants.map((a) => {
    const prog = db.programs.find((p) => p.id === a.programId);
    return { ...a, programName: prog?.name || '' };
  });

  if (status) applicants = applicants.filter((a) => a.status === status);
  if (programId) applicants = applicants.filter((a) => a.programId === programId);

  return NextResponse.json({ data: applicants });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    firstName, lastName, email, phone, dob, gender, category, state,
    programId, entryType, quotaType, admissionMode, allotmentNumber,
    qualifyingExam, qualifyingMarks, rank,
  } = body;

  // Validate required fields
  if (!firstName || !lastName || !email || !phone || !programId || !quotaType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Check seat availability
  const { available, remaining } = checkSeatAvailability(programId, quotaType);
  if (!available) {
    return NextResponse.json(
      { error: `No seats available in ${quotaType} quota. Quota is full.` },
      { status: 409 }
    );
  }

  const applicant = {
    id: uuidv4(),
    firstName, lastName, email, phone,
    dob: dob || '',
    gender: gender || 'Male',
    category: category || 'GM',
    state: state || '',
    programId,
    entryType: entryType || 'Regular',
    quotaType,
    admissionMode: admissionMode || 'Government',
    allotmentNumber: allotmentNumber || '',
    qualifyingExam: qualifyingExam || 'PUC',
    qualifyingMarks: Number(qualifyingMarks) || 0,
    rank: rank ? Number(rank) : undefined,
    status: 'Applied' as const,
    feeStatus: 'Pending' as const,
    documents: DEFAULT_DOCS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.applicants.push(applicant);
  return NextResponse.json(
    { data: applicant, message: `Applicant created. ${remaining - 1} seats remaining in ${quotaType}.` },
    { status: 201 }
  );
}
