import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import API_URL from '../api';

const AVATAR_COLORS = ['#00cba9', '#0e3b5e', '#1c3bd8', '#f59e0b', '#ef4444', '#8b5cf6'];

const initials = (name) => (name || '?').trim().charAt(0).toUpperCase();

const avatarColor = (name) => {
  const code = (name || '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
};

const timeLabel = (iso) =>
  new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

const Bubble = ({ name, body, createdAt, isQuestion }) => (
  <div className="flex items-start gap-3 mb-5">
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
      style={{ backgroundColor: avatarColor(name) }}
    >
      {initials(name)}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-bold text-[#0e3b5e] text-sm">{name}</span>
        <span className="text-xs text-gray-400">{timeLabel(createdAt)}</span>
      </div>
      <div
        className={`inline-block max-w-full px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed whitespace-pre-wrap ${
          isQuestion ? 'bg-[#0e3b5e] text-white' : 'bg-gray-100 text-gray-800'
        }`}
      >
        {body}
      </div>
    </div>
  </div>
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
  const bottomRef = useRef(null);

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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

      <section className="flex-1 pt-16 sm:pt-20 pb-6 px-5 sm:px-6 md:px-12 lg:px-20 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <Link to="/community" className="inline-flex items-center gap-2 text-[#00cba9] font-bold text-sm my-6 no-underline hover:underline">
            <FaArrowLeft /> Back to the forum
          </Link>

          {loading ? (
            <p className="text-gray-500 text-center py-12">Loading...</p>
          ) : notFound ? (
            <p className="text-gray-500 text-center py-12">This question could not be found.</p>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col overflow-hidden">
              <div className="px-5 sm:px-8 pt-6 pb-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0e3b5e] mb-1">{question.title}</h1>
                <p className="text-xs text-gray-400 mb-4">
                  {replies.length} {replies.length === 1 ? 'reply' : 'replies'} in this chat
                </p>
              </div>

              <div className="px-5 sm:px-8 pb-4 max-h-[55vh] overflow-y-auto">
                <Bubble name={question.name} body={question.body} createdAt={question.created_at} isQuestion />
                {replies.map((r) => (
                  <Bubble key={r.id} name={r.name} body={r.body} createdAt={r.created_at} />
                ))}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={handleSubmit} className="border-t border-gray-100 bg-gray-50 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="sm:w-40 px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#00cba9] focus:ring-2 focus:ring-[#00cba9]/20 outline-none text-sm transition-all"
                  />
                  <input
                    type="text"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    placeholder="Type your answer..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#00cba9] focus:ring-2 focus:ring-[#00cba9]/20 outline-none text-sm transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 bg-[#00cba9] hover:bg-[#00b596] text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md transition-all disabled:opacity-70"
                  >
                    <FaPaperPlane />
                    <span className="sm:hidden">Send</span>
                  </button>
                </div>
                {submitError && (
                  <p className="text-red-600 text-xs mt-2">Something went wrong. Please try again.</p>
                )}
              </form>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForumThread;
