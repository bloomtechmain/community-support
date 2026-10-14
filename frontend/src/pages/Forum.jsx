import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaTimes, FaChevronDown, FaArrowRight, FaCheck, FaPen, FaComments } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NavyBackdrop from '../components/NavyBackdrop';
import API_URL from '../api';
import { containerClass, fadeUp, stagger } from '../motion';

const FILTERS = [
  { key: 'all', label: 'Newest' },
  { key: 'most-replies', label: 'Most replies' },
  { key: 'unanswered', label: 'Unanswered' },
];

const inputClass = 'w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-bloom-navy placeholder-gray-400 focus:outline-none focus:border-bloom-teal focus:ring-4 focus:ring-bloom-teal/20 transition-all';

const replyLabel = (n) => `${n} ${Number(n) === 1 ? 'reply' : 'replies'}`;

const Forum = () => {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(searchParams.get('ask') === '1');
  const [formData, setFormData] = useState({ name: '', title: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
  const formRef = useRef(null);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [threadCache, setThreadCache] = useState({});

  const loadQuestions = async (searchVal, filterVal) => {
    try {
      const params = new URLSearchParams();
      if (searchVal) params.set('search', searchVal);
      if (filterVal && filterVal !== 'all') params.set('filter', filterVal);
      const response = await fetch(`${API_URL}/api/community/questions?${params.toString()}`);
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error('Error loading community questions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search/filter so we don't hit the API on every keystroke.
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => loadQuestions(search, filter), 300);
    return () => clearTimeout(timeout);
  }, [search, filter]);

  // Arriving from an "Ask a question" link (?ask=1) opens the form and scrolls to it.
  useEffect(() => {
    if (searchParams.get('ask') === '1') {
      setShowForm(true);
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
    }
  }, [searchParams]);

  const openForm = () => {
    setSubmitStatus(null);
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!threadCache[id]) {
      setThreadCache((prev) => ({ ...prev, [id]: { loading: true } }));
      fetch(`${API_URL}/api/community/questions/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setThreadCache((prev) => ({ ...prev, [id]: { loading: false, replies: data.replies || [] } }));
        })
        .catch((error) => {
          console.error('Error loading thread preview:', error);
          setThreadCache((prev) => ({ ...prev, [id]: { loading: false, error: true } }));
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${API_URL}/api/community/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', title: '', body: '' });
        loadQuestions(search, filter);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error posting question:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSearching = search.trim().length > 0;

  return (
    <div className="font-sans overflow-x-hidden bg-white">
      <Header />

      {/* Hero — headline and a large search box */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-bloom-navy">
        <NavyBackdrop />
        <motion.div variants={stagger(0.12)} initial="hidden" animate="visible" className={`${containerClass} max-w-5xl mx-auto`}>
          <motion.p variants={fadeUp} className="text-xs md:text-sm font-bold tracking-[0.3em] text-bloom-teal uppercase mb-4 inline-flex items-center gap-2">
            <FaComments /> Community Forum
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 text-white">
            Ask other people<br />
            <span className="text-bloom-teal">who use Bloom.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-blue-50 mb-8 max-w-2xl leading-relaxed">
            No account needed. Anyone can post a question or reply to one.
          </motion.p>

          <motion.div variants={fadeUp} className="relative max-w-2xl">
            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions, e.g. bank feed, invoice, payroll…"
              aria-label="Search questions"
              className="w-full pl-14 pr-14 py-5 rounded-2xl bg-white text-bloom-navy placeholder-gray-400 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-bloom-teal/40 transition-all"
            />
            {isSearching && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gray-100 text-bloom-navy flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <FaTimes size={12} />
              </button>
            )}
          </motion.div>
        </motion.div>
      </section>

      <section className="relative py-16 bg-white overflow-hidden">
        <div aria-hidden="true" className="hidden lg:block absolute -top-56 -right-56 w-[620px] h-[620px] rounded-full bg-bloom-teal/10 pointer-events-none" />

        <div className={`${containerClass} max-w-5xl mx-auto`}>
          {/* Ask form */}
          <div ref={formRef} className="scroll-mt-24">
            <AnimatePresence initial={false}>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mb-14 pb-12 border-b border-gray-200 grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                      <p className="text-bloom-teal-deep font-bold tracking-widest text-sm uppercase mb-2 flex items-center gap-2">
                        <span className="w-6 h-px bg-bloom-teal-deep" /> New question
                      </p>
                      <h2 className="text-3xl font-extrabold text-bloom-navy leading-tight mb-4">Ask the community</h2>
                      <p className="text-gray-800 leading-relaxed">
                        Say which screen you were on, what you clicked, and what happened. A clear title gets an answer faster.
                      </p>
                    </div>

                    <div className="lg:col-span-8">
                      {submitStatus === 'success' ? (
                        <div className="h-full flex flex-col items-start justify-center gap-4 py-6">
                          <span className="w-16 h-16 rounded-full bg-bloom-teal text-white flex items-center justify-center text-xl">
                            <FaCheck />
                          </span>
                          <h3 className="text-2xl font-extrabold text-bloom-navy">Your question is up.</h3>
                          <p className="text-gray-800">It is at the top of the list below. Replies will appear in its thread.</p>
                          <div className="flex items-center gap-6">
                            <button type="button" onClick={() => { setSubmitStatus(null); setShowForm(false); }} className="group text-bloom-teal-deep font-bold inline-flex items-center gap-2">
                              Back to the list <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button type="button" onClick={() => setSubmitStatus(null)} className="text-gray-700 font-semibold hover:text-bloom-navy">
                              Ask another
                            </button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <label className="block sm:col-span-1">
                              <span className="block text-sm font-bold text-bloom-navy mb-2">Your name</span>
                              <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClass} />
                            </label>
                            <label className="block sm:col-span-2">
                              <span className="block text-sm font-bold text-bloom-navy mb-2">Question</span>
                              <input
                                type="text" name="title" required value={formData.title} onChange={handleChange}
                                placeholder="e.g. How do I undo a bank reconciliation?"
                                className={inputClass}
                              />
                            </label>
                          </div>
                          <label className="block">
                            <span className="block text-sm font-bold text-bloom-navy mb-2">Details</span>
                            <textarea name="body" rows="6" required value={formData.body} onChange={handleChange} className={`${inputClass} resize-y`} />
                          </label>
                          {submitStatus === 'error' && (
                            <p className="text-sm text-red-700">That did not go through. Check your connection and try again.</p>
                          )}
                          <div className="flex items-center gap-6">
                            <button
                              type="submit" disabled={isSubmitting}
                              className="group px-8 py-3.5 bg-bloom-teal text-white rounded-xl font-bold hover:bg-bloom-teal-deep transition-colors inline-flex items-center gap-2 disabled:opacity-60"
                            >
                              {isSubmitting ? 'Posting…' : (<>Post question <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /></>)}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="text-gray-700 font-semibold hover:text-bloom-navy">
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort tabs + ask button */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-5 border-b-2 border-bloom-navy">
            <div className="flex items-center gap-2" role="tablist" aria-label="Sort questions">
              {FILTERS.map((f) => {
                const active = filter === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(f.key)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${active ? 'bg-bloom-navy text-white' : 'bg-gray-100 text-bloom-navy hover:bg-gray-200'}`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            {!showForm && (
              <button
                type="button"
                onClick={openForm}
                className="group self-start sm:self-auto px-6 py-3 bg-bloom-teal text-white rounded-xl font-bold hover:bg-bloom-teal-deep transition-colors inline-flex items-center gap-2"
              >
                <FaPen size={12} /> Ask a question
              </button>
            )}
          </div>

          {/* Question list — numbered rows on hairlines */}
          {loading ? (
            <p className="text-gray-700 py-12">Loading questions…</p>
          ) : questions.length === 0 ? (
            <div className="py-16 flex flex-col items-center text-center">
              <span className="w-24 h-24 rounded-full bg-gray-100 text-bloom-navy flex items-center justify-center text-4xl mb-6">
                <FaComments />
              </span>
              <p className="text-lg text-gray-800 max-w-md mb-6">
                {isSearching
                  ? <>Nothing matched &ldquo;{search}&rdquo;. Try another word, or ask it yourself.</>
                  : filter === 'unanswered' ? 'Every question has at least one reply.' : 'No questions yet. Be the first to ask one.'}
              </p>
              {!showForm && (
                <button type="button" onClick={openForm} className="group text-bloom-teal-deep font-bold inline-flex items-center gap-2">
                  Ask a question <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          ) : (
            <div>
              {isSearching && (
                <p className="text-sm text-gray-700 pt-5">
                  {questions.length} result{questions.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
                </p>
              )}
              {questions.map((q, index) => {
                const cache = threadCache[q.id];
                const isOpen = expandedId === q.id;
                const unanswered = Number(q.reply_count) === 0;
                return (
                  <div key={q.id} className="border-b border-gray-200">
                    <button
                      type="button"
                      onClick={() => toggleExpand(q.id)}
                      aria-expanded={isOpen}
                      className="group w-full flex items-center gap-4 sm:gap-5 text-left py-5"
                    >
                      <span className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-colors duration-300 ${
                        isOpen ? 'bg-bloom-teal text-white' : 'bg-bloom-navy text-white group-hover:bg-bloom-teal'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-grow min-w-0">
                        <span className="block text-lg font-bold text-bloom-navy">{q.title}</span>
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-700 mt-0.5">
                          <span>{q.name}</span>
                          <span className="text-gray-300">/</span>
                          <span>{new Date(q.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span className="text-gray-300">/</span>
                          {unanswered ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-bloom-navy text-xs font-bold">No replies yet</span>
                          ) : (
                            <span className="font-semibold text-bloom-teal-deep">{replyLabel(q.reply_count)}</span>
                          )}
                        </span>
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${isOpen ? 'bg-bloom-teal text-white' : 'bg-gray-100 text-bloom-navy'}`}
                      >
                        <FaChevronDown size={12} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-16 sm:pl-[68px] pr-4 sm:pr-14 pb-7">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-5">{q.body}</p>

                            {cache?.loading ? (
                              <p className="text-sm text-gray-600 mb-5">Loading replies…</p>
                            ) : cache?.error ? (
                              <p className="text-sm text-red-700 mb-5">Replies could not be loaded.</p>
                            ) : (cache?.replies || []).length > 0 && (
                              <div className="mb-5 pl-4 border-l-2 border-bloom-teal space-y-3">
                                {cache.replies.slice(0, 2).map((r) => (
                                  <p key={r.id} className="text-sm text-gray-800 leading-relaxed">
                                    <span className="font-bold text-bloom-navy">{r.name}</span>{' '}
                                    {r.body.length > 160 ? `${r.body.slice(0, 160)}…` : r.body}
                                  </p>
                                ))}
                                {q.reply_count > 2 && (
                                  <p className="text-xs font-semibold text-gray-600">and {replyLabel(q.reply_count - 2)} more</p>
                                )}
                              </div>
                            )}

                            <Link to={`/community/${q.id}`} className="group text-bloom-teal-deep font-bold inline-flex items-center gap-2">
                              {unanswered ? 'Open the thread and answer' : 'Read the thread'} <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Forum;
