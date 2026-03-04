import Link from 'next/link';
import { getAllStudents, getDashboardStats, getAllNeeds, getOpenNeedsCount, getTotalNeedsCount } from '@/lib/db';
import StudentCard from '@/components/StudentCard';
import { NEED_SOURCES, SOURCE_COLORS } from '@/lib/schema';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const stats = getDashboardStats();
  const students = getAllStudents('active');
  const recentNeeds = getAllNeeds(10);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">ICAN Needs Analyzer Overview / 아이캔 니즈 분석기 대시보드</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="text-3xl font-bold text-blue-600">{stats.totalStudents}</div>
          <div className="text-sm text-slate-500 mt-1">Active Students / 활동 학생</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className={`text-3xl font-bold ${stats.totalNeeds > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {stats.totalNeeds}
          </div>
          <div className="text-sm text-slate-500 mt-1">Open Needs / 미해결 니즈</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="text-3xl font-bold text-purple-600">{stats.totalAnalyses}</div>
          <div className="text-sm text-slate-500 mt-1">Analyses Done / 완료된 분석</div>
        </div>
      </div>

      {/* Students Needing Attention */}
      {stats.studentsNeedingAttention.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Needs Attention / 주의 필요
          </h2>
          <div className="space-y-2">
            {stats.studentsNeedingAttention.map((s) => (
              <Link key={s.id} href={`/students/${s.id}`}>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 hover:bg-red-100 transition-colors flex items-center justify-between">
                  <div>
                    <span className="font-medium text-slate-900">{s.name_en}</span>
                    {s.name_kr && <span className="text-sm text-slate-500 ml-2">{s.name_kr}</span>}
                  </div>
                  <span className="text-sm font-medium text-red-700">
                    {s.open_needs} open needs
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Active Students */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Active Students / 활동 학생 ({students.length})
          </h2>
          <Link
            href="/students/new"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + New Student
          </Link>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200 text-slate-400">
            <p>No students registered yet</p>
            <Link
              href="/students/new"
              className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Register First Student
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((s) => (
              <StudentCard
                key={s.id}
                student={s}
                openNeeds={getOpenNeedsCount(s.id)}
                totalNeeds={getTotalNeedsCount(s.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {recentNeeds.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Recent Activity / 최근 활동
          </h2>
          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
            {recentNeeds.map((need) => (
              <div key={need.id} className="p-3 hover:bg-slate-50">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SOURCE_COLORS[need.source]}`}>
                    {NEED_SOURCES.find((s) => s.value === need.source)?.label || need.source}
                  </span>
                  <span className="text-xs text-slate-400">{need.date}</span>
                </div>
                <p className="text-sm text-slate-700 line-clamp-2">{need.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
