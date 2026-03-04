import Link from 'next/link';
import type { Student } from '@/lib/schema';

interface StudentCardProps {
  student: Student;
  openNeeds?: number;
  totalNeeds?: number;
}

const statusBadge: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-slate-100 text-slate-800',
  paused: 'bg-yellow-100 text-yellow-800',
};

export default function StudentCard({ student, openNeeds, totalNeeds }: StudentCardProps) {
  return (
    <Link href={`/students/${student.id}`}>
      <div className="bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">{student.name_en}</h3>
            {student.name_kr && (
              <p className="text-sm text-slate-500">{student.name_kr}</p>
            )}
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge[student.status] || statusBadge.active}`}>
            {student.status}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
          {student.grade_level && <span>Grade {student.grade_level}</span>}
          {student.start_date && (
            <span>{student.start_date}{student.end_date ? ` ~ ${student.end_date}` : ''}</span>
          )}
        </div>

        {(openNeeds !== undefined || totalNeeds !== undefined) && (
          <div className="mt-3 flex items-center gap-3 text-sm">
            {openNeeds !== undefined && openNeeds > 0 && (
              <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-medium">
                {openNeeds} open needs
              </span>
            )}
            {totalNeeds !== undefined && (
              <span className="text-slate-400">{totalNeeds} total</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
