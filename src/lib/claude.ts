import Anthropic from '@anthropic-ai/sdk';
import type { Need, AnalysisResult } from './schema';
import { buildAnalysisPrompt } from './analysis-prompt';

const client = new Anthropic();

export async function analyzeStudentNeeds(
  studentName: string,
  gradeLevel: number | null,
  needs: Need[],
): Promise<{ result: AnalysisResult; rawResponse: string }> {
  const prompt = buildAnalysisPrompt(studentName, gradeLevel, needs);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250514',
    max_tokens: 4096,
    messages: [
      { role: 'user', content: prompt },
    ],
  });

  const rawResponse = message.content
    .filter(block => block.type === 'text')
    .map(block => block.type === 'text' ? block.text : '')
    .join('');

  // Extract JSON from the response (handle markdown code blocks)
  let jsonStr = rawResponse;
  const jsonMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const result: AnalysisResult = JSON.parse(jsonStr);
  return { result, rawResponse };
}
