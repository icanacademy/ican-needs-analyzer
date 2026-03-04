import Link from 'next/link';
import { getAllStudents, getOpenNeedsCount, getTotalNeedsCount } from '@/lib/db';
import StudentCard from '@/components/StudentCard';

export const dynamic = 'force-dynamic';

export default function StudentsPage() {
  const students = getAllStudents();

  const studentsWithCounts = students.map((s) => ({
    student: s,
    openNeeds: getOpenNeedsCount(s.id),
    totalNeeds: getTotalNeedsCount(s.id),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Students / 학생</h1>
          <p className="text-sm text-slate-500 mt-1">{students.length} students registered</p>
        </div>
        <Link
          href="/students/new"
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Student / 신규 등록
        </Link>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">No students registered yet</p>
          <p className="text-sm mt-1">아직 등록된 학생이 없습니다</p>
          <Link
            href="/students/new"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Register First Student
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentsWithCounts.map(({ student, openNeeds, totalNeeds }) => (
            <StudentCard
              key={student.id}
              student={student}
              openNeeds={openNeeds}
              totalNeeds={totalNeeds}
            />
          ))}
        </div>
      )}
    </div>
  );
}
