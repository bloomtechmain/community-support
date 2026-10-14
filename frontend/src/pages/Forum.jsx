import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  FaComments, FaUser, FaTag, FaCommentDots, FaCheckCircle, FaPaperPlane,
  FaReply, FaSearch, FaInfoCircle, FaChevronDown,
} from 'react-icons/fa';
import API_URL from '../api';
import forumChatHandsImg from '../assets/forum-chat-hands.jpg';

const Forum = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', title: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

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

  return (
    <div className="font-sans overflow-x-hidden bg-white">
      <Header />

      <section className="relative min-h-[35vh] lg:min-h-[55vh] flex items-center pt-16 sm:pt-20 pb-10 sm:pb-14 px-5 sm:px-6 md:px-12 lg:px-20 overflow-hidden bg-[#0e3b5e]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 flex justify-center">
            <img
              src={forumChatHandsImg}
              alt=""
              className="w-full max-w-[1600px] h-full object-cover object-center opacity-50 grayscale"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0e3b5e]/85 via-[#1c3bd8]/40 to-[#0e3b5e]/90" />
        </div>
        <div className="max-w-5xl mx-auto w-full relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#00cba9]/10 border border-[#00cba9]/30 text-[#00cba9] font-bold text-xs sm:text-sm mb-6 tracking-wide uppercase backdrop-blur-md">
            <FaComments /> Community Forum
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-white">
            Ask other people using Bloom
          </h1>
          <p className="text-base sm:text-lg text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
            No account needed — anyone can post a question or reply.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-5 sm:px-6 md:px-12 lg:px-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 sm:p-5 text-sm text-gray-600">
            <FaInfoCircle className="text-[#00cba9] mt-0.5 flex-shrink-0" />
            <p>
              <span className="font-semibold text-[#0e3b5e]">How it works: </span>
              Search or filter the questions below, or click "Ask a question" to post your own — no
              account needed. Click any question to preview its replies, then open the full thread to
              read everything or reply.
            </p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0e3b5e]">Recent questions</h2>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex items-center gap-2 bg-[#00cba9] hover:bg-[#00b596] text-white font-bold py-3 px-6 rounded-full text-sm sm:text-base shadow-lg hover:shadow-xl transition-all"
            >
              {showForm ? 'Cancel' : 'Ask a question'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#00cba9] focus:ring-2 focus:ring-[#00cba9]/20 outline-none text-sm transition-all"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#00cba9] focus:ring-2 focus:ring-[#00cba9]/20 outline-none text-sm transition-all"
            >
              <option value="all">Newest first</option>
              <option value="most-replies">Most replies</option>
              <option value="unanswered">Unanswered only</option>
            </select>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-10"
              >
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
                  {submitStatus === 'success' ? (
                    <div className="text-center py-8">
                      <FaCheckCircle className="text-3xl text-[#00cba9] mb-4 mx-auto" />
                      <h3 className="text-xl font-bold text-[#0e3b5e] mb-2">Question posted!</h3>
                      <button
                        onClick={() => { setSubmitStatus(null); setShowForm(false); }}
                        className="text-[#00cba9] font-bold hover:underline"
                      >
                        Back to the list
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <FaUser className="text-[#00cba9]" /> Your Name
                        </label>
                        <input
                          type="text" name="name" required value={formData.name} onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#00cba9] focus:ring-2 focus:ring-[#00cba9]/20 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <FaTag className="text-[#00cba9]" /> Question title
                        </label>
                        <input
                          type="text" name="title" required value={formData.title} onChange={handleChange}
                          placeholder="What's your question about?"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#00cba9] focus:ring-2 focus:ring-[#00cba9]/20 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <FaCommentDots className="text-[#00cba9]" /> Details
                        </label>
                        <textarea
                          name="body" rows="5" required value={formData.body} onChange={handleChange}
                          placeholder="Give as much detail as you can..."
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#00cba9] focus:ring-2 focus:ring-[#00cba9]/20 outline-none transition-all resize-none"
                        />
                      </div>
                      {submitStatus === 'error' && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                          Something went wrong. Please try again.
                        </div>
                      )}
                      <button
                        type="submit" disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 bg-[#00cba9] hover:bg-[#00b596] text-white font-bold py-3.5 px-8 rounded-full text-base shadow-xl transition-all disabled:opacity-70"
                      >
                        {isSubmitting ? 'Posting...' : (<>Post Question <FaPaperPlane /></>)}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <p className="text-gray-500 text-center py-12">Loading questions...</p>
          ) : questions.length === 0 ? (
            <p className="text-gray-500 text-center py-12">
              {search ? 'No questions match your search.' : 'No questions yet — be the first to ask one.'}
            </p>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => {
                const cache = threadCache[q.id];
                const isOpen = expandedId === q.id;
                return (
                  <div
                    key={q.id}
                    className="relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-[#00cba9]/60" />
                    <button
                      type="button"
                      onClick={() => toggleExpand(q.id)}
                      className="w-full text-left pl-6 pr-5 py-5 sm:pl-7 sm:pr-6 sm:py-6 flex items-start justify-between gap-3 bg-transparent border-none cursor-pointer"
                    >
                      <div>
                        <h3 className="font-bold text-[#0e3b5e] text-lg mb-1">{q.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                          <span>by {q.name}</span>
                          <span>·</span>
                          <span>{new Date(q.created_at).toLocaleDateString()}</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <FaReply /> {q.reply_count} {q.reply_count === 1 ? 'reply' : 'replies'}
                          </span>
                        </div>
                      </div>
                      <FaChevronDown
                        className={`text-gray-400 mt-1 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden border-t border-gray-100"
                        >
                          <div className="p-5 sm:p-6 bg-gray-50">
                            <p className="text-gray-700 text-sm mb-4 whitespace-pre-wrap">{q.body}</p>

                            {cache?.loading ? (
                              <p className="text-gray-400 text-sm">Loading replies...</p>
                            ) : cache?.error ? (
                              <p className="text-red-500 text-sm">Couldn't load replies.</p>
                            ) : (cache?.replies || []).length === 0 ? (
                              <p className="text-gray-400 text-sm italic mb-2">No replies yet.</p>
                            ) : (
                              <div className="space-y-3 mb-2">
                                {cache.replies.slice(0, 2).map((r) => (
                                  <div key={r.id} className="text-sm">
                                    <span className="font-semibold text-[#0e3b5e]">{r.name}: </span>
                                    <span className="text-gray-600">
                                      {r.body.length > 140 ? `${r.body.slice(0, 140)}…` : r.body}
                                    </span>
                                  </div>
                                ))}
                                {q.reply_count > 2 && (
                                  <p className="text-xs text-gray-400">
                                    + {q.reply_count - 2} more {q.reply_count - 2 === 1 ? 'reply' : 'replies'}
                                  </p>
                                )}
                              </div>
                            )}

                            <Link
                              to={`/community/${q.id}`}
                              className="inline-flex items-center gap-1 text-[#00cba9] font-bold text-sm hover:underline no-underline mt-2"
                            >
                              View full thread &amp; reply →
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
