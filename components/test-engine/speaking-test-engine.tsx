"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useTestTimer } from "@/hooks/useTestTimer";
import {
  Mic, MicOff, Volume2, GraduationCap, ArrowRight, Clock, CheckCircle2,
  AlertTriangle, Loader2, RotateCcw, Play, Square, MessageSquare, User, Bot,
} from "lucide-react";
import Link from "next/link";

type Phase = "ready" | "part1" | "part2_prep" | "part2_speak" | "part3" | "evaluating" | "results";

interface TranscriptEntry {
  speaker: "examiner" | "student";
  text: string;
  part: string;
  timestamp: number;
}

interface SpeakingEvalResult {
  fluencyCoherence: number;
  lexicalResource: number;
  grammaticalRange: number;
  pronunciation: number;
  overallBand: number;
  pronunciationFeedback: string[];
  vocabularyFeedback: string[];
  grammarFeedback: string[];
  suggestedStrategy: string;
  fillerWordAnalysis: { word: string; count: number }[];
}

const PART1_QUESTIONS = [
  "Let's talk about your hometown. Where do you come from?",
  "What do you like most about living there?",
  "Do you think your hometown has changed much in recent years?",
  "Let's talk about your daily routine. What do you usually do in the morning?",
];

const CUE_CARD = {
  topic: "Describe a book that you have read recently and found interesting",
  bullets: [
    "What the book was about",
    "Why you decided to read it",
    "What you learned from it",
    "And explain why you found it interesting",
  ],
};

const PART3_QUESTIONS = [
  "Do you think reading is becoming less popular among young people?",
  "How has technology changed the way people read?",
  "What role do libraries play in modern society?",
];

export function SpeakingTestEngine() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [transcriptLog, setTranscriptLog] = useState<TranscriptEntry[]>([]);
  const [evaluation, setEvaluation] = useState<SpeakingEvalResult | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);
  const startTimeRef = useRef(0);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<() => void>(() => {});

  const recognition = useSpeechRecognition({
    lang: "en-US",
    continuous: true,
    interimResults: true,
  });

  const tts = useSpeechSynthesis({
    rate: 0.92,
    onEnd: () => {
      if (phase === "part1" || phase === "part3") {
        recognition.start();
      }
    },
  });

  const part2PrepTimer = useTestTimer({
    initialSeconds: 60,
    onTimeUp: () => startPart2Speaking(),
  });

  const part2SpeakTimer = useTestTimer({
    initialSeconds: 120,
    onTimeUp: () => finishPart2(),
  });

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcriptLog]);

  const addToLog = useCallback((speaker: "examiner" | "student", text: string, part: string) => {
    setTranscriptLog((prev) => [...prev, { speaker, text, part, timestamp: Date.now() - startTimeRef.current }]);
  }, []);

  const askQuestion = useCallback((question: string, part: string) => {
    addToLog("examiner", question, part);
    tts.speak(question);
  }, [tts, addToLog]);

  const handleStartTest = useCallback(() => {
    startTimeRef.current = performance.now();
    setPhase("part1");
    const intro = "This is the IELTS speaking test. I'm going to ask you some questions about yourself. " + PART1_QUESTIONS[0];
    askQuestion(intro, "PART_1");
    setCurrentQuestionIdx(0);
  }, [askQuestion]);

  const handleStudentFinishAnswer = useCallback(() => {
    recognition.stop();
    const studentText = recognition.transcript.trim();
    if (studentText) {
      addToLog("student", studentText, phase === "part1" ? "PART_1" : phase === "part3" ? "PART_3" : "PART_2");
    }
    recognition.reset();

    if (phase === "part1") {
      const nextIdx = currentQuestionIdx + 1;
      if (nextIdx < PART1_QUESTIONS.length) {
        setCurrentQuestionIdx(nextIdx);
        askQuestion(PART1_QUESTIONS[nextIdx], "PART_1");
      } else {
        setPhase("part2_prep");
        const cueIntro = `Now I'm going to give you a topic. You have one minute to prepare, then you need to speak for one to two minutes. Your topic is: ${CUE_CARD.topic}. You should say: ${CUE_CARD.bullets.join(", ")}.`;
        addToLog("examiner", cueIntro, "PART_2");
        tts.speak("Now I'm going to give you a topic card. You have one minute to prepare.");
        part2PrepTimer.start();
      }
    } else if (phase === "part3") {
      const nextIdx = currentQuestionIdx + 1;
      if (nextIdx < PART3_QUESTIONS.length) {
        setCurrentQuestionIdx(nextIdx);
        askQuestion(PART3_QUESTIONS[nextIdx], "PART_3");
      } else {
        submitRef.current();
      }
    }
  }, [phase, currentQuestionIdx, recognition, addToLog, askQuestion, tts, part2PrepTimer]);

  const startPart2Speaking = useCallback(() => {
    setPhase("part2_speak");
    tts.speak("Your preparation time is over. Please begin speaking now.");
    part2SpeakTimer.start();
    setTimeout(() => recognition.start(), 2000);
  }, [tts, part2SpeakTimer, recognition]);

  const finishPart2 = useCallback(() => {
    recognition.stop();
    const studentText = recognition.transcript.trim();
    if (studentText) addToLog("student", studentText, "PART_2");
    recognition.reset();

    setPhase("part3");
    setCurrentQuestionIdx(0);
    setTimeout(() => {
      const intro = "Now let's discuss some more general questions related to this topic. " + PART3_QUESTIONS[0];
      askQuestion(intro, "PART_3");
    }, 1500);
  }, [recognition, addToLog, askQuestion]);

  const submitForEvaluation = useCallback(async () => {
    recognition.stop();
    setPhase("evaluating");

    const parts = [
      { part: "PART_1", text: transcriptLog.filter((t) => t.speaker === "student" && t.part === "PART_1").map((t) => t.text).join(" ") },
      { part: "PART_2", text: transcriptLog.filter((t) => t.speaker === "student" && t.part === "PART_2").map((t) => t.text).join(" ") },
      { part: "PART_3", text: transcriptLog.filter((t) => t.speaker === "student" && t.part === "PART_3").map((t) => t.text).join(" ") },
    ].filter((p) => p.text.trim());

    try {
      const res = await fetch("/api/ai/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcripts: parts,
          topic: CUE_CARD.topic,
          totalDurationSecs: Math.floor((Date.now() - startTimeRef.current) / 1000),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setEvaluation(data.evaluation);
      } else {
        const errData = await res.json().catch(() => ({}));
        setEvalError(errData.error ?? "Evaluation failed");
      }
    } catch (err) {
      setEvalError(err instanceof Error ? err.message : "Network error");
    }
    setPhase("results");
  }, [recognition, transcriptLog]);

  useEffect(() => { submitRef.current = submitForEvaluation; }, [submitForEvaluation]);

  // === READY SCREEN ===
  if (phase === "ready") {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="max-w-lg w-full rounded-2xl border bg-card p-8 shadow-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-purple/10">
            <Mic className="h-8 w-8 text-brand-purple" />
          </div>
          <h1 className="text-2xl font-bold">AI Speaking Mock Test</h1>
          <p className="mt-2 text-muted-foreground">Simulates a real IELTS speaking exam with an AI examiner.</p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-left">
            {[
              { label: "Part 1", desc: "Personal questions", time: "4-5 min" },
              { label: "Part 2", desc: "Cue card + speak", time: "3-4 min" },
              { label: "Part 3", desc: "Discussion", time: "4-5 min" },
            ].map((p) => (
              <div key={p.label} className="rounded-lg border p-3">
                <div className="text-xs font-semibold text-brand-purple">{p.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
                <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><Clock className="h-3 w-3" />{p.time}</div>
              </div>
            ))}
          </div>
          {!recognition.isSupported && (
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
              Your browser does not support Speech Recognition. Please use Chrome or Edge.
            </div>
          )}
          <button onClick={handleStartTest} disabled={!recognition.isSupported}
            className="mt-6 w-full rounded-xl bg-brand-purple px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand-purple-dark disabled:opacity-50">
            Begin Speaking Test
          </button>
        </div>
      </div>
    );
  }

  // === RESULTS SCREEN ===
  if (phase === "results") {
    const ev = evaluation;
    return (
      <div className="min-h-screen bg-muted/30 p-4 md:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-2xl border bg-card p-8 text-center shadow-lg">
            {ev ? (
              <>
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-3" />
                <h1 className="text-2xl font-bold">Speaking Evaluation Complete</h1>
                <div className="mt-4 text-5xl font-extrabold text-brand-purple">{ev.overallBand}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1">Predicted Band Score</div>
              </>
            ) : (
              <>
                <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-3" />
                <h1 className="text-2xl font-bold">Evaluation Issue</h1>
                <p className="mt-2 text-muted-foreground text-sm">{evalError ?? "Could not evaluate"}</p>
              </>
            )}
          </div>

          {ev && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Fluency & Coherence", score: ev.fluencyCoherence },
                  { label: "Lexical Resource", score: ev.lexicalResource },
                  { label: "Grammar", score: ev.grammaticalRange },
                  { label: "Pronunciation", score: ev.pronunciation },
                ].map((c) => (
                  <div key={c.label} className="rounded-xl border bg-card p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-brand-purple">{c.score}</div>
                    <div className="text-[11px] text-muted-foreground mt-1 leading-tight">{c.label}</div>
                  </div>
                ))}
              </div>

              {ev.suggestedStrategy && (
                <div className="rounded-xl border bg-brand-purple/5 p-5">
                  <h3 className="text-sm font-semibold text-brand-purple mb-2">Suggested Strategy</h3>
                  <p className="text-sm text-foreground leading-relaxed">{ev.suggestedStrategy}</p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { title: "Pronunciation", items: ev.pronunciationFeedback, color: "text-blue-700" },
                  { title: "Vocabulary", items: ev.vocabularyFeedback, color: "text-emerald-700" },
                  { title: "Grammar", items: ev.grammarFeedback, color: "text-amber-700" },
                ].map((section) => (
                  <div key={section.title} className="rounded-xl border bg-card p-4 shadow-sm">
                    <h4 className={`text-sm font-semibold ${section.color} mb-2`}>{section.title} Feedback</h4>
                    <ul className="space-y-1.5">
                      {(section.items ?? []).map((item, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5 text-brand-teal" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {ev.fillerWordAnalysis?.length > 0 && (
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                  <h4 className="text-sm font-semibold mb-2">Filler Word Analysis</h4>
                  <div className="flex flex-wrap gap-2">
                    {ev.fillerWordAnalysis.map((f) => (
                      <span key={f.word} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        &quot;{f.word}&quot; x{f.count}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Transcript log */}
              <details className="rounded-xl border bg-card shadow-sm">
                <summary className="cursor-pointer px-5 py-4 text-sm font-semibold flex items-center gap-2 hover:bg-muted/50">
                  <MessageSquare className="h-4 w-4 text-brand-purple" /> View Full Transcript
                </summary>
                <div className="border-t px-5 py-4 space-y-3 max-h-96 overflow-y-auto">
                  {transcriptLog.map((entry, i) => (
                    <div key={i} className={`flex gap-3 ${entry.speaker === "examiner" ? "" : "flex-row-reverse"}`}>
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold ${entry.speaker === "examiner" ? "bg-brand-purple" : "bg-brand-teal"}`}>
                        {entry.speaker === "examiner" ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                      </div>
                      <div className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${entry.speaker === "examiner" ? "bg-muted" : "bg-brand-purple/10"}`}>
                        {entry.text}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </>
          )}

          <div className="flex gap-3 justify-center">
            <Link href="/test-engine/speaking" className="rounded-xl bg-brand-purple px-6 py-3 text-sm font-semibold text-white hover:bg-brand-purple-dark">Try Again</Link>
            <Link href="/dashboard/student/overview" className="rounded-xl border px-6 py-3 text-sm font-semibold hover:bg-muted">Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  // === ACTIVE TEST UI ===
  const currentPart = phase === "part1" ? "Part 1" : phase.startsWith("part2") ? "Part 2" : "Part 3";
  const currentPartDesc = phase === "part1" ? "Personal Questions" : phase === "part2_prep" ? "Preparation Time" : phase === "part2_speak" ? "Cue Card Response" : "Discussion";

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-brand-purple" />
            <span className="text-sm font-semibold">IELTS Speaking — {currentPart}: {currentPartDesc}</span>
          </div>
          <div className="flex items-center gap-3">
            {recognition.isListening && (
              <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Recording
              </span>
            )}
            {tts.isSpeaking && (
              <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                <Volume2 className="h-3 w-3" /> Examiner speaking
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-4 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main area */}
          <div className="space-y-4">
            {/* Cue card for Part 2 */}
            {(phase === "part2_prep" || phase === "part2_speak") && (
              <div className="rounded-xl border-2 border-brand-purple/30 bg-brand-purple/5 p-6">
                <h3 className="text-sm font-bold text-brand-purple mb-2">{CUE_CARD.topic}</h3>
                <p className="text-xs text-muted-foreground mb-3">You should say:</p>
                <ul className="space-y-1.5">
                  {CUE_CARD.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm"><span className="text-brand-purple font-bold">•</span>{b}</li>
                  ))}
                </ul>
                {phase === "part2_prep" && (
                  <div className="mt-4 text-center">
                    <div className="text-3xl font-mono font-bold text-brand-purple">{part2PrepTimer.formatted}</div>
                    <div className="text-xs text-muted-foreground">Preparation time remaining</div>
                    <button onClick={startPart2Speaking} className="mt-3 rounded-lg bg-brand-teal px-4 py-2 text-xs font-semibold text-white hover:bg-brand-teal-dark">
                      Start Speaking Early
                    </button>
                  </div>
                )}
                {phase === "part2_speak" && (
                  <div className="mt-4 text-center">
                    <div className="text-3xl font-mono font-bold text-brand-purple">{part2SpeakTimer.formatted}</div>
                    <div className="text-xs text-muted-foreground">Speaking time remaining</div>
                  </div>
                )}
              </div>
            )}

            {/* Transcript */}
            <div className="rounded-xl border bg-card shadow-sm">
              <div className="border-b px-4 py-3">
                <h4 className="text-sm font-semibold">Live Transcript</h4>
              </div>
              <div className="p-4 space-y-3 min-h-[300px] max-h-[500px] overflow-y-auto">
                {transcriptLog.map((entry, i) => (
                  <div key={i} className={`flex gap-3 ${entry.speaker === "examiner" ? "" : "flex-row-reverse"}`}>
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold ${entry.speaker === "examiner" ? "bg-brand-purple" : "bg-brand-teal"}`}>
                      {entry.speaker === "examiner" ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                    </div>
                    <div className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${entry.speaker === "examiner" ? "bg-muted" : "bg-brand-teal/10"}`}>
                      {entry.text}
                    </div>
                  </div>
                ))}
                {recognition.interimTranscript && (
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-teal text-white"><User className="h-3.5 w-3.5" /></div>
                    <div className="rounded-lg px-3 py-2 text-sm max-w-[80%] bg-brand-teal/10 italic text-muted-foreground">{recognition.interimTranscript}</div>
                  </div>
                )}
                <div ref={transcriptEndRef} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Mic controls */}
            <div className="rounded-xl border bg-card p-5 shadow-sm text-center">
              <div className={`mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full transition-all ${recognition.isListening ? "bg-red-100 ring-4 ring-red-200 animate-pulse" : "bg-muted"}`}>
                {recognition.isListening ? <Mic className="h-8 w-8 text-red-600" /> : <MicOff className="h-8 w-8 text-muted-foreground" />}
              </div>
              {(phase === "part1" || phase === "part3") && (
                <button onClick={handleStudentFinishAnswer} disabled={!recognition.isListening}
                  className="w-full rounded-lg bg-brand-teal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-dark disabled:opacity-50">
                  <ArrowRight className="h-4 w-4 inline mr-1" /> Next Question
                </button>
              )}
              {phase === "part2_speak" && (
                <button onClick={finishPart2}
                  className="w-full rounded-lg bg-brand-teal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-dark">
                  <Square className="h-4 w-4 inline mr-1" /> Finish Speaking
                </button>
              )}
            </div>

            {/* Progress */}
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <h4 className="text-sm font-semibold mb-3">Test Progress</h4>
              {[
                { label: "Part 1", active: phase === "part1", done: ["part2_prep", "part2_speak", "part3", "evaluating"].includes(phase) },
                { label: "Part 2", active: phase.startsWith("part2"), done: ["part3", "evaluating"].includes(phase) },
                { label: "Part 3", active: phase === "part3", done: phase === "evaluating" },
              ].map((p) => (
                <div key={p.label} className={`flex items-center gap-2 rounded-lg px-3 py-2 mb-1 text-sm ${p.active ? "bg-brand-purple/10 text-brand-purple font-semibold" : p.done ? "text-green-600" : "text-muted-foreground"}`}>
                  {p.done ? <CheckCircle2 className="h-4 w-4" /> : p.active ? <Play className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  {p.label}
                </div>
              ))}
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <h4 className="text-sm font-semibold mb-2">Tips</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>• Speak clearly and at a natural pace</li>
                <li>• Extend your answers with examples</li>
                <li>• Use a range of vocabulary</li>
                <li>• Don&apos;t worry about small mistakes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluating overlay */}
      {phase === "evaluating" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl bg-card p-8 text-center shadow-2xl">
            <Loader2 className="mx-auto h-10 w-10 text-brand-purple animate-spin mb-4" />
            <h2 className="text-lg font-bold">Evaluating Your Speaking...</h2>
            <p className="mt-2 text-sm text-muted-foreground">Our AI examiner is analyzing your performance.</p>
          </div>
        </div>
      )}
    </div>
  );
}
