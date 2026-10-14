import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaCheck, FaBook, FaComments } from 'react-icons/fa';

// Small illustrations for the "How it works" steps, drawn from shapes rather
// than screenshots. Each one is driven by a clock that only ticks while the
// demo is playing, so pausing or scrolling away freezes it in place. With
// reduced motion the clock starts at the end and the finished frame shows.

const TICK = 50;

const useClock = (playing, reduced) => {
  const [t, setT] = useState(reduced ? Infinity : 0);
  useEffect(() => {
    if (reduced || !playing) return undefined;
    const id = setInterval(() => setT((v) => v + TICK), TICK);
    return () => clearInterval(id);
  }, [playing, reduced]);
  return t;
};

const typed = (text, t, start, msPerChar) => {
  if (t < start) return '';
  return text.slice(0, Math.floor((t - start) / msPerChar));
};

const Caret = ({ show }) => (show ? <span className="inline-block w-0.5 h-5 bg-bloom-teal align-middle ml-0.5 animate-pulse" /> : null);

const appear = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: 'easeOut' } };

const highlight = (text, term) => {
  const parts = text.split(new RegExp(`(${term})`, 'ig'));
  return parts.map((p, i) => (p.toLowerCase() === term.toLowerCase()
    ? <mark key={i} className="bg-bloom-teal/30 text-white rounded px-0.5">{p}</mark>
    : <React.Fragment key={i}>{p}</React.Fragment>));
};

const SEARCH_TERM = 'bank feed';
const SEARCH_RESULTS = [
  { icon: FaComments, kind: 'Forum', title: 'Bank feed stopped syncing after a password change', meta: '2 replies' },
  { icon: FaBook, kind: 'Guide', title: 'Connect a bank feed', meta: 'Banking' },
  { icon: FaComments, kind: 'Forum', title: 'Bank feed shows the same transaction twice', meta: '1 reply' },
];

export const SearchDemo = ({ playing, reduced }) => {
  const t = useClock(playing, reduced);
  const query = typed(SEARCH_TERM, t, 300, 110);
  const typing = query.length < SEARCH_TERM.length;

  return (
    <div>
      <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white text-bloom-navy">
        <FaSearch className="text-gray-600 flex-shrink-0" />
        <span className="text-lg font-semibold min-h-[28px]">
          {query || <span className="text-gray-400">Search questions…</span>}
          <Caret show={typing && t > 0} />
        </span>
      </div>
      <div className="mt-4">
        {SEARCH_RESULTS.map((r, i) => (t >= 1700 + i * 250) && (
          <motion.div key={r.title} {...appear} className="flex items-center gap-4 py-3.5 border-b border-white/10">
            <span className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${r.kind === 'Guide' ? 'bg-bloom-teal text-white' : 'bg-white/10 text-bloom-teal'}`}>
              <r.icon size={14} />
            </span>
            <span className="flex-grow min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-bloom-teal">{r.kind}</span>
              <span className="block text-white font-semibold truncate">{highlight(r.title, SEARCH_TERM)}</span>
            </span>
            <span className="hidden sm:block text-xs text-blue-100 flex-shrink-0">{r.meta}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ASK = {
  name: 'Sam',
  title: 'Can I split one bill across two projects?',
  body: 'One fuel bill covers two jobs, about 60/40.',
};

const DemoField = ({ label, value, active, tall }) => (
  <div>
    <span className="block text-xs font-bold text-blue-100 mb-1.5">{label}</span>
    <span className={`block px-4 py-2.5 rounded-xl bg-white text-bloom-navy font-semibold ${tall ? 'min-h-[68px]' : 'min-h-[44px]'} ${active ? 'ring-4 ring-bloom-teal/40' : ''}`}>
      {value}
      <Caret show={active} />
    </span>
  </div>
);

export const AskDemo = ({ playing, reduced }) => {
  const t = useClock(playing, reduced);
  const name = typed(ASK.name, t, 200, 90);
  const title = typed(ASK.title, t, 700, 35);
  const body = typed(ASK.body, t, 2400, 30);
  const field = t < 700 ? 'name' : t < 2400 ? 'title' : t < 3800 ? 'body' : null;
  const pressed = t >= 3900 && t < 4200;
  const posted = t >= 4200;

  return (
    <div className="relative">
      <div className={`grid grid-cols-3 gap-3 transition-opacity duration-300 ${posted ? 'opacity-40' : ''}`}>
        <DemoField label="Your name" value={name} active={field === 'name'} />
        <div className="col-span-2"><DemoField label="Question" value={title} active={field === 'title'} /></div>
        <div className="col-span-3"><DemoField label="Details" value={body} active={field === 'body'} tall /></div>
        <div className="col-span-3">
          <motion.span
            animate={{ scale: pressed ? 0.94 : 1 }}
            className="inline-flex px-6 py-3 rounded-xl bg-bloom-teal text-white font-bold"
          >
            Post question
          </motion.span>
        </div>
      </div>
      {posted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="w-40 h-40 rounded-full bg-bloom-teal text-white flex flex-col items-center justify-center gap-2">
            <span className="w-12 h-12 rounded-full bg-bloom-navy flex items-center justify-center"><FaCheck /></span>
            <span className="text-lg font-extrabold">Posted</span>
          </span>
        </motion.div>
      )}
    </div>
  );
};

const REPLIES = [
  { at: 1200, initials: 'TH', name: 'Tom', text: 'Put two lines on the same bill, each with its own project.' },
  { at: 2700, initials: 'LF', name: 'Lena', text: 'Same here. Set the split once and copy the bill next month.' },
];

export const AnswerDemo = ({ playing, reduced }) => {
  const t = useClock(playing, reduced);
  const shown = REPLIES.filter((r) => t >= r.at);

  return (
    <div>
      <div className="flex items-center gap-4 pb-5 border-b border-white/10">
        <span className="w-12 h-12 rounded-full bg-bloom-teal text-white flex items-center justify-center font-bold text-sm flex-shrink-0">SA</span>
        <span className="flex-grow min-w-0">
          <span className="block text-white font-bold leading-snug">{ASK.title}</span>
          <span className="block text-sm text-blue-100">Sam</span>
        </span>
        <motion.span
          key={shown.length}
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${shown.length ? 'bg-bloom-teal text-white' : 'bg-amber-400 text-bloom-navy'}`}
        >
          {shown.length ? `${shown.length} ${shown.length === 1 ? 'reply' : 'replies'}` : 'No replies yet'}
        </motion.span>
      </div>

      {/* Replies hang off a teal line from the question */}
      <div className="relative ml-6 pl-8 pt-2">
        <motion.span
          initial={{ height: 0 }}
          animate={{ height: shown.length ? '100%' : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute left-0 top-0 w-0.5 bg-bloom-teal"
        />
        {shown.map((r) => (
          <motion.div key={r.name} {...appear} className="relative flex items-start gap-3 py-3">
            <span className="absolute -left-8 top-7 w-6 h-0.5 bg-bloom-teal" />
            <span className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{r.initials}</span>
            <span>
              <span className="block text-sm font-bold text-white">{r.name}</span>
              <span className="block text-blue-50 leading-snug">{r.text}</span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
