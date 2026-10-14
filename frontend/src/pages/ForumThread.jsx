import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaChevronRight } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NavyBackdrop from '../components/NavyBackdrop';
import API_URL from '../api';
import { containerClass, fadeUp, stagger } from '../motion';

const initials = (name) => {
  const parts = (name || '?').trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
};

const dateLabel = (iso) =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

const inputClass = 'w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-bloom-navy placeholder-gray-400 focus:outline-none focus:border-bloom-teal focus:ring-4 focus:ring-bloom-teal/20 transition-all';

const Post = ({ name, body, createdAt, isQuestion }) => (
  <article className="flex gap-4 sm:gap-5 py-8 border-b border-gray-200">
    <span className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${isQuestion ? 'bg-bloom-teal text-white' : 'bg-bloom-navy text-white'}`}>
      {initials(name)}
    </span>
    <div className="min-w-0 flex-1">
      <p className="flex flex-wrap items-baseline gap-x-3 mb-2">
        <span className="font-bold text-bloom-navy">{name}</span>
        {isQuestion && <span className="text-[11px] font-bold uppercase tracking-wider text-bloom-teal-deep">Asked</span>}
        <span className="text-sm text-gray-600">{dateLabel(createdAt)}</span>
      </p>
      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">{body}</p>
    </div>
  </article>
);

const ForumThread = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const lastReplyRef = useRef(null);
  const justPosted = useRef(false);

  const loadThread = async () => {
    try {
      const response = await fetch(`${API_URL}/api/community/questions/${id}`);
      if (response.status === 404) {
        setNotFound(true);
        return;
      }
      const data = await response.json();
      setQuestion(data.question);
      setReplies(data.replies || []);
    } catch (error) {
      console.error('Error loading thread:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Only scroll after the reader posts a reply, not on first load.
  useEffect(() => {
    if (justPosted.current) {
      justPosted.current = false;
      lastReplyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [replies.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      const response = await fetch(`${API_URL}/api/community/questions/${id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, body }),
      });

      if (response.ok) {
        setBody('');
        justPosted.current = true;
        loadThread();
      } else {
        setSubmitError(true);
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans overflow-x-hidden bg-white flex flex-col min-h-screen">
      <Header />

      <section className="relative pt-32 pb-14 overflow-hidden bg-bloom-navy">
        <NavyBackdrop />
        <motion.div variants={stagger(0.1)} initial="hidden" animate="visible" className={`${containerClass} max-w-4xl mx-auto`}>
          <motion.nav variants={fadeUp} aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-blue-100 mb-6">
            <Link to="/community" className="hover:text-bloom-teal transition-colors">Forum</Link>
            <FaChevronRight size={9} />
            <span className="text-white">Question</span>
          </motion.nav>
          {question && (
            <>
              <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-5">
                {question.title}
              </motion.h1>
              <motion.p variants={fadeUp} className="text-blue-50">
                Asked by <span className="font-bold text-white">{question.name}</span>
                <span className="mx-3 text-white/40">/</span>
                <span className="text-bloom-teal font-bold">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
              </motion.p>
            </>
          )}
        </motion.div>
      </section>

      <section className="flex-1 bg-white py-6">
        <div className={`${containerClass} max-w-4xl mx-auto`}>
          {loading ? (
            <p className="text-gray-700 py-12">Loading…</p>
          ) : notFound ? (
            <div className="py-16">
              <p className="text-lg text-gray-800 mb-5">This question could not be found. It may have been removed.</p>
              <Link to="/community" className="group text-bloom-teal-deep font-bold inline-flex items-center gap-2">
                Back to the forum <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <>
              <Post name={question.name} body={question.body} createdAt={question.created_at} isQuestion />

              {replies.length === 0 ? (
                <p className="py-8 border-b border-gray-200 text-gray-700">
                  Nobody has replied yet. If you know the answer, add it below.
                </p>
              ) : (
                <>
                  <p className="pt-10 pb-2 text-bloom-teal-deep font-bold tracking-widest text-sm uppercase flex items-center gap-2">
                    <span className="w-6 h-px bg-bloom-teal-deep" /> {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
                  </p>
                  {replies.map((r, i) => (
                    <div key={r.id} ref={i === replies.length - 1 ? lastReplyRef : null}>
                      <Post name={r.name} body={r.body} createdAt={r.created_at} />
                    </div>
                  ))}
                </>
              )}

              {/* Reply form */}
              <form onSubmit={handleSubmit} className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <h2 className="text-2xl font-extrabold text-bloom-navy mb-2">Your answer</h2>
                  <p className="text-gray-800 leading-relaxed">No account needed. Your name is shown next to your reply.</p>
                </div>
                <div className="lg:col-span-8 space-y-5">
                  <label className="block max-w-xs">
                    <span className="block text-sm font-bold text-bloom-navy mb-2">Your name</span>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-bold text-bloom-navy mb-2">Reply</span>
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} required rows="5" className={`${inputClass} resize-y`} />
                  </label>
                  {submitError && (
                    <p className="text-sm text-red-700">That did not go through. Check your connection and try again.</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group px-8 py-3.5 bg-bloom-teal text-white rounded-xl font-bold hover:bg-bloom-teal-deep transition-colors inline-flex items-center gap-2 disabled:opacity-60"
                  >
                    {isSubmitting ? 'Posting…' : (<>Post reply <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /></>)}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForumThread;
