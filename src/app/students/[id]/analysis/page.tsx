'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AnalysisReport from '@/components/AnalysisReport';
import type { AnalysisResult, Student, Analysis } from '@/lib/schema';

export default function AnalysisPage() {
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [studentRes, analysesRes] = await Promise.all([
        fetch(`/api/students?id=${studentId}`),
        fetch(`/api/analysis?student_id=${studentId}`),
      ]);
      const studentData = await studentRes.json();
      const analysesData = await analysesRes.json();

      setStudent(studentData);
      setAnalyses(analysesData);

      // Load the latest analysis result
      if (analysesData.length > 0) {
        const latest = analysesData[0];
        const weaknesses = JSON.parse(latest.weaknesses);
        const recommendations = JSON.parse(latest.recommendations);
        setCurrentResult({
          weaknesses,
          ...recommendations,
        });
      }
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function runAnalysis() {
    setAnalyzing(true);
    setError('');

    try {
      const res = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: Number(studentId) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Analysis failed');
      }

      const data = await res.json();
      setCurrentResult(data.result);
      await loadData(); // Refresh analyses list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16 text-slate-400">Loading...</div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-16 text-red-500">Student not found</div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href={`/students/${studentId}`} className="text-sm text-blue-600 hover:text-blue-800">
          &larr; Back to {student.name_en}
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">
          AI Weakness Analysis
        </h1>
        <p className="text-sm text-slate-500">
          {student.name_en} {student.name_kr ? `(${student.name_kr})` : ''} - AI 약점 분석
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      {/* Run Analysis Button */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Run New Analysis</h2>
            <p className="text-sm text-slate-500 mt-1">
              Claude will analyze all collected needs data and identify real weaknesses
            </p>
          </div>
          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="px-5 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {analyzing ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              'Run Analysis / 분석 실행'
            )}
          </button>
        </div>

        {analyses.length > 0 && (
          <p className="text-xs text-slate-400 mt-3">
            Last analysis: {analyses[0].analysis_date} | Total analyses: {analyses.length}
          </p>
        )}
      </div>

      {/* Analysis Result */}
      {currentResult ? (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <AnalysisReport
            result={currentResult}
            date={analyses[0]?.analysis_date}
          />
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 bg-white rounded-lg border border-slate-200">
          <p className="text-lg">No analysis yet</p>
          <p className="text-sm mt-1">Click &quot;Run Analysis&quot; to generate a weakness report</p>
          <p className="text-sm text-slate-300 mt-1">분석 결과가 없습니다. 위의 버튼을 클릭하세요.</p>
        </div>
      )}
    </div>
  );
}
