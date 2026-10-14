import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EASE, fadeUp, inView, stagger } from '../../motion';

const MAX_DOTS = 5;

// Live snapshot of the forum: the newest questions with their reply counts as
// dots, and a bar splitting answered from unanswered.
const ForumPreview = ({ questions }) => {
  if (!questions) return <div className="h-56" />;
  if (questions.length === 0) {
    return <p className="text-gray-700 py-6">No questions yet. The first one will show up here.</p>;
  }

  const latest = questions.slice(0, 3);
  const answered = questions.filter((q) => Number(q.reply_count) > 0).length;
  const unanswered = questions.length - answered;
  const answeredPct = Math.round((answered / questions.length) * 100);

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-2">Latest questions</p>
      <motion.ul variants={stagger(0.1)} {...inView} className="list-none p-0 m-0 border-b border-gray-200">
        {latest.map((q, i) => {
          const replies = Number(q.reply_count);
          return (
            <motion.li key={q.id} variants={fadeUp} className="border-t border-gray-200">
              <Link to={`/community/${q.id}`} className="group flex items-center gap-3 py-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-bloom-navy text-white group-hover:bg-bloom-teal flex items-center justify-center font-mono text-xs font-bold transition-colors duration-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-grow min-w-0 truncate font-semibold text-bloom-navy group-hover:text-bloom-teal-deep transition-colors">
                  {q.title}
                </span>
                <span className="flex-shrink-0 flex items-center gap-1" aria-label={`${replies} ${replies === 1 ? 'reply' : 'replies'}`}>
                  {Array.from({ length: MAX_DOTS }).map((_, d) => (
                    <motion.span
                      key={d}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.3 + i * 0.1 + d * 0.05 }}
                      className={`w-2.5 h-2.5 rounded-full ${d < replies ? 'bg-bloom-teal' : 'bg-gray-200'}`}
                    />
                  ))}
                </span>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>

      {/* Answered vs unanswered, filling left to right */}
      <div className="mt-6">
        <div className="flex h-3 rounded-full overflow-hidden bg-bloom-navy">
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: `${answeredPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
            className="h-full bg-bloom-teal"
          />
        </div>
        <div className="flex items-center justify-between mt-3 text-sm">
          <span className="inline-flex items-center gap-2 text-gray-800">
            <span className="w-2.5 h-2.5 rounded-full bg-bloom-teal" />
            <span className="font-bold text-bloom-navy">{answered}</span> answered
          </span>
          <span className="inline-flex items-center gap-2 text-gray-800">
            <span className="w-2.5 h-2.5 rounded-full bg-bloom-navy" />
            <span className="font-bold text-bloom-navy">{unanswered}</span> waiting for a reply
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForumPreview;
