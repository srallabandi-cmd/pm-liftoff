export interface TaskInputDef {
  id: string;
  label: string;
  placeholder: string;
}

export interface TaskCriterion {
  id: string;
  name: string;
  description: string;
}

export interface TaskDef {
  id: string;
  title: string;
  scenario: string;
  inputs: TaskInputDef[];
  criteria: TaskCriterion[];
}

export const DIAGNOSTIC_TASKS: TaskDef[] = [
  {
    id: "task-1",
    title: "Define an eval",
    scenario: "You are building a feature that summarizes customer support tickets. To ensure it works well, you need to define what a \"good\" summary looks like.",
    inputs: [
      {
        id: "definition",
        label: "Define what a good summary looks like",
        placeholder: "A good summary should...",
      },
      {
        id: "testCases",
        label: "List 3 test cases to evaluate the AI",
        placeholder: "1. A ticket where...\n2. A ticket with...\n3. A ticket that...",
      }
    ],
    criteria: [
      { id: "evalThinking", name: "Eval thinking", description: "How well do they understand how to evaluate AI? Are the metrics or criteria clear, objective, and measurable?" },
      { id: "specPrecision", name: "Spec precision", description: "How precise and actionable is the definition of a good summary?" },
      { id: "failureModeAwareness", name: "Failure-mode awareness", description: "Do the test cases cover realistic edge cases and potential AI failures (e.g., hallucinations, omissions, bias)?" }
    ]
  },
  {
    id: "task-2",
    title: "Spec an agentic feature",
    scenario: "A product lead says 'let users automate their email triage.' You need to write a spec for this agent.",
    inputs: [
      {
        id: "goal",
        label: "What is the primary goal of the agent?",
        placeholder: "The agent should...",
      },
      {
        id: "guardrails",
        label: "What guardrails should be put in place?",
        placeholder: "It must never...",
      },
      {
        id: "failureModes",
        label: "What are the potential failure modes?",
        placeholder: "It might fail by...",
      }
    ],
    criteria: [
      { id: "agenticReasoning", name: "Agentic reasoning", description: "Does the goal clearly articulate what the agent should autonomously achieve?" },
      { id: "guardrailAndFailureModeThinking", name: "Guardrail and failure-mode thinking", description: "Are the guardrails and failure modes comprehensive and realistic for an email triage agent?" },
      { id: "scopeClarity", name: "Scope clarity", description: "Is the scope of the feature well-defined and constrained appropriately?" }
    ]
  },
  {
    id: "task-3",
    title: "Make a model tradeoff",
    scenario: "You need to power a real-time support assistant under tight latency and cost limits where quality still matters.",
    inputs: [
      {
        id: "choice",
        label: "Which approach would you choose?",
        placeholder: "I would choose...",
      },
      {
        id: "justification",
        label: "Justify your choice based on latency, cost, and quality.",
        placeholder: "This is the best approach because...",
      }
    ],
    criteria: [
      { id: "modelLiteracy", name: "Model literacy", description: "Does the choice reflect a solid understanding of different model capabilities (e.g., flash vs pro vs local)?" },
      { id: "tradeoffReasoning", name: "Tradeoff reasoning", description: "Does the justification balance latency, cost, and quality well?" },
      { id: "justificationQuality", name: "Justification quality", description: "Is the justification logical, clear, and well-reasoned?" }
    ]
  }
];
