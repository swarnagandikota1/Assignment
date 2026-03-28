import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const data = db.programs.map((p) => {
    const dept = db.departments.find((d) => d.id === p.departmentId);
    const campus = db.campuses.find((c) => c.id === dept?.campusId);
    const matrix = db.seatMatrices.find((sm) => sm.programId === p.id);
    return {
      ...p,
      departmentName: dept?.name || '',
      campusName: campus?.name || '',
      seatMatrix: matrix || null,
    };
  });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { departmentId, name, code, courseType, entryType, admissionMode, academicYear, totalIntake } = body;

  if (!departmentId || !name || !code || !totalIntake) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const program = {
    id: uuidv4(),
    departmentId,
    name,
    code: code.toUpperCase(),
    courseType: courseType || 'UG',
    entryType: entryType || 'Regular',
    admissionMode: admissionMode || 'Both',
    academicYear: academicYear || '2025-26',
    totalIntake: Number(totalIntake),
  };
  db.programs.push(program);
  return NextResponse.json({ data: program, message: 'Program created' }, { status: 201 });
}
