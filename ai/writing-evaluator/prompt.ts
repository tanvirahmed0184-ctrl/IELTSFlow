export function buildWritingEvaluationPrompt(
  taskType: string,
  promptText: string,
  response: string,
  wordCount: number
): string {
  const taskLabel =
    taskType === "TASK_2"
      ? "Writing Task 2 (Essay)"
      : taskType === "TASK_1_GENERAL"
        ? "Writing Task 1 (General Training Letter)"
        : "Writing Task 1 (Academic Report)";

  const criterionName =
    taskType === "TASK_2" ? "Task Response" : "Task Achievement";

  const minWords = taskType === "TASK_2" ? 250 : 150;

  return `You are a certified IELTS examiner with 15+ years of experience. Evaluate the following IELTS ${taskLabel} response using the official IELTS Writing band descriptors.

## TASK PROMPT
${promptText}

## STUDENT RESPONSE (${wordCount} words)
${response}

## EVALUATION INSTRUCTIONS
Score each criterion on the official IELTS 0.5 scale (e.g. 5.0, 5.5, 6.0, 6.5, 7.0).
Minimum word count for this task is ${minWords} words. The student wrote ${wordCount} words.

You MUST return ONLY valid JSON with this exact structure (no markdown, no backticks):
{
  "taskAchievement": <number>,
  "coherenceCohesion": <number>,
  "lexicalResource": <number>,
  "grammaticalRange": <number>,
  "strengths": ["<string>", ...],
  "weaknesses": ["<string>", ...],
  "corrections": [
    {"original": "<exact phrase from essay>", "corrected": "<improved version>", "explanation": "<why>"},
    ...
  ],
  "vocabularySuggestions": [
    {"original": "<word/phrase used>", "suggested": "<better alternative>", "context": "<brief context>"},
    ...
  ],
  "sampleRewrite": "<a Band 8+ rewrite of the student's response, same topic, ~same length>",
  "examinerSummary": "<2-3 sentence examiner-style overall comment>"
}

CRITERIA:
1. ${criterionName} (taskAchievement): How well the response addresses the task requirements
2. Coherence and Cohesion (coherenceCohesion): Organization, paragraphing, linking
3. Lexical Resource (lexicalResource): Vocabulary range, accuracy, appropriateness
4. Grammatical Range and Accuracy (grammaticalRange): Sentence structures, error frequency

IMPORTANT:
- These are PREDICTED PRACTICE band scores, not official IELTS scores
- Provide at least 3 strengths and 3 weaknesses
- Provide at least 3 sentence-level corrections
- Provide at least 3 vocabulary suggestions
- Band scores must be multiples of 0.5 between 0 and 9
- Return ONLY the JSON object, nothing else`;
}
