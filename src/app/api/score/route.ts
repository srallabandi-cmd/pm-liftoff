import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { definition, testCases } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are evaluating a Product Manager's response to a diagnostic task.
The scenario: A feature that summarizes customer support tickets.
The task was to define what a good summary looks like and list 3 test cases.

Here is the PM's definition of a good summary:
"""
${definition}
"""

Here are the PM's 3 test cases:
"""
${testCases}
"""

Evaluate the response based on the following three criteria on a scale of 1 to 5:
1. Eval thinking: How well do they understand how to evaluate AI? Are the metrics or criteria clear, objective, and measurable?
2. Spec precision: How precise and actionable is the definition of a good summary?
3. Failure-mode awareness: Do the test cases cover realistic edge cases and potential AI failures (e.g., hallucinations, omissions, bias)?

You must return strict JSON matching this schema:
{
  "evalThinking": number, // 1 to 5
  "specPrecision": number, // 1 to 5
  "failureModeAwareness": number, // 1 to 5
  "feedback": string // exactly two sentences of specific and critical feedback
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text);
      return NextResponse.json(result);
    } else {
      throw new Error("No response from Gemini");
    }

  } catch (error: any) {
    console.error("Score Error:", error);
    return NextResponse.json({ error: error.message || "Failed to score" }, { status: 500 });
  }
}
