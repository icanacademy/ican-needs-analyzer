// Database types matching SQLite schema

export interface Student {
  id: number;
  name_en: string;
  name_kr: string | null;
  grade_level: number | null;
  program_type: string;
  start_date: string | null;
  end_date: string | null;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
}

export type NeedSource = 'parent_form' | 'parent_call' | 'teacher' | 'level_test' | 'weekly_review';
export type NeedCategory = 'reading' | 'writing' | 'speaking' | 'listening' | 'grammar' | 'vocabulary' | 'pronunciation' | 'comprehension' | 'behavior' | 'other';
export type NeedPriority = 'high' | 'medium' | 'low';
export type NeedStatus = 'open' | 'addressed' | 'resolved';

export interface Need {
  id: number;
  student_id: number;
  source: NeedSource;
  recorded_by: string | null;
  date: string;
  category: NeedCategory | null;
  description: string;
  priority: NeedPriority;
  status: NeedStatus;
  created_at: string;
}

export interface Analysis {
  id: number;
  student_id: number;
  analysis_date: string;
  needs_snapshot: string; // JSON
  weaknesses: string;    // JSON
  recommendations: string; // JSON
  raw_response: string | null;
}

// Parsed analysis result types
export interface Weakness {
  skill: string;
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  evidence: string[];
  parent_perceived: boolean;
  teacher_confirmed: boolean;
}

export interface RecommendedFocus {
  area: string;
  suggested_activities: string[];
  priority: number;
}

export interface AnalysisResult {
  weaknesses: Weakness[];
  discrepancies: string[];
  recommended_focus: RecommendedFocus[];
  main_goal: string;
  sub_goals: string[];
}

// Form/API input types
export interface CreateStudentInput {
  name_en: string;
  name_kr?: string;
  grade_level?: number;
  program_type?: string;
  start_date?: string;
  end_date?: string;
}

export interface CreateNeedInput {
  student_id: number;
  source: NeedSource;
  recorded_by?: string;
  date: string;
  category?: NeedCategory;
  description: string;
  priority?: NeedPriority;
}

// Constants for form dropdowns
export const NEED_SOURCES: { value: NeedSource; label: string; labelKr: string }[] = [
  { value: 'parent_form', label: 'Parent Form', labelKr: '학부모 양식' },
  { value: 'parent_call', label: 'Parent Call', labelKr: '학부모 전화' },
  { value: 'teacher', label: 'Teacher Observation', labelKr: '교사 관찰' },
  { value: 'level_test', label: 'Level Test', labelKr: '레벨 테스트' },
  { value: 'weekly_review', label: 'Weekly Review', labelKr: '주간 리뷰' },
];

export const NEED_CATEGORIES: { value: NeedCategory; label: string; labelKr: string }[] = [
  { value: 'reading', label: 'Reading', labelKr: '읽기' },
  { value: 'writing', label: 'Writing', labelKr: '쓰기' },
  { value: 'speaking', label: 'Speaking', labelKr: '말하기' },
  { value: 'listening', label: 'Listening', labelKr: '듣기' },
  { value: 'grammar', label: 'Grammar', labelKr: '문법' },
  { value: 'vocabulary', label: 'Vocabulary', labelKr: '어휘' },
  { value: 'pronunciation', label: 'Pronunciation', labelKr: '발음' },
  { value: 'comprehension', label: 'Comprehension', labelKr: '이해력' },
  { value: 'behavior', label: 'Behavior', labelKr: '행동' },
  { value: 'other', label: 'Other', labelKr: '기타' },
];

export const NEED_PRIORITIES: { value: NeedPriority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const SOURCE_COLORS: Record<NeedSource, string> = {
  parent_form: 'bg-blue-100 text-blue-800',
  parent_call: 'bg-purple-100 text-purple-800',
  teacher: 'bg-green-100 text-green-800',
  level_test: 'bg-orange-100 text-orange-800',
  weekly_review: 'bg-yellow-100 text-yellow-800',
};

export const PRIORITY_COLORS: Record<NeedPriority, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-gray-100 text-gray-800',
};

export const STATUS_COLORS: Record<NeedStatus, string> = {
  open: 'bg-blue-100 text-blue-800',
  addressed: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
};
