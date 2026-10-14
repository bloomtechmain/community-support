import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { FaSearch, FaPen, FaCheck, FaArrowRight } from 'react-icons/fa';
import { SearchDemo, AskDemo, AnswerDemo } from './StepDemos';
import { fadeUp, inView, stagger } from '../../motion';

const STEPS = [
  {
    key: 'search',
    icon: FaSearch,
    label: 'Search first',
    title: 'Someone may already have asked',
    desc: 'Search the forum for a question like yours, or look for a guide in the Knowledge Base. Results match words in the title and the details.',
    link: { to: '/community', label: 'Search the forum' },
    Demo: SearchDemo,
  },
  {
    key: 'ask',
    icon: FaPen,
    label: 'Ask your question',
    title: 'Ask it in your own words',
    desc: 'Give it a clear title, then the details: which screen you were on, what you clicked, and what happened instead. No account needed.',
    link: { to: '/community?ask=1', label: 'Ask a question' },
    Demo: AskDemo,
  },
  {
    key: 'answer',
    icon: FaCheck,
    label: 'Get an answer',
    title: 'Other users reply in the thread',
    desc: 'Replies collect under your question. Keep the link and come back to it to read new ones, or add a reply yourself to follow up.',
    Demo: AnswerDemo,
  },
];

const STEP_MS = 6500;
const TICK = 50;

const chevronFirst = 'polygon(0 0, calc(100% - 26px) 0, 100% 50%, calc(100% - 26px) 100%, 0 100%)';
const chevronNext = 'polygon(0 0, calc(100% - 26px) 0, 100% 50%, calc(100% - 26px) 100%, 0 100%, 26px 50%)';

// The three steps as a row of filled chevrons (same pattern as the website's
// product showcase). The active step is teal with a progress fill; it advances
// by itself, pauses while the pointer is over the section, and only runs while
// the section is on screen.
const HowItWorks = () => {
  const ref = useRef(null);
  const visible = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);

  const running = visible && !paused && !reduced;

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setElapsed((e) => e + TICK), TICK);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (elapsed >= STEP_MS) {
      setIndex((i) => (i + 1) % STEPS.length);
      setElapsed(0);
    }
  }, [elapsed]);

  const select = (i) => {
    setIndex(i);
    setElapsed(0);
  };

  const step = STEPS[index];

  return (
    <section className="relative bg-gray-50 py-20 overflow-hidden">
      <div aria-hidden="true" className="hidden lg:block absolute -bottom-56 -left-56 w-[560px] h-[560px] rounded-full bg-bloom-navy/5 pointer-events-none" />

      <div className="relative w-full px-4 sm:px-8 lg:px-12">
        <motion.div variants={stagger(0.1)} {...inView} className="max-w-3xl mb-12">
          <motion.p variants={fadeUp} className="text-bloom-teal-deep font-bold tracking-widest text-sm uppercase mb-2 flex items-center gap-2">
            <span className="w-6 h-px bg-bloom-teal-deep" /> How it works
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-bloom-navy leading-tight">
            Stuck on something?
          </motion.h2>
        </motion.div>

        <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {/* Step picker: chevrons on desktop, three filled tabs on mobile */}
          <div className="grid grid-cols-3 gap-2 lg:flex lg:gap-0" role="tablist" aria-label="Steps">
            {STEPS.map((s, i) => {
              const active = i === index;
              return (
                <button
                  key={s.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => select(i)}
                  className={`relative overflow-hidden lg:flex-1 h-20 lg:h-24 flex flex-col lg:flex-row items-start lg:items-center justify-center lg:justify-start gap-1 lg:gap-4 text-left text-white rounded-xl lg:rounded-none lg:[clip-path:var(--chevron)] transition-colors duration-300 px-3 sm:px-5 ${i > 0 ? 'lg:-ml-4 lg:pl-12 lg:pr-8' : 'lg:pl-7 lg:pr-8 lg:rounded-l-2xl'} ${active ? 'bg-bloom-teal' : 'bg-bloom-navy hover:bg-bloom-navy-deep'}`}
                  style={{ '--chevron': i === 0 ? chevronFirst : chevronNext }}
                >
                  <s.icon className={`hidden lg:block text-2xl flex-shrink-0 ${active ? 'text-white' : 'text-bloom-teal'}`} />
                  <span>
                    <span className={`block font-mono text-xs font-bold ${active ? 'text-white/80' : 'text-bloom-teal'}`}>Step {i + 1}</span>
                    <span className="block text-sm sm:text-lg font-extrabold leading-tight">{s.label}</span>
                  </span>
                  {active && !reduced && (
                    <span className="absolute left-0 bottom-0 h-1 bg-white/50" style={{ width: `${(elapsed / STEP_MS) * 100}%` }} />
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 items-center mt-10 pt-10 border-t border-gray-200">
            <div className="lg:col-span-5 lg:pr-16 min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <span className="font-mono text-sm font-bold text-bloom-teal-deep">0{index + 1} / 0{STEPS.length}</span>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-bloom-navy leading-tight mt-2 mb-4">{step.title}</h3>
                  <p className="text-lg text-gray-800 leading-relaxed mb-6">{step.desc}</p>
                  {step.link && (
                    <Link to={step.link.to} className="group text-bloom-teal-deep font-bold inline-flex items-center gap-2">
                      {step.link.label} <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* The example, on a navy panel like the website's hero */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-3xl bg-bloom-navy p-6 sm:p-10 min-h-[360px]">
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
                />
                <div aria-hidden="true" className="absolute -bottom-40 -right-32 w-[420px] h-[420px] rounded-full bg-white/5 pointer-events-none" />
                <p className="relative text-[11px] font-bold uppercase tracking-wider text-blue-100 mb-5">Example</p>
                <div className="relative">
                  <step.Demo key={step.key} playing={visible} reduced={reduced} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
