import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const data = db.departments.map((d) => ({
    ...d,
    campusName: db.campuses.find((c) => c.id === d.campusId)?.name || '',
  }));
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { campusId, name, code } = body;

  if (!campusId || !name || !code) {
    return NextResponse.json({ error: 'campusId, name and code required' }, { status: 400 });
  }

  const dept = { id: uuidv4(), campusId, name, code: code.toUpperCase() };
  db.departments.push(dept);
  return NextResponse.json({ data: dept, message: 'Department created' }, { status: 201 });
}
