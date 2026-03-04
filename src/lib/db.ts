import Database from 'better-sqlite3';
import path from 'path';
import type { Student, Need, Analysis, CreateStudentInput, CreateNeedInput } from './schema';

const DB_PATH = path.join(process.cwd(), 'data', 'needs.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT NOT NULL,
      name_kr TEXT,
      grade_level INTEGER,
      program_type TEXT DEFAULT 'online',
      start_date TEXT,
      end_date TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS needs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      source TEXT NOT NULL,
      recorded_by TEXT,
      date TEXT NOT NULL,
      category TEXT,
      description TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'open',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (student_id) REFERENCES students(id)
    );

    CREATE TABLE IF NOT EXISTS analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      analysis_date TEXT DEFAULT (datetime('now')),
      needs_snapshot TEXT NOT NULL,
      weaknesses TEXT NOT NULL,
      recommendations TEXT NOT NULL,
      raw_response TEXT,
      FOREIGN KEY (student_id) REFERENCES students(id)
    );
  `);
}

// ─── Students ───────────────────────────────────────────

export function getAllStudents(status?: string): Student[] {
  const db = getDb();
  if (status) {
    return db.prepare('SELECT * FROM students WHERE status = ? ORDER BY created_at DESC').all(status) as Student[];
  }
  return db.prepare('SELECT * FROM students ORDER BY created_at DESC').all() as Student[];
}

export function getStudent(id: number): Student | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM students WHERE id = ?').get(id) as Student | undefined;
}

export function createStudent(input: CreateStudentInput): Student {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO students (name_en, name_kr, grade_level, program_type, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    input.name_en,
    input.name_kr || null,
    input.grade_level || null,
    input.program_type || 'online',
    input.start_date || null,
    input.end_date || null,
  );
  return getStudent(result.lastInsertRowid as number)!;
}

export function updateStudentStatus(id: number, status: string): Student | undefined {
  const db = getDb();
  db.prepare('UPDATE students SET status = ? WHERE id = ?').run(status, id);
  return getStudent(id);
}

// ─── Needs ──────────────────────────────────────────────

export function getNeedsForStudent(studentId: number): Need[] {
  const db = getDb();
  return db.prepare('SELECT * FROM needs WHERE student_id = ? ORDER BY date DESC, created_at DESC').all(studentId) as Need[];
}

export function getAllNeeds(limit = 50): Need[] {
  const db = getDb();
  return db.prepare('SELECT * FROM needs ORDER BY created_at DESC LIMIT ?').all(limit) as Need[];
}

export function getNeed(id: number): Need | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM needs WHERE id = ?').get(id) as Need | undefined;
}

export function createNeed(input: CreateNeedInput): Need {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO needs (student_id, source, recorded_by, date, category, description, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.student_id,
    input.source,
    input.recorded_by || null,
    input.date,
    input.category || null,
    input.description,
    input.priority || 'medium',
  );
  return getNeed(result.lastInsertRowid as number)!;
}

export function updateNeedStatus(id: number, status: string): Need | undefined {
  const db = getDb();
  db.prepare('UPDATE needs SET status = ? WHERE id = ?').run(status, id);
  return getNeed(id);
}

export function getOpenNeedsCount(studentId: number): number {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) as count FROM needs WHERE student_id = ? AND status = ?').get(studentId, 'open') as { count: number };
  return row.count;
}

export function getTotalNeedsCount(studentId: number): number {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) as count FROM needs WHERE student_id = ?').get(studentId) as { count: number };
  return row.count;
}

// ─── Analyses ───────────────────────────────────────────

export function getAnalysesForStudent(studentId: number): Analysis[] {
  const db = getDb();
  return db.prepare('SELECT * FROM analyses WHERE student_id = ? ORDER BY analysis_date DESC').all(studentId) as Analysis[];
}

export function getLatestAnalysis(studentId: number): Analysis | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM analyses WHERE student_id = ? ORDER BY analysis_date DESC LIMIT 1').get(studentId) as Analysis | undefined;
}

export function createAnalysis(
  studentId: number,
  needsSnapshot: string,
  weaknesses: string,
  recommendations: string,
  rawResponse: string | null,
): Analysis {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO analyses (student_id, needs_snapshot, weaknesses, recommendations, raw_response)
    VALUES (?, ?, ?, ?, ?)
  `).run(studentId, needsSnapshot, weaknesses, recommendations, rawResponse);
  return db.prepare('SELECT * FROM analyses WHERE id = ?').get(result.lastInsertRowid as number) as Analysis;
}

// ─── Stats ──────────────────────────────────────────────

export function getDashboardStats() {
  const db = getDb();
  const totalStudents = (db.prepare('SELECT COUNT(*) as count FROM students WHERE status = ?').get('active') as { count: number }).count;
  const totalNeeds = (db.prepare('SELECT COUNT(*) as count FROM needs WHERE status = ?').get('open') as { count: number }).count;
  const totalAnalyses = (db.prepare('SELECT COUNT(*) as count FROM analyses').get() as { count: number }).count;

  // Students with open needs that haven't been analyzed recently
  const studentsNeedingAttention = db.prepare(`
    SELECT DISTINCT s.id, s.name_en, s.name_kr, COUNT(n.id) as open_needs
    FROM students s
    JOIN needs n ON n.student_id = s.id AND n.status = 'open'
    WHERE s.status = 'active'
    GROUP BY s.id
    HAVING open_needs > 0
    ORDER BY open_needs DESC
  `).all() as (Student & { open_needs: number })[];

  return { totalStudents, totalNeeds, totalAnalyses, studentsNeedingAttention };
}
