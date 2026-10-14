import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { EASE } from '../../motion';

// One filled bar per Knowledge Base topic, sized by its real guide count.
// Bars grow in one after another; each row links to its topic.
const TopicBars = ({ topics }) => {
  if (!topics) return <div className="h-56" />;
  if (topics.length === 0) {
    return <p className="text-gray-700 py-6">No guides have been published yet.</p>;
  }

  const max = Math.max(...topics.map((t) => Number(t.article_count) || 0), 1);

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-3">Guides per topic</p>
      <ul className="list-none p-0 m-0 space-y-2">
        {topics.map((t, i) => {
          const count = Number(t.article_count) || 0;
          // Keep a sliver visible for empty topics so every row still reads as a bar.
          const pct = Math.max((count / max) * 100, 12);
          return (
            <li key={t.id}>
              <Link to={`/kb/${t.slug}`} className="group flex items-center gap-3" aria-label={`${t.name}, ${count} ${count === 1 ? 'guide' : 'guides'}`}>
                <span className="w-28 sm:w-36 flex-shrink-0 truncate text-sm font-semibold text-bloom-navy group-hover:text-bloom-teal-deep transition-colors">
                  {t.name}
                </span>
                <span className="relative flex-grow h-8 rounded-full bg-gray-100 overflow-hidden">
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.08 }}
                    className="absolute inset-y-0 left-0 rounded-full bg-bloom-navy group-hover:bg-bloom-teal transition-colors duration-300 flex items-center justify-end pr-3"
                  >
                    <span className="font-mono text-xs font-bold text-white">{count}</span>
                  </motion.span>
                </span>
                <FaArrowRight size={10} className="flex-shrink-0 text-bloom-teal-deep opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TopicBars;
