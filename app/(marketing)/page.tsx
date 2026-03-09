import Link from "next/link";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  GraduationCap,
  Clock,
  BarChart3,
  Brain,
  CheckCircle2,
  Star,
  ArrowRight,
  Users,
  Award,
  Shield,
  Zap,
  Target,
  TrendingUp,
  MessageSquare,
  Globe,
  Sparkles,
  Check,
  ChevronRight,
  Play,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IELTS Flow - AI-Powered IELTS Mock Test Platform",
  description:
    "Practice IELTS Reading, Listening, Writing, and Speaking with AI-predicted band scores. Take full mock tests and track your progress.",
};

/* ============================================================
   HERO SECTION
   ============================================================ */
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-purple-dark via-brand-purple to-brand-purple-light">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-brand-teal/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur">
            <Sparkles className="h-4 w-4 text-brand-teal-light" />
            AI-Powered IELTS Preparation
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            FREE IELTS PREPARATION WITH{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-brand-teal-light to-brand-cyan bg-clip-text text-transparent">
                MOCK TEST IELTS
              </span>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            Practice all 4 IELTS skills with AI-predicted band scores, real exam simulations, and
            personalized feedback. Start your journey to your target band today.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-teal px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-teal/30 transition-all hover:bg-brand-teal-dark hover:shadow-xl hover:shadow-brand-teal/40 hover:-translate-y-0.5"
            >
              Start Free Mock Test
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/20 hover:-translate-y-0.5"
            >
              <Play className="h-5 w-5" />
              Watch Demo
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "50K+", label: "Students" },
              { value: "10K+", label: "Mock Tests Taken" },
              { value: "Band 7+", label: "Avg. Score Gain" },
              { value: "4.9/5", label: "Student Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 80V40C240 0 480 0 720 40C960 80 1200 80 1440 40V80H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}

/* ============================================================
   PRACTICE ALL 4 SKILLS
   ============================================================ */
function PracticeSkillsSection() {
  const skills = [
    {
      icon: Headphones,
      title: "Listening",
      color: "bg-blue-50 text-blue-600 border-blue-100",
      iconBg: "bg-blue-100",
      description:
        "Practice with real IELTS-style audio sections. Auto-scored with band mapping.",
      href: "/test-engine/listening",
      features: ["4 sections, 40 questions", "Audio playback controls", "Auto band calculation"],
    },
    {
      icon: BookOpen,
      title: "Reading",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      iconBg: "bg-emerald-100",
      description:
        "Academic & General passages with all official question types. Timed and scored.",
      href: "/test-engine/reading",
      features: ["3 passages, 40 questions", "Highlight & note tools", "Answer explanations"],
    },
    {
      icon: PenLine,
      title: "Writing",
      color: "bg-amber-50 text-amber-600 border-amber-100",
      iconBg: "bg-amber-100",
      description:
        "Task 1 & Task 2 with AI evaluation on all 4 IELTS criteria. Get detailed feedback.",
      href: "/test-engine/writing",
      features: ["Task 1 & Task 2", "AI band prediction", "Sentence-level corrections"],
    },
    {
      icon: Mic,
      title: "Speaking",
      color: "bg-rose-50 text-rose-600 border-rose-100",
      iconBg: "bg-rose-100",
      description:
        "AI interviewer simulates all 3 parts. Voice recording with pronunciation feedback.",
      href: "/test-engine/speaking",
      features: ["Parts 1, 2 & 3", "AI or live instructor", "Filler word analysis"],
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Practice All 4 Skills
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to prepare for the IELTS exam, all in one platform.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill) => (
            <Link
              key={skill.title}
              href={skill.href}
              className="group relative rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${skill.iconBg}`}>
                <skill.icon className={`h-6 w-6 ${skill.color.split(" ")[1]}`} />
              </div>
              <h3 className="text-lg font-semibold">{skill.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {skill.description}
              </p>
              <ul className="mt-4 space-y-1.5">
                {skill.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-brand-teal shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-purple group-hover:gap-2 transition-all">
                Start Practice <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TAKE AN IELTS TEST ONLINE NOW
   ============================================================ */
function MockTestSection() {
  const tests = [
    {
      title: "Academic IELTS Mock",
      description: "Full 4-module timed test with AI scoring. Simulates exact exam conditions.",
      duration: "2h 45m",
      questions: "Full Test",
      difficulty: "All Levels",
    },
    {
      title: "General Training Mock",
      description: "Complete General Training mock with real-style passages and AI evaluation.",
      duration: "2h 45m",
      questions: "Full Test",
      difficulty: "All Levels",
    },
    {
      title: "Quick Practice Test",
      description: "Pick any single module for focused practice. Instant AI feedback.",
      duration: "30-60m",
      questions: "1 Module",
      difficulty: "Customizable",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-teal-dark via-brand-teal to-brand-cyan py-20 md:py-28">
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-brand-purple/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Take an IELTS Test Online Now
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Elevate your IELTS preparation with realistic mock tests and instant AI-powered results.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <div
              key={test.title}
              className="group rounded-xl bg-white/10 p-6 backdrop-blur border border-white/15 transition-all hover:bg-white/20 hover:-translate-y-1"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">{test.title}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{test.description}</p>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Duration", value: test.duration },
                  { label: "Scope", value: test.questions },
                  { label: "Level", value: test.difficulty },
                ].map((meta) => (
                  <div key={meta.label}>
                    <div className="text-sm font-semibold text-white">{meta.value}</div>
                    <div className="text-xs text-white/50">{meta.label}</div>
                  </div>
                ))}
              </div>

              <Link
                href="/register"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-brand-teal-dark transition-colors hover:bg-white/90"
              >
                Start Test <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   MODULE / BAND SCORE CALCULATOR
   ============================================================ */
function BandCalculatorSection() {
  const features = [
    {
      icon: BarChart3,
      title: "AI Band Score Prediction",
      description: "Get predicted band scores for Writing and Speaking using IELTS rubrics.",
    },
    {
      icon: Target,
      title: "Per-Criterion Breakdown",
      description:
        "See scores for each criterion: Task Achievement, Coherence, Lexical Resource, Grammar.",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Track your band score improvement over time with visual charts.",
    },
    {
      icon: Brain,
      title: "Weakness Analysis",
      description: "AI identifies your weak areas and suggests focused practice.",
    },
    {
      icon: MessageSquare,
      title: "Detailed Feedback",
      description:
        "Sentence-level corrections, vocabulary suggestions, and sample rewrites.",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get your evaluation within seconds of submitting, not days.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Left: Info */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-purple/10 px-4 py-1.5 text-sm font-medium text-brand-purple mb-6">
              <BarChart3 className="h-4 w-4" />
              Module Score Calculator
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Understand Your Band Score Like Never Before
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Our AI evaluation engine analyzes your answers against official IELTS scoring
              criteria to give you transparent, rubric-based predicted band scores.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Predicted practice band scores (not official IELTS scores)",
                "Transparent rubric-based evaluation",
                "Compare your scores with AI and instructor feedback",
                "Personalized study plan based on your weaknesses",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-teal shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-purple px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-purple-dark hover:-translate-y-0.5"
            >
              Try Band Calculator <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right: Feature grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-purple/10">
                  <feature.icon className="h-5 w-5 text-brand-purple" />
                </div>
                <h4 className="font-semibold text-sm">{feature.title}</h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   MEET OUR IELTS EXPERTS
   ============================================================ */
function ExpertsSection() {
  const experts = [
    {
      name: "Sarah Mitchell",
      role: "IELTS Speaking Examiner",
      experience: "12+ years experience",
      rating: 4.9,
      sessions: 2500,
    },
    {
      name: "David Chen",
      role: "Academic Writing Specialist",
      experience: "10+ years experience",
      rating: 4.8,
      sessions: 1800,
    },
    {
      name: "Priya Sharma",
      role: "Listening & Reading Expert",
      experience: "8+ years experience",
      rating: 4.9,
      sessions: 2200,
    },
    {
      name: "James Wilson",
      role: "General Training Coach",
      experience: "15+ years experience",
      rating: 5.0,
      sessions: 3000,
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Meet Our IELTS Experts
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Book live speaking sessions with certified IELTS instructors and get professional feedback.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {experts.map((expert) => (
            <div
              key={expert.name}
              className="group rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-purple-light text-white text-2xl font-bold">
                {expert.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="font-semibold">{expert.name}</h3>
              <p className="mt-1 text-sm text-brand-purple font-medium">{expert.role}</p>
              <p className="mt-1 text-xs text-muted-foreground">{expert.experience}</p>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {expert.rating}
                </span>
                <span>{expert.sessions.toLocaleString()} sessions</span>
              </div>

              <Link
                href="/register"
                className="mt-5 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-brand-purple/20 bg-brand-purple/5 px-4 py-2 text-sm font-medium text-brand-purple transition-colors hover:bg-brand-purple hover:text-white"
              >
                Book Session
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ESTABLISHED CREDENTIALS / TRUST
   ============================================================ */
function TrustSection() {
  const credentials = [
    { icon: Shield, text: "Aligned with official IELTS scoring rubrics and test format" },
    { icon: Award, text: "AI evaluation powered by Google Gemini for accurate band predictions" },
    { icon: Users, text: "Trusted by 50,000+ students from 120+ countries worldwide" },
    { icon: CheckCircle2, text: "Certified IELTS instructors with 10+ years average experience" },
    { icon: Globe, text: "Accessible 24/7 from any device, anywhere in the world" },
    { icon: Star, text: "4.9/5 average rating from verified student reviews" },
  ];

  return (
    <section className="py-20 md:py-28 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Established Credentials You Can Trust
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              IELTS Flow is built by IELTS experts and AI engineers to give you the most realistic
              and effective preparation experience available online.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {credentials.map((cred) => (
              <div key={cred.text} className="flex items-start gap-3 rounded-lg bg-card border p-4">
                <cred.icon className="h-5 w-5 text-brand-teal shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">{cred.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   IMPORTANT TOPICS
   ============================================================ */
function TopicsSection() {
  const topics = [
    "Education", "Environment", "Health & Medicine", "Technology",
    "Urbanization", "Globalization", "Crime & Punishment", "Arts & Culture",
    "Government & Society", "Work & Employment", "Transport", "Tourism & Travel",
    "Food & Diet", "Family & Children", "Media & Advertising", "Space Exploration",
    "Animal Rights", "Climate Change", "Social Media", "Sports & Fitness",
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Important Topics</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Practice with the most commonly tested IELTS topics across all modules.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {topics.map((topic) => (
            <Link
              key={topic}
              href={`/free-demo?topic=${encodeURIComponent(topic)}`}
              className="rounded-full border bg-card px-5 py-2.5 text-sm font-medium shadow-sm transition-all hover:border-brand-purple/30 hover:bg-brand-purple/5 hover:text-brand-purple hover:shadow-md hover:-translate-y-0.5"
            >
              {topic}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SEE OUR PACKAGES / PRICING PREVIEW
   ============================================================ */
function PricingPreviewSection() {
  const plans = [
    {
      name: "Free",
      price: "0",
      period: "forever",
      description: "Get started with basic practice tests.",
      features: [
        "2 practice tests per module",
        "Basic AI evaluation",
        "Band score overview",
        "Community support",
      ],
      cta: "Start Free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "19",
      period: "month",
      description: "Full access for serious IELTS preparation.",
      features: [
        "Unlimited practice tests",
        "Full AI evaluation with feedback",
        "Detailed per-criterion scores",
        "Progress tracking & analytics",
        "Writing sample rewrites",
        "AI speaking interviews",
      ],
      cta: "Start Pro Trial",
      highlighted: true,
    },
    {
      name: "Premium",
      price: "39",
      period: "month",
      description: "Everything in Pro plus live instructor sessions.",
      features: [
        "Everything in Pro",
        "4 live speaking sessions/month",
        "Instructor vs AI score comparison",
        "Priority support",
        "Personalized study plan",
        "Full mock test simulations",
      ],
      cta: "Go Premium",
      highlighted: false,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-purple-dark via-brand-purple to-brand-purple-light py-20 md:py-28">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-brand-teal/10 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            See Our Packages
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Choose the plan that fits your IELTS preparation needs.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-7 transition-all hover:-translate-y-1 ${
                plan.highlighted
                  ? "bg-white shadow-2xl shadow-black/20 ring-2 ring-brand-teal scale-[1.02]"
                  : "bg-white/10 backdrop-blur border border-white/15"
              }`}
            >
              {plan.highlighted && (
                <div className="mb-4 inline-flex rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold text-brand-teal">
                  Most Popular
                </div>
              )}
              <h3
                className={`text-xl font-bold ${plan.highlighted ? "text-foreground" : "text-white"}`}
              >
                {plan.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span
                  className={`text-4xl font-extrabold ${plan.highlighted ? "text-foreground" : "text-white"}`}
                >
                  ${plan.price}
                </span>
                <span
                  className={`text-sm ${plan.highlighted ? "text-muted-foreground" : "text-white/60"}`}
                >
                  /{plan.period}
                </span>
              </div>
              <p
                className={`mt-3 text-sm leading-relaxed ${
                  plan.highlighted ? "text-muted-foreground" : "text-white/70"
                }`}
              >
                {plan.description}
              </p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      className={`h-4 w-4 shrink-0 mt-0.5 ${
                        plan.highlighted ? "text-brand-teal" : "text-brand-teal-light"
                      }`}
                    />
                    <span
                      className={`text-sm ${plan.highlighted ? "text-muted-foreground" : "text-white/80"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                  plan.highlighted
                    ? "bg-brand-purple text-white shadow-md hover:bg-brand-purple-dark"
                    : "bg-white/20 text-white border border-white/20 hover:bg-white/30"
                }`}
              >
                {plan.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   READY? CTA SECTION
   ============================================================ */
function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-purple-dark via-brand-purple to-brand-teal px-8 py-16 text-center shadow-2xl sm:px-16 md:py-20">
          <div className="absolute inset-0">
            <div className="absolute -top-10 -right-10 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Ready?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              Join thousands of students who improved their IELTS score with IELTS Flow.
              Start your free practice today.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-brand-purple shadow-lg transition-all hover:bg-white/90 hover:-translate-y-0.5"
              >
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10 hover:-translate-y-0.5"
              >
                View All Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PAGE COMPOSITION
   ============================================================ */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PracticeSkillsSection />
      <MockTestSection />
      <BandCalculatorSection />
      <ExpertsSection />
      <TrustSection />
      <TopicsSection />
      <PricingPreviewSection />
      <CTASection />
    </>
  );
}
