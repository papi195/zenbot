import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  Leaf,
  LockKeyhole,
  MessageCircle,
  Mic,
  ShieldCheck,
  Sparkle,
} from 'lucide-react';
import LandingScrollEffects from './LandingScrollEffects';

const proofPoints = [
  { value: '24/7', label: 'Private support between classes' },
  { value: '4 min', label: 'Typical daily reflection' },
  { value: 'MANI', label: 'Nigeria crisis resource surfaced when needed' },
];

const supportTools = [
  {
    icon: MessageCircle,
    title: 'Talk through the messy part',
    description:
      'Start with one sentence. ZenBot helps you name what is happening and choose a next step.',
  },
  {
    icon: CalendarCheck,
    title: 'See your week clearly',
    description:
      'Daily check-ins turn scattered feelings into a pattern you can actually reflect on.',
  },
  {
    icon: BookOpen,
    title: 'Find grounded resources',
    description:
      'Open student-friendly guides, Nigeria-focused support, and crisis contacts without searching alone.',
  },
  {
    icon: ShieldCheck,
    title: 'Built with safety rails',
    description:
      'Sensitive moments are handled carefully, with clear reminders that urgent support belongs with people.',
  },
];

const checkInRows = [
  { day: 'Mon', mood: 'Steady', tone: 72 },
  { day: 'Tue', mood: 'Heavy', tone: 38 },
  { day: 'Wed', mood: 'Clearer', tone: 64 },
  { day: 'Thu', mood: 'Anxious', tone: 45 },
  { day: 'Fri', mood: 'Present', tone: 78 },
];

export default function LandingPage() {
  return (
    <main className="landing-page">
      <LandingScrollEffects />
      <header className="landing-nav">
        <Link href="/" className="landing-logo" aria-label="ZenBot home">
          <span className="landing-logo-mark">
            <Leaf size={18} strokeWidth={2} />
          </span>
          <span>ZenBot</span>
        </Link>

        <nav className="landing-nav-links" aria-label="Primary navigation">
          <Link href="/resources">Resources</Link>
          <Link href="/auth">Sign in</Link>
          <Link href="/auth" className="landing-nav-cta">
            Start
            <ChevronRight size={15} strokeWidth={2} />
          </Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-grid">
          <div className="landing-hero-copy">
            <span className="landing-kicker">
              <Sparkle size={15} strokeWidth={1.8} />
              Student mental wellness companion
            </span>
            <h1>ZenBot for quiet student support.</h1>
            <p className="landing-hero-lead">
              A calm private space to check in, talk through pressure, and find support resources
              without turning one hard moment into a whole research project.
            </p>

            <div className="landing-hero-actions">
              <Link href="/auth" className="landing-btn landing-btn-primary">
                Get started free
                <ArrowRight size={17} strokeWidth={2} />
              </Link>
              <Link href="/resources" className="landing-btn landing-btn-secondary">
                View support resources
              </Link>
            </div>

            <div className="landing-assurance">
              <span>
                <LockKeyhole size={15} strokeWidth={2} />
                Account-based private chat history
              </span>
              <span>
                <HeartPulse size={15} strokeWidth={2} />
                Not a replacement for therapy
              </span>
            </div>
          </div>

          <div className="landing-product-stage" aria-label="ZenBot product preview">
            <div className="landing-orbit landing-orbit-one" />
            <div className="landing-orbit landing-orbit-two" />

            <div className="landing-chat-panel">
              <div className="landing-panel-topbar">
                <div>
                  <p>Live reflection</p>
                  <span>Friday check-in</span>
                </div>
                <span className="landing-status-pill">
                  <span />
                  Ready
                </span>
              </div>

              <div className="landing-chat-feed">
                <div className="landing-message landing-message-bot">
                  <p>
                    Before we solve anything, let us slow the moment down. What is taking the
                    most space in your head right now?
                  </p>
                </div>
                <div className="landing-message landing-message-user">
                  <p>I keep thinking I am falling behind, even when I study.</p>
                </div>
                <div className="landing-message landing-message-bot landing-message-active">
                  <p>
                    That sounds exhausting. We can sort the facts from the fear, then pick one
                    small action for today.
                  </p>
                </div>
              </div>

              <div className="landing-input-preview">
                <span>Type what happened today</span>
                <button type="button" aria-label="Voice input preview">
                  <Mic size={16} strokeWidth={2} />
                </button>
              </div>
            </div>

            <div className="landing-checkin-panel">
              <div className="landing-mini-heading">
                <CalendarCheck size={16} strokeWidth={2} />
                <span>Mood week</span>
              </div>
              <div className="landing-mood-list">
                {checkInRows.map((row) => (
                  <div className="landing-mood-row" key={row.day}>
                    <span>{row.day}</span>
                    <div className="landing-mood-track">
                      <i style={{ width: `${row.tone}%` }} />
                    </div>
                    <strong>{row.mood}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-proof" aria-label="ZenBot highlights" data-scroll="up">
        <div className="landing-proof-inner">
          {proofPoints.map((point, index) => (
            <div
              className="landing-proof-item"
              key={point.value}
              style={{ '--reveal-index': index } as React.CSSProperties}
              data-scroll="up"
            >
              <strong>{point.value}</strong>
              <span>{point.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section landing-tools-section">
        <div className="landing-section-intro" data-scroll="left">
          <span className="landing-section-label">What it helps with</span>
          <h2>Support that stays practical.</h2>
          <p>
            ZenBot keeps the experience focused: a conversation, a pattern, a resource, or a
            safety nudge when the situation needs more than an AI reply.
          </p>
        </div>

        <div className="landing-tools-grid">
          {supportTools.map(({ icon: Icon, title, description }, index) => (
            <article
              className="landing-tool"
              key={title}
              style={{ '--reveal-index': index, '--tool-index': index } as React.CSSProperties}
              data-scroll={index % 2 === 0 ? 'up' : 'right'}
            >
              <div className="landing-tool-icon">
                <Icon size={20} strokeWidth={1.9} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-safety-band" data-scroll="scale">
        <div className="landing-safety-copy" data-scroll="left">
          <span className="landing-section-label">Crisis-aware by design</span>
          <h2>Clear boundaries are part of the care.</h2>
          <p>
            ZenBot can listen and guide reflection, but it keeps urgent moments pointed toward
            real human support. In Nigeria, it highlights MANI at <strong>0800-1000-6464</strong>.
          </p>
        </div>
        <div className="landing-safety-list">
          <span style={{ '--reveal-index': 0 } as React.CSSProperties} data-scroll="right">
            <CheckCircle2 size={17} strokeWidth={2} />
            Encourages professional help in crisis situations
          </span>
          <span style={{ '--reveal-index': 1 } as React.CSSProperties} data-scroll="right">
            <CheckCircle2 size={17} strokeWidth={2} />
            Keeps supportive language gentle and direct
          </span>
          <span style={{ '--reveal-index': 2 } as React.CSSProperties} data-scroll="right">
            <CheckCircle2 size={17} strokeWidth={2} />
            Pairs chat with resources students can revisit
          </span>
        </div>
      </section>

      <section className="landing-final-cta" data-scroll="left">
        <div>
          <span className="landing-section-label">Begin quietly</span>
          <h2>Open a private space for the next honest sentence.</h2>
        </div>
        <Link href="/auth" className="landing-btn landing-btn-primary">
          Create your account
          <ArrowRight size={17} strokeWidth={2} />
        </Link>
      </section>

      <footer className="landing-footer" data-scroll="up">
        <div className="landing-footer-brand">
          <Leaf size={16} strokeWidth={2} />
          <span>ZenBot</span>
        </div>
        <p>Supportive AI for students. Not medical care, diagnosis, or emergency response.</p>
        <div className="landing-footer-links">
          <Link href="/resources">Resources</Link>
          <Link href="/auth">Sign in</Link>
        </div>
      </footer>
    </main>
  );
}
