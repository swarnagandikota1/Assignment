import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET /api/masters/institutions
export async function GET() {
  return NextResponse.json({ data: db.institutions });
}

// POST /api/masters/institutions
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, code, address } = body;

  if (!name || !code) {
    return NextResponse.json({ error: 'Name and code are required' }, { status: 400 });
  }

  const newInstitution = {
    id: uuidv4(),
    name,
    code: code.toUpperCase(),
    address: address || '',
    createdAt: new Date().toISOString(),
  };

  db.institutions.push(newInstitution);
  return NextResponse.json({ data: newInstitution, message: 'Institution created' }, { status: 201 });
}
