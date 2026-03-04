import { NextRequest, NextResponse } from 'next/server';
import { getStudent, getNeedsForStudent, createAnalysis, getAnalysesForStudent } from '@/lib/db';
import { analyzeStudentNeeds } from '@/lib/claude';

export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get('student_id');
  if (!studentId) {
    return NextResponse.json({ error: 'student_id is required' }, { status: 400 });
  }

  const analyses = getAnalysesForStudent(Number(studentId));
  return NextResponse.json(analyses);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { student_id } = body;

  if (!student_id) {
    return NextResponse.json({ error: 'student_id is required' }, { status: 400 });
  }

  const student = getStudent(student_id);
  if (!student) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }

  const needs = getNeedsForStudent(student_id);
  if (needs.length === 0) {
    return NextResponse.json({ error: 'No needs data to analyze' }, { status: 400 });
  }

  try {
    const { result, rawResponse } = await analyzeStudentNeeds(
      student.name_en,
      student.grade_level,
      needs,
    );

    const analysis = createAnalysis(
      student_id,
      JSON.stringify(needs),
      JSON.stringify(result.weaknesses),
      JSON.stringify({
        recommended_focus: result.recommended_focus,
        discrepancies: result.discrepancies,
        main_goal: result.main_goal,
        sub_goals: result.sub_goals,
      }),
      rawResponse,
    );

    return NextResponse.json({ analysis, result }, { status: 201 });
  } catch (error) {
    console.error('Analysis failed:', error);
    const message = error instanceof Error ? error.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
