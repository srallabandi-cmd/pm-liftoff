# PM Liftoff

An eval that grades how you reason as an AI PM. You work a real AI product task, a model scores your thinking against a rubric, and it tells you where you're weak.

Built to make one thing concrete: the move from traditional product management into AI-native product work is a set of specific, testable skills, not a vibe. PM Liftoff turns those skills into a scored assessment.

## What it does

You get a real AI PM task. The first one: define an eval for a feature that summarizes customer support tickets. You write what a good summary looks like and the test cases you would use to check it.

Your answer is scored 1 to 5 on three axes:

- Eval thinking: do you define "good" in measurable terms
- Spec precision: are your criteria specific and unambiguous
- Failure-mode awareness: do your test cases probe hallucination, omission, and edge cases

You get a score per axis plus specific written feedback on what to fix.

## Why a rubric, not a checklist

A skills checklist proves nothing. An eval that discriminates does. The scorer was validated against two answers to the same task:

- A rigorous answer (faithfulness, sentiment flags, real edge-case tests): 5 / 5 / 5
- A lazy answer ("keep it short," test cases that only vary ticket length): 1 / 1 / 1

Same task, opposite scores. The scorer separates real reasoning from filler.

## Stack

- Next.js 15 (App Router) and Tailwind
- Gemini 2.5 Flash for scoring, via @google/genai
- Built in Google Antigravity

## Run locally

npm install
echo "GEMINI_API_KEY=your_key_here" > .env.local
npm run dev

Open http://localhost:3000. Get a free Gemini key from Google AI Studio.

## Status

v0. One task (Define an Eval) live and validated end to end. Next: spec an agentic feature, make a model tradeoff, and a composite readiness score across tasks.
