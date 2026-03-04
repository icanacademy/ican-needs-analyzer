import type { Need } from './schema';

export function buildAnalysisPrompt(studentName: string, gradeLevel: number | null, needs: Need[]): string {
  const needsSummary = needs.map(n => {
    return `- [${n.source.toUpperCase()}] (${n.date}, ${n.priority} priority) [${n.category || 'uncategorized'}]: ${n.description} (status: ${n.status})`;
  }).join('\n');

  const sourceBreakdown = needs.reduce((acc, n) => {
    acc[n.source] = (acc[n.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceSummary = Object.entries(sourceBreakdown)
    .map(([source, count]) => `${source}: ${count} entries`)
    .join(', ');

  return `You are an ESL needs analyst for ICAN Language Center, a Philippine-based English academy serving Korean students. Your job is to analyze collected needs data from multiple sources and identify a student's REAL weaknesses.

## Student Profile
- Name: ${studentName}
- Grade Level: ${gradeLevel ?? 'Unknown'}
- Program: Online ESL

## Collected Needs Data (${needs.length} entries from: ${sourceSummary})
${needsSummary}

## Your Analysis Task

Analyze ALL the needs data above and produce a structured weakness analysis. Pay special attention to:

1. **Cross-referencing sources**: Compare what PARENTS report vs what TEACHERS observe. Parents often focus on perceived weaknesses (what they think is wrong), while teachers see actual performance. Find the overlap = real weaknesses.

2. **Distinguishing perceived vs actual weaknesses**: If a parent says "speaking is weak" but the teacher says speaking is fine, the real issue might be confidence, not ability.

3. **Identifying patterns**: Look for recurring themes across multiple entries and time periods.

4. **Priority ranking**: What needs the most immediate attention?

## Required Output Format (JSON)

Respond with ONLY valid JSON in this exact structure:
{
  "weaknesses": [
    {
      "skill": "Specific skill area",
      "severity": "high|medium|low",
      "confidence": 0.0-1.0,
      "evidence": ["Evidence from the data"],
      "parent_perceived": true/false,
      "teacher_confirmed": true/false
    }
  ],
  "discrepancies": [
    "Any mismatches between parent perception and teacher observation"
  ],
  "recommended_focus": [
    {
      "area": "Focus area name",
      "suggested_activities": ["Activity 1", "Activity 2"],
      "priority": 1
    }
  ],
  "main_goal": "One-sentence primary learning goal",
  "sub_goals": ["Supporting goal 1", "Supporting goal 2"]
}

Important:
- Base analysis ONLY on the provided data, do not invent needs
- If there's insufficient data for high confidence, say so in the evidence
- Rank weaknesses by severity and confidence
- Make activity suggestions practical and specific to ESL instruction
- Consider the student's grade level when suggesting activities`;
}
