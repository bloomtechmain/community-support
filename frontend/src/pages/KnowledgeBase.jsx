import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaSearch, FaTimes, FaArrowRight, FaChevronRight, FaDownload, FaFilePdf } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NavyBackdrop from '../components/NavyBackdrop';
import {
  PlanGuides, FeatureGuides, HowBloomWorks, ProductScreens, Foundations, GuidesCta,
} from '../components/guides/GuideSections';
import WebsiteLink from '../components/WebsiteLink';
import API_URL from '../api';
import { ALL_PDF_GUIDES, searchPdfGuides } from '../guides';
import { containerClass, fadeUp, inView, popIn, stagger } from '../motion';

const snippet = (body, term) => {
  const clean = body.replace(/\*\*/g, '');
  const idx = term ? clean.toLowerCase().indexOf(term.toLowerCase()) : -1;
  if (idx === -1) return clean.length > 160 ? `${clean.slice(0, 160)}…` : clean;
  const start = Math.max(0, idx - 60);
  const end = Math.min(clean.length, idx + term.length + 100);
  return `${start > 0 ? '…' : ''}${clean.slice(start, end)}${end < clean.length ? '…' : ''}`;
};

const KnowledgeBase = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/kb/topics`)
      .then((res) => res.json())
      .then((data) => setTopics(data.topics || []))
      .catch((error) => console.error('Error loading KB topics:', error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setSearching(true);
    const timeout = setTimeout(() => {
      const params = new URLSearchParams({ q: query.trim() });
      if (topicFilter) params.set('topic', topicFilter);
      fetch(`${API_URL}/api/kb/search?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.articles || []);
          setSearched(true);
        })
        .catch((error) => console.error('Error searching KB:', error))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, topicFilter]);

  const isSearchMode = query.trim().length > 0;
  const totalArticles = topics.reduce((sum, t) => sum + Number(t.article_count || 0), 0);
  // PDF guides are matched in the browser; a topic filter only narrows the written articles.
  const pdfResults = isSearchMode && !topicFilter ? searchPdfGuides(query) : [];
  const resultCount = results.length + pdfResults.length;

  return (
    <div className="font-sans overflow-x-hidden bg-white">
      <Header />

      {/* Hero — headline and search beside two filled counters */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-bloom-navy">
        <NavyBackdrop />
        <div className={`${containerClass} grid grid-cols-1 lg:grid-cols-2 gap-14 items-center`}>
          <motion.div variants={stagger(0.12)} initial="hidden" animate="visible">
            <motion.p variants={fadeUp} className="text-xs md:text-sm font-bold tracking-[0.3em] text-bloom-teal uppercase mb-4 inline-flex items-center gap-2">
              <FaBook /> Guides &amp; Knowledge Base
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-white">
              Master your books,<br />
              <span className="text-bloom-teal">one guide at a time.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-blue-50 max-w-xl mb-8 leading-relaxed">
              Download the PDF guides for your plan and for each feature, or search the written answers from our team.
            </motion.p>

            <motion.div variants={fadeUp} className="relative max-w-xl">
              <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search guides, e.g. reconcile, invoice, payroll…"
                aria-label="Search guides"
                className="w-full pl-14 pr-14 py-5 rounded-2xl bg-white text-bloom-navy placeholder-gray-400 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-bloom-teal/40 transition-all"
              />
              {isSearchMode && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gray-100 text-bloom-navy flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <FaTimes size={12} />
                </button>
              )}
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm font-bold">
              {[['#plan-guides', 'Plan guides'], ['#feature-guides', 'Feature guides'], ['#topics', 'Browse by topic']].map(([href, label]) => (
                <a key={href} href={href} onClick={() => setQuery('')} className="group inline-flex items-center gap-2 text-white hover:text-bloom-teal transition-colors">
                  {label} <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                </a>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="mt-4 text-sm">
              <WebsiteLink path="/resources/guides" tone="dark">Open the Guides page on bloomaudit.com</WebsiteLink>
            </motion.div>
          </motion.div>

          <motion.div variants={stagger(0.15, 0.3)} initial="hidden" animate="visible" className="flex items-center justify-center lg:justify-end gap-5 sm:gap-8">
            <motion.div variants={popIn} className="w-36 h-36 sm:w-52 sm:h-52 rounded-full bg-bloom-teal text-white flex flex-col items-center justify-center text-center">
              <span className="text-5xl sm:text-7xl font-extrabold leading-none">{ALL_PDF_GUIDES.length}</span>
              <span className="text-xs sm:text-sm font-bold mt-2">PDF guides</span>
            </motion.div>
            <motion.div variants={popIn} className="w-36 h-36 sm:w-52 sm:h-52 rounded-full bg-white/10 text-white flex flex-col items-center justify-center text-center">
              <span className="text-5xl sm:text-7xl font-extrabold leading-none">{loading ? '–' : totalArticles}</span>
              <span className="text-xs sm:text-sm font-bold mt-2 text-bloom-teal">written answers</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {isSearchMode ? (
        <section className="relative py-16 bg-white overflow-hidden min-h-[50vh]">
          <div className={`${containerClass} max-w-5xl mx-auto`}>
            {/* Narrow the written answers to one topic (PDF guides are not filed by topic) */}
            <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by topic">
              {[{ slug: '', name: 'All topics' }, ...topics].map((t) => {
                const active = topicFilter === t.slug;
                return (
                  <button
                    key={t.slug || 'all'}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTopicFilter(t.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${active ? 'bg-bloom-navy text-white' : 'bg-gray-100 text-bloom-navy hover:bg-gray-200'}`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>

            <p className="text-lg font-bold text-bloom-navy pb-5 border-b-2 border-bloom-navy">
              {searching ? 'Searching…' : `${resultCount} result${resultCount !== 1 ? 's' : ''} for “${query}”`}
            </p>

            {!searching && searched && resultCount === 0 && (
              <div className="py-16 flex flex-col items-center text-center">
                <span className="w-24 h-24 rounded-full bg-gray-100 text-bloom-navy flex items-center justify-center text-4xl mb-6">
                  <FaBook />
                </span>
                <p className="text-lg text-gray-800 max-w-md mb-6">No guide covers that yet. Try another word, or ask the community.</p>
                <Link to="/community?ask=1" className="group text-bloom-teal-deep font-bold inline-flex items-center gap-2">
                  Ask in the forum <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}

            {/* Matching PDF guides first, as downloads */}
            {pdfResults.map((g) => (
              <a key={g.file} href={g.file} download target="_blank" rel="noopener noreferrer" className="group flex items-start gap-5 py-6 border-b border-gray-200">
                <span className="flex-shrink-0 w-12 h-12 rounded-full bg-bloom-teal text-white flex items-center justify-center">
                  <FaFilePdf />
                </span>
                <span className="flex-grow min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-bloom-teal-deep mb-1">{g.kind} · PDF</span>
                  <span className="block text-lg font-bold text-bloom-navy group-hover:text-bloom-teal-deep transition-colors mb-1">{g.title}</span>
                  <span className="block text-gray-700 leading-relaxed">{g.desc}</span>
                </span>
                <span className="flex-shrink-0 mt-3 inline-flex items-center gap-2 text-sm font-bold text-bloom-teal-deep">
                  <FaDownload size={12} /> <span className="hidden sm:inline">Download</span>
                </span>
              </a>
            ))}

            {results.map((a) => (
              <Link key={a.id} to={`/kb/${a.topic_slug}/${a.id}`} className="group flex items-start gap-5 py-6 border-b border-gray-200">
                <span className="flex-shrink-0 w-12 h-12 rounded-full bg-bloom-navy text-bloom-teal flex items-center justify-center">
                  <FaBook />
                </span>
                <span className="flex-grow min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-bloom-teal-deep mb-1">{a.topic_name}</span>
                  <span className="block text-lg font-bold text-bloom-navy group-hover:text-bloom-teal-deep transition-colors mb-1">{a.title}</span>
                  <span className="block text-gray-700 leading-relaxed">{snippet(a.body, query)}</span>
                </span>
                <span className="flex-shrink-0 mt-3 w-9 h-9 rounded-full bg-gray-100 text-bloom-navy flex items-center justify-center group-hover:bg-bloom-teal group-hover:text-white transition-colors">
                  <FaChevronRight size={11} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <>
          <PlanGuides />
          <FeatureGuides />

          {/* Written answers, by topic: big filled tiles that turn navy on hover */}
          <section id="topics" className="relative py-20 bg-gray-50 overflow-hidden scroll-mt-20">
            <div aria-hidden="true" className="hidden lg:block absolute -top-56 -right-56 w-[620px] h-[620px] rounded-full bg-bloom-teal/10 pointer-events-none" />
            <div className={containerClass}>
              <motion.div variants={stagger(0.1)} {...inView} className="max-w-3xl mb-12">
                <motion.p variants={fadeUp} className="text-bloom-teal-deep font-bold tracking-widest text-sm uppercase mb-2 flex items-center gap-2">
                  <span className="w-6 h-px bg-bloom-teal-deep" /> Written answers
                </motion.p>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-bloom-navy leading-tight mb-4">
                  Browse by topic
                </motion.h2>
                <motion.p variants={fadeUp} className="text-lg text-gray-800 leading-relaxed">
                  Short answers from our team, read in the browser. Pick the part of Bloom you are working in.
                </motion.p>
              </motion.div>

              {loading ? (
                <p className="text-gray-700">Loading topics…</p>
              ) : topics.length === 0 ? (
                <p className="text-lg text-gray-800">No written answers have been published yet.</p>
              ) : (
                <motion.div variants={stagger(0.06)} {...inView} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {topics.map((t, i) => (
                    <motion.div key={t.id} variants={fadeUp}>
                      <Link
                        to={`/kb/${t.slug}`}
                        className="group h-full flex flex-col rounded-2xl p-5 sm:p-6 bg-white text-bloom-navy hover:bg-bloom-navy hover:text-white transition-colors duration-300"
                      >
                        <span className="flex items-center justify-between mb-10">
                          <span className="font-mono text-sm font-bold text-bloom-teal-deep group-hover:text-bloom-teal transition-colors">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <FaArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-bloom-teal transition-all duration-300" />
                        </span>
                        <span className="block text-xl font-extrabold leading-tight mb-1">{t.name}</span>
                        <span className="block text-sm text-gray-700 group-hover:text-blue-100 transition-colors">
                          {t.article_count} {Number(t.article_count) === 1 ? 'answer' : 'answers'}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </section>

          <HowBloomWorks />
          <ProductScreens />
          <Foundations />
          <GuidesCta />
        </>
      )}

      <Footer />
    </div>
  );
};

export default KnowledgeBase;
