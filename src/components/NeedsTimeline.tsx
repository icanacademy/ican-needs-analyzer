'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Need, NeedSource, NeedCategory } from '@/lib/schema';
import { SOURCE_COLORS, PRIORITY_COLORS, STATUS_COLORS, NEED_SOURCES, NEED_CATEGORIES } from '@/lib/schema';

interface NeedsTimelineProps {
  needs: Need[];
}

export default function NeedsTimeline({ needs }: NeedsTimelineProps) {
  const router = useRouter();
  const [sourceFilter, setSourceFilter] = useState<NeedSource | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<NeedCategory | ''>('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const filtered = needs.filter((n) => {
    if (sourceFilter && n.source !== sourceFilter) return false;
    if (categoryFilter && n.category !== categoryFilter) return false;
    return true;
  });

  async function cycleStatus(need: Need) {
    const nextStatus = need.status === 'open' ? 'addressed' : need.status === 'addressed' ? 'resolved' : 'open';
    setUpdatingId(need.id);
    try {
      await fetch('/api/needs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: need.id, status: nextStatus }),
      });
      router.refresh();
    } finally {
      setUpdatingId(null);
    }
  }

  if (needs.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-lg">No needs recorded yet</p>
        <p className="text-sm mt-1">아직 기록된 니즈가 없습니다</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value as NeedSource | '')}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Sources</option>
          {NEED_SOURCES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as NeedCategory | '')}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {NEED_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <span className="text-sm text-slate-400 self-center">
          {filtered.length} of {needs.length} entries
        </span>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {filtered.map((need) => (
          <div
            key={need.id}
            className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SOURCE_COLORS[need.source]}`}>
                    {NEED_SOURCES.find(s => s.value === need.source)?.label || need.source}
                  </span>
                  {need.category && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {NEED_CATEGORIES.find(c => c.value === need.category)?.label || need.category}
                    </span>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[need.priority]}`}>
                    {need.priority}
                  </span>
                  <button
                    onClick={() => cycleStatus(need)}
                    disabled={updatingId === need.id}
                    className={`text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${STATUS_COLORS[need.status]}`}
                    title="Click to change status"
                  >
                    {updatingId === need.id ? '...' : need.status}
                  </button>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{need.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span>{need.date}</span>
                  {need.recorded_by && <span>by {need.recorded_by}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
