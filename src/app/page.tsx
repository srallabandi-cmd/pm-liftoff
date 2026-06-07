"use client";

import { useState } from 'react';
import { DIAGNOSTIC_TASKS } from '@/lib/tasks';

type Screen = 'INTAKE' | 'DIAGNOSTIC' | 'LOADING' | 'RESULTS';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('INTAKE');

  // Intake State
  const [role, setRole] = useState('');
  const [domain, setDomain] = useState('');
  const [aiExposure, setAiExposure] = useState('none');

  // Diagnostic Task State
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [taskInputs, setTaskInputs] = useState<Record<string, string>>({});

  // All Tasks Results
  const [allResults, setAllResults] = useState<{
    taskIndex: number;
    scores: Record<string, number>;
    feedback: string;
  }[]>([]);

  // Error State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScreen('DIAGNOSTIC');
  };

  const handleDiagnosticSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentTask = DIAGNOSTIC_TASKS[currentTaskIndex];
    const cleanedInputs: Record<string, string> = {};
    for (const input of currentTask.inputs) {
      const val = (taskInputs[input.id] || '').trim();
      if (!val) {
        setErrorMsg(`Please fill out: ${input.label}`);
        return;
      }
      cleanedInputs[input.id] = val;
    }

    setScreen('LOADING');
    setErrorMsg(null);

    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentTask.title,
          scenario: currentTask.scenario,
          inputs: cleanedInputs,
          criteria: currentTask.criteria,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to score');
      }

      const scores: Record<string, number> = {};
      currentTask.criteria.forEach(c => {
        scores[c.id] = data[c.id] || 0;
      });

      const newResults = [...allResults, {
        taskIndex: currentTaskIndex,
        scores,
        feedback: data.feedback || '',
      }];

      setAllResults(newResults);

      if (currentTaskIndex < DIAGNOSTIC_TASKS.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
        setTaskInputs({});
        setScreen('DIAGNOSTIC');
      } else {
        setScreen('RESULTS');
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'An error occurred while scoring.');
      setScreen('DIAGNOSTIC');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-600/20 blur-[120px] pointer-events-none" />

      <main className="w-full max-w-2xl z-10 relative">
        <div className="mb-12 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-purple-500"></div>
            <h1 className="text-4xl font-extrabold tracking-[-0.02em] font-[family-name:var(--font-space-grotesk)] bg-gradient-to-r from-indigo-400 to-rose-400 bg-clip-text text-transparent">
              PM Liftoff
            </h1>
          </div>
          <p className="text-neutral-400 mt-2">Pressure-test how you'd reason as an AI PM.</p>
        </div>

        <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl transition-all duration-500 min-h-[400px] flex flex-col justify-center">
          {screen === 'INTAKE' && (
            <form onSubmit={handleIntakeSubmit} className="space-y-6 animate-fade-in w-full">
              <h2 className="text-2xl font-semibold mb-6">Let's get to know you</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Current Role</label>
                  <input
                    required
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="e.g. Senior PM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Domain</label>
                  <input
                    required
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="e.g. B2B SaaS, E-commerce"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">AI Exposure</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['none', 'some', 'lots'].map((level) => (
                      <label
                        key={level}
                        className={`cursor-pointer border rounded-xl p-4 text-center transition-all ${aiExposure === level ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-900'}`}
                      >
                        <input
                          type="radio"
                          name="aiExposure"
                          value={level}
                          checked={aiExposure === level}
                          onChange={(e) => setAiExposure(e.target.value)}
                          className="hidden"
                        />
                        <span className="capitalize font-medium">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-100 text-neutral-950 font-semibold py-3 rounded-xl mt-8 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 transform active:scale-95"
              >
                Continue
              </button>
            </form>
          )}

          {screen === 'DIAGNOSTIC' && (() => {
            const currentTask = DIAGNOSTIC_TASKS[currentTaskIndex];
            return (
              <form onSubmit={handleDiagnosticSubmit} className="space-y-6 animate-fade-in w-full">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-semibold text-neutral-100">{currentTask.title}</h2>
                    <span className="text-sm font-medium text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                      Task {currentTaskIndex + 1} of {DIAGNOSTIC_TASKS.length}
                    </span>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mt-4">
                    <h3 className="text-sm font-medium text-indigo-300 mb-1">Scenario</h3>
                    <p className="text-neutral-300 text-sm leading-relaxed">
                      {currentTask.scenario}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {currentTask.inputs.map((input) => (
                    <div key={input.id}>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        {input.label}
                      </label>
                      <textarea
                        required
                        value={taskInputs[input.id] || ''}
                        onChange={(e) => setTaskInputs(prev => ({ ...prev, [input.id]: e.target.value }))}
                        rows={3}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                        placeholder={input.placeholder}
                      />
                    </div>
                  ))}
                </div>

                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center justify-between">
                    <p className="text-red-400 text-sm font-medium">{errorMsg}</p>
                    <button type="button" onClick={handleDiagnosticSubmit} className="text-red-300 hover:text-white text-sm font-bold underline">Retry</button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={currentTask.inputs.some(input => !(taskInputs[input.id] || '').trim())}
                  className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-semibold py-3 rounded-xl mt-8 hover:opacity-90 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:hover:shadow-none transition-all duration-300 transform active:scale-95"
                >
                  {currentTaskIndex < DIAGNOSTIC_TASKS.length - 1 ? 'Submit & Next Task' : 'Submit for Final Scoring'}
                </button>
              </form>
            );
          })()}

          {screen === 'LOADING' && (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in w-full">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-r-2 border-rose-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <h2 className="text-xl font-medium text-neutral-200">Evaluating your response...</h2>
              <p className="text-neutral-500 text-sm mt-2">Running through Gemini API</p>
            </div>
          )}

          {screen === 'RESULTS' && (() => {
            let totalScore = 0;
            let totalCriteria = 0;
            allResults.forEach(res => {
              Object.values(res.scores).forEach(s => {
                totalScore += s;
                totalCriteria += 1;
              });
            });
            const compositeScore = totalCriteria > 0 ? (totalScore / totalCriteria) : 0;

            return (
              <div className="space-y-12 animate-fade-in w-full">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-neutral-100 mb-2">Evaluation Results</h2>
                  <p className="text-neutral-400">Here's how your responses scored across all tasks.</p>
                </div>

                <CircularGauge score={compositeScore} />

                <div className="space-y-10 mt-8">
                  {allResults.map((result, idx) => {
                    const task = DIAGNOSTIC_TASKS[result.taskIndex];
                    return (
                      <div key={idx} className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800/50">
                        <h3 className="text-xl font-bold text-neutral-200 mb-6 border-b border-neutral-800 pb-4">{task.title}</h3>
                        
                        <div className="space-y-6">
                          {task.criteria.map(c => (
                            <ScoreBar key={c.id} label={c.name} score={result.scores[c.id]} />
                          ))}
                        </div>

                        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 mt-8 relative overflow-hidden group hover:border-neutral-700 transition-all">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                            Feedback
                          </h4>
                          <p className="text-neutral-200 leading-relaxed text-sm">{result.feedback}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setCurrentTaskIndex(0);
                    setTaskInputs({});
                    setAllResults([]);
                    setScreen('DIAGNOSTIC');
                  }}
                  className="w-full bg-neutral-800 text-neutral-200 font-semibold py-3 rounded-xl mt-4 hover:bg-neutral-700 transition-all duration-300 transform active:scale-95"
                >
                  Start Over
                </button>
              </div>
            );
          })()}
        </div>
      </main>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const percentage = (score / 5) * 100;
  
  let chipClass = "text-red-400 bg-red-500/10 border border-red-500/20";
  let barClass = "bg-red-500";
  let hoverTextClass = "group-hover:text-red-400";

  if (score >= 4) {
    chipClass = "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20";
    barClass = "bg-emerald-500";
    hoverTextClass = "group-hover:text-emerald-400";
  } else if (score >= 3) {
    chipClass = "text-amber-400 bg-amber-500/10 border border-amber-500/20";
    barClass = "bg-amber-500";
    hoverTextClass = "group-hover:text-amber-400";
  }

  return (
    <div className="group">
      <div className="flex justify-between items-end mb-2">
        <span className={`text-sm font-medium text-neutral-200 transition-colors ${hoverTextClass}`}>{label}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${chipClass}`}>{score} / 5</span>
      </div>
      <div className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full transition-all duration-1000 ease-out rounded-full relative ${barClass}`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>
    </div>
  );
}

function CircularGauge({ score }: { score: number }) {
  const percentage = (score / 5) * 100;
  
  let colorClass = "text-red-500";
  let strokeClass = "stroke-red-500";
  if (score >= 4) {
    colorClass = "text-emerald-500";
    strokeClass = "stroke-emerald-500";
  } else if (score >= 2.5) {
    colorClass = "text-amber-500";
    strokeClass = "stroke-amber-500";
  }

  let tier = "Early";
  let tierColor = "bg-red-500/10 text-red-400 border-red-500/20";
  if (score >= 4.5) {
    tier = "Sharp";
    tierColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  } else if (score >= 3.5) {
    tier = "Strong";
    tierColor = "bg-green-500/10 text-green-400 border-green-500/20";
  } else if (score >= 2.0) {
    tier = "Developing";
    tierColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center justify-center gap-8 mb-8 bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800/50">
      <div className="relative flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-neutral-800"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${strokeClass} transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${colorClass}`}>{score.toFixed(1)}</span>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mt-1">out of 5</span>
        </div>
      </div>
      
      <div className="flex flex-col">
        <h3 className="text-xl font-bold text-neutral-200 mb-2">AI PM Readiness</h3>
        <div className={`inline-flex items-center self-start px-3 py-1 rounded-full border text-sm font-semibold tracking-wide ${tierColor}`}>
          {tier}
        </div>
      </div>
    </div>
  );
}
