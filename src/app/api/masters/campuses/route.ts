import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  // Enrich with institution name
  const data = db.campuses.map((c) => ({
    ...c,
    institutionName: db.institutions.find((i) => i.id === c.institutionId)?.name || '',
  }));
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { institutionId, name, code, location } = body;

  if (!institutionId || !name || !code) {
    return NextResponse.json({ error: 'institutionId, name and code required' }, { status: 400 });
  }

  const campus = { id: uuidv4(), institutionId, name, code: code.toUpperCase(), location: location || '' };
  db.campuses.push(campus);
  return NextResponse.json({ data: campus, message: 'Campus created' }, { status: 201 });
}
