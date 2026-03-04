import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStudent } from '@/lib/db';
import NeedsForm from '@/components/NeedsForm';

export const dynamic = 'force-dynamic';

export default function NewNeedPage({ params }: { params: { id: string } }) {
  const student = getStudent(Number(params.id));
  if (!student) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href={`/students/${student.id}`} className="text-sm text-blue-600 hover:text-blue-800">
          &larr; Back to {student.name_en}
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">
          Add Need for {student.name_en}
        </h1>
        {student.name_kr && (
          <p className="text-sm text-slate-500">{student.name_kr} - 니즈 추가</p>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <NeedsForm studentId={student.id} />
      </div>
    </div>
  );
}
