import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStudent, getNeedsForStudent, getLatestAnalysis } from '@/lib/db';
import NeedsTimeline from '@/components/NeedsTimeline';
import StatusToggle from './StatusToggle';

export const dynamic = 'force-dynamic';

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = getStudent(Number(params.id));
  if (!student) notFound();

  const needs = getNeedsForStudent(student.id);
  const latestAnalysis = getLatestAnalysis(student.id);
  const openNeeds = needs.filter((n) => n.status === 'open').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/students" className="text-sm text-blue-600 hover:text-blue-800">
          &larr; Back to Students
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{student.name_en}</h1>
            {student.name_kr && (
              <p className="text-lg text-slate-500">{student.name_kr}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              {student.grade_level && <span>Grade {student.grade_level}</span>}
              <span className="capitalize">{student.program_type}</span>
              {student.start_date && (
                <span>{student.start_date}{student.end_date ? ` ~ ${student.end_date}` : ''}</span>
              )}
            </div>
          </div>
          <StatusToggle studentId={student.id} currentStatus={student.status} />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-slate-900">{needs.length}</div>
            <div className="text-xs text-slate-500">Total Needs</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className={`text-2xl font-bold ${openNeeds > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {openNeeds}
            </div>
            <div className="text-xs text-slate-500">Open</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-slate-900">
              {latestAnalysis ? '1' : '0'}
            </div>
            <div className="text-xs text-slate-500">Analyses</div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href={`/students/${student.id}/needs/new`}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Need / 니즈 추가
        </Link>
        <Link
          href={`/students/${student.id}/analysis`}
          className={`px-4 py-2 font-medium rounded-lg transition-colors ${
            needs.length > 0
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          AI Analysis / AI 분석
        </Link>
      </div>

      {/* Needs Timeline */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Needs Timeline / 니즈 타임라인
        </h2>
        <NeedsTimeline needs={needs} />
      </div>
    </div>
  );
}
