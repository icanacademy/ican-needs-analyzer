'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NEED_SOURCES, NEED_CATEGORIES, NEED_PRIORITIES } from '@/lib/schema';
import type { NeedSource, NeedCategory, NeedPriority } from '@/lib/schema';

interface NeedsFormProps {
  studentId: number;
}

export default function NeedsForm({ studentId }: NeedsFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [source, setSource] = useState<NeedSource>('teacher');
  const [category, setCategory] = useState<NeedCategory | ''>('');
  const [priority, setPriority] = useState<NeedPriority>('medium');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [recordedBy, setRecordedBy] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/needs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          source,
          category: category || undefined,
          priority,
          date,
          recorded_by: recordedBy || undefined,
          description,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create need');
      }

      router.push(`/students/${studentId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  }

  // Contextual guidance based on source
  const sourcePlaceholders: Record<NeedSource, string> = {
    parent_form: 'Enter what the parent wrote on the intake form. Include goals, concerns, and specific requests...',
    parent_call: 'Summarize the phone call with the parent. Note any complaints, changes requested, or concerns raised...',
    teacher: 'Describe what you observed during class. Note specific weaknesses, skill gaps, or behavioral issues...',
    level_test: 'Record test results and skill levels. Note areas where the student scored low or showed difficulty...',
    weekly_review: 'Summarize the week\'s progress. Note any new weaknesses discovered or ongoing issues...',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Source selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Source / 출처 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {NEED_SOURCES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSource(s.value)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                source === s.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div>{s.label}</div>
              <div className="text-xs opacity-70">{s.labelKr}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Date + Recorded By */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Date / 날짜 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Recorded by / 기록자
          </label>
          <input
            type="text"
            value={recordedBy}
            onChange={(e) => setRecordedBy(e.target.value)}
            placeholder="Teacher or admin name"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Category + Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Category / 카테고리
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as NeedCategory)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category...</option>
            {NEED_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label} / {c.labelKr}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Priority / 우선순위
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as NeedPriority)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {NEED_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description / 설명 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          placeholder={sourcePlaceholders[source]}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? 'Saving...' : 'Save Need / 저장'}
      </button>
    </form>
  );
}
