import type { AnalysisResult } from '@/lib/schema';
import WeaknessCard from './WeaknessCard';

interface AnalysisReportProps {
  result: AnalysisResult;
  date?: string;
}

export default function AnalysisReport({ result, date }: AnalysisReportProps) {
  return (
    <div className="space-y-6">
      {date && (
        <p className="text-sm text-slate-400">Analysis date: {date}</p>
      )}

      {/* Main Goal */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-1">Main Goal / 주요 목표</h3>
        <p className="text-blue-800">{result.main_goal}</p>
        {result.sub_goals.length > 0 && (
          <ul className="mt-2 space-y-1">
            {result.sub_goals.map((g, i) => (
              <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                <span className="text-blue-400 mt-0.5 shrink-0">&bull;</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Weaknesses */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">
          Identified Weaknesses / 식별된 약점 ({result.weaknesses.length})
        </h3>
        <div className="space-y-3">
          {result.weaknesses.map((w, i) => (
            <WeaknessCard key={i} weakness={w} index={i} />
          ))}
        </div>
      </div>

      {/* Discrepancies */}
      {result.discrepancies.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-900 mb-2">
            Discrepancies / 불일치 ({result.discrepancies.length})
          </h3>
          <ul className="space-y-2">
            {result.discrepancies.map((d, i) => (
              <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5 shrink-0">!</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Focus */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">
          Recommended Focus Areas / 추천 집중 영역
        </h3>
        <div className="space-y-3">
          {result.recommended_focus
            .sort((a, b) => a.priority - b.priority)
            .map((focus, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    Priority {focus.priority}
                  </span>
                  <h4 className="font-medium text-slate-900">{focus.area}</h4>
                </div>
                <ul className="space-y-1">
                  {focus.suggested_activities.map((activity, j) => (
                    <li key={j} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5 shrink-0">&rarr;</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
