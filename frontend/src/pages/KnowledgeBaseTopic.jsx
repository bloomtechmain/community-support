import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaChevronRight, FaFilePdf } from 'react-icons/fa';
import WebsiteLink from '../components/WebsiteLink';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NavyBackdrop from '../components/NavyBackdrop';
import API_URL from '../api';
import { containerClass, fadeUp, stagger } from '../motion';

const KnowledgeBaseTopic = () => {
  const { slug } = useParams();
  const [topic, setTopic] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`${API_URL}/api/kb/topics/${slug}/articles`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setTopic(data.topic);
        setArticles(data.articles || []);
      })
      .catch((error) => console.error('Error loading KB articles:', error))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="font-sans overflow-x-hidden bg-white flex flex-col min-h-screen">
      <Header />

      <section className="relative pt-32 pb-14 overflow-hidden bg-bloom-navy">
        <NavyBackdrop />
        <motion.div variants={stagger(0.1)} initial="hidden" animate="visible" className={`${containerClass} max-w-4xl mx-auto`}>
          <motion.nav variants={fadeUp} aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-blue-100 mb-6">
            <Link to="/kb" className="hover:text-bloom-teal transition-colors">Knowledge Base</Link>
            <FaChevronRight size={9} />
            <span className="text-white">{topic ? topic.name : 'Topic'}</span>
          </motion.nav>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
            {topic ? topic.name : ' '}
          </motion.h1>
          {topic && (
            <motion.p variants={fadeUp} className="text-bloom-teal font-bold">
              {articles.length} {articles.length === 1 ? 'guide' : 'guides'}
            </motion.p>
          )}
        </motion.div>
      </section>

      <section className="flex-1 bg-white py-10">
        <div className={`${containerClass} max-w-4xl mx-auto`}>
          {loading ? (
            <p className="text-gray-700 py-12">Loading…</p>
          ) : notFound ? (
            <div className="py-16">
              <p className="text-lg text-gray-800 mb-5">This topic could not be found.</p>
              <Link to="/kb" className="group text-bloom-teal-deep font-bold inline-flex items-center gap-2">
                All topics <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : articles.length === 0 ? (
            <p className="py-12 text-lg text-gray-800">There are no guides in this topic yet.</p>
          ) : (
            <motion.ol variants={stagger(0.05)} initial="hidden" animate="visible" className="list-none p-0 m-0">
              {articles.map((a, i) => (
                <motion.li key={a.id} variants={fadeUp} className="border-b border-gray-200">
                  <Link to={`/kb/${slug}/${a.id}`} className="group flex items-center gap-4 sm:gap-5 py-5">
                    <span className="flex-shrink-0 w-12 h-12 rounded-full bg-bloom-navy text-white group-hover:bg-bloom-teal flex items-center justify-center font-mono text-sm font-bold transition-colors duration-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-grow min-w-0 text-lg font-bold text-bloom-navy">{a.title}</span>
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 text-bloom-navy flex items-center justify-center group-hover:bg-bloom-teal group-hover:text-white transition-colors">
                      <FaChevronRight size={11} />
                    </span>
                  </Link>
                </motion.li>
              ))}
            </motion.ol>
          )}

          {/* Shortcuts to the website's guides and home */}
          {!loading && !notFound && (
            <div className="mt-12 rounded-2xl bg-bloom-navy px-6 py-6 sm:px-8 flex flex-col sm:flex-row sm:items-center gap-5">
              <span className="w-12 h-12 rounded-full bg-bloom-teal text-white flex items-center justify-center flex-shrink-0">
                <FaFilePdf />
              </span>
              <div className="flex-grow">
                <p className="text-lg font-extrabold text-white">Prefer a PDF?</p>
                <p className="text-blue-50">Step-by-step guides for every plan and feature.</p>
              </div>
              <div className="flex flex-col sm:items-end gap-2 text-sm">
                <WebsiteLink path="/resources/guides" tone="dark">Download the guides</WebsiteLink>
                <WebsiteLink tone="dark">Visit bloomaudit.com</WebsiteLink>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KnowledgeBaseTopic;
