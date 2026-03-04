import type { Weakness } from '@/lib/schema';

interface WeaknessCardProps {
  weakness: Weakness;
  index: number;
}

const severityStyles: Record<string, string> = {
  high: 'border-l-red-500 bg-red-50',
  medium: 'border-l-yellow-500 bg-yellow-50',
  low: 'border-l-slate-400 bg-slate-50',
};

export default function WeaknessCard({ weakness, index }: WeaknessCardProps) {
  return (
    <div className={`border-l-4 rounded-r-lg p-4 ${severityStyles[weakness.severity] || severityStyles.medium}`}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-slate-900">
            #{index + 1} {weakness.skill}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              weakness.severity === 'high' ? 'bg-red-100 text-red-700' :
              weakness.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {weakness.severity} severity
            </span>
            <span className="text-xs text-slate-500">
              {Math.round(weakness.confidence * 100)}% confidence
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {weakness.parent_perceived && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Parent</span>
          )}
          {weakness.teacher_confirmed && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Teacher</span>
          )}
        </div>
      </div>

      {weakness.evidence.length > 0 && (
        <ul className="mt-3 space-y-1">
          {weakness.evidence.map((e, i) => (
            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
              <span className="text-slate-400 mt-0.5 shrink-0">&bull;</span>
              <span>{e}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
