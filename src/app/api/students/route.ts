import { NextRequest, NextResponse } from 'next/server';
import { getAllStudents, createStudent, getStudent, updateStudentStatus } from '@/lib/db';

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get('status') || undefined;
  const id = request.nextUrl.searchParams.get('id');

  if (id) {
    const student = getStudent(Number(id));
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    return NextResponse.json(student);
  }

  const students = getAllStudents(status);
  return NextResponse.json(students);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name_en) {
    return NextResponse.json({ error: 'English name is required' }, { status: 400 });
  }

  const student = createStudent(body);
  return NextResponse.json(student, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
  }

  const student = updateStudentStatus(id, status);
  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  return NextResponse.json(student);
}
