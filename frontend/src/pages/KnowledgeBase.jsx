import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaBook, FaChevronRight, FaSearch, FaInfoCircle } from 'react-icons/fa';
import API_URL from '../api';
import kbLightbulbImg from '../assets/kb-lightbulb-knowledge.jpg';

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

  return (
    <div className="font-sans overflow-x-hidden bg-white">
      <Header />

      <section className="relative min-h-[35vh] lg:min-h-[55vh] flex items-center pt-16 sm:pt-20 pb-10 sm:pb-14 px-5 sm:px-6 md:px-12 lg:px-20 overflow-hidden bg-[#0e3b5e]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 flex justify-center">
            <img
              src={kbLightbulbImg}
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
            <FaBook /> Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-white">
            Our own Q&A, by topic
          </h1>
          <p className="text-base sm:text-lg text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
            Pick a topic below to see step-by-step answers for that part of Bloom.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-5 sm:px-6 md:px-12 lg:px-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 sm:p-5 text-sm text-gray-600">
            <FaInfoCircle className="text-[#00cba9] mt-0.5 flex-shrink-0" />
            <p>
              <span className="font-semibold text-[#0e3b5e]">How it works: </span>
              Search for a keyword to jump straight to a matching article from any topic, optionally
              narrowed with the topic filter — or clear the search box and browse by topic below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#00cba9] focus:ring-2 focus:ring-[#00cba9]/20 outline-none text-sm transition-all"
              />
            </div>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#00cba9] focus:ring-2 focus:ring-[#00cba9]/20 outline-none text-sm transition-all"
            >
              <option value="">All topics</option>
              {topics.map((t) => (
                <option key={t.slug} value={t.slug}>{t.name}</option>
              ))}
            </select>
          </div>

          {isSearchMode ? (
            searching ? (
              <p className="text-gray-500 text-center py-12">Searching...</p>
            ) : results.length === 0 && searched ? (
              <p className="text-gray-500 text-center py-12">No articles match "{query}".</p>
            ) : (
              <div className="space-y-3">
                {results.map((a) => (
                  <Link
                    key={a.id}
                    to={`/kb/${a.topic_slug}/${a.id}`}
                    className="block bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#00cba9]/30 transition-all no-underline"
                  >
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <h3 className="font-bold text-[#0e3b5e]">{a.title}</h3>
                      <FaChevronRight className="text-[#00cba9] flex-shrink-0" />
                    </div>
                    <p className="text-xs text-[#00cba9] font-semibold uppercase tracking-wide mb-1">{a.topic_name}</p>
                    <p className="text-sm text-gray-500">{snippet(a.body, query)}</p>
                  </Link>
                ))}
              </div>
            )
          ) : loading ? (
            <p className="text-gray-500 text-center py-12">Loading topics...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {topics.map((t) => (
                <Link
                  key={t.id}
                  to={`/kb/${t.slug}`}
                  className="group relative bg-white p-6 rounded-2xl shadow-md border border-[#00cba9]/25 hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline flex items-center justify-between overflow-hidden"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#00cba9] to-[#1c3bd8]" />
                  <div>
                    <h3 className="font-bold text-[#0e3b5e] text-lg">{t.name}</h3>
                    <p className="text-sm text-gray-500">{t.article_count} {t.article_count === 1 ? 'article' : 'articles'}</p>
                  </div>
                  <FaChevronRight className="text-[#00cba9] transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KnowledgeBase;
