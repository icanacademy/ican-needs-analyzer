'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface StatusToggleProps {
  studentId: number;
  currentStatus: string;
}

const statusOptions = ['active', 'paused', 'completed'] as const;

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-800 border-green-300',
  paused: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  completed: 'bg-slate-100 text-slate-800 border-slate-300',
};

export default function StatusToggle({ studentId, currentStatus }: StatusToggleProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function changeStatus(newStatus: string) {
    if (newStatus === currentStatus) return;
    setUpdating(true);
    try {
      await fetch('/api/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: studentId, status: newStatus }),
      });
      router.refresh();
    } finally {
      setUpdating(false);
    }
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => changeStatus(e.target.value)}
      disabled={updating}
      className={`text-sm font-medium px-3 py-1.5 rounded-lg border cursor-pointer ${statusStyles[currentStatus] || statusStyles.active}`}
    >
      {statusOptions.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
