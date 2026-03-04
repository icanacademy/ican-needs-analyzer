import { NextRequest, NextResponse } from 'next/server';
import { getNeedsForStudent, createNeed, updateNeedStatus, getAllNeeds } from '@/lib/db';

export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get('student_id');

  if (studentId) {
    const needs = getNeedsForStudent(Number(studentId));
    return NextResponse.json(needs);
  }

  const limit = Number(request.nextUrl.searchParams.get('limit') || '50');
  const needs = getAllNeeds(limit);
  return NextResponse.json(needs);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.student_id || !body.source || !body.date || !body.description) {
    return NextResponse.json(
      { error: 'student_id, source, date, and description are required' },
      { status: 400 },
    );
  }

  const need = createNeed(body);
  return NextResponse.json(need, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
  }

  const need = updateNeedStatus(id, status);
  if (!need) return NextResponse.json({ error: 'Need not found' }, { status: 404 });
  return NextResponse.json(need);
}
