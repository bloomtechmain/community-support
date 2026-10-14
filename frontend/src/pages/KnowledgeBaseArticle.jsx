import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaChevronRight, FaComments } from 'react-icons/fa';
import WebsiteLink from '../components/WebsiteLink';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NavyBackdrop from '../components/NavyBackdrop';
import API_URL from '../api';
import { containerClass, fadeUp, stagger } from '../motion';

// The seed content only ever uses **bold** markers (no other markdown), so a
// small regex split is enough — pulling in a full markdown library would be
// unwarranted for this.
const renderBody = (body) => {
  const parts = body.split(/(\*\*.+?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-bloom-navy">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
};

const KnowledgeBaseArticle = () => {
  const { slug, id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`${API_URL}/api/kb/articles/${id}`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setArticle(data.article);
      })
      .catch((error) => console.error('Error loading KB article:', error))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="font-sans overflow-x-hidden bg-white flex flex-col min-h-screen">
      <Header />

      <section className="relative pt-32 pb-14 overflow-hidden bg-bloom-navy">
        <NavyBackdrop />
        <motion.div variants={stagger(0.1)} initial="hidden" animate="visible" className={`${containerClass} max-w-3xl mx-auto`}>
          <motion.nav variants={fadeUp} aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-blue-100 mb-6">
            <Link to="/kb" className="hover:text-bloom-teal transition-colors">Knowledge Base</Link>
            <FaChevronRight size={9} />
            <Link to={`/kb/${slug}`} className="hover:text-bloom-teal transition-colors">{article ? article.topic_name : 'Topic'}</Link>
          </motion.nav>
          <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            {article ? article.title : ' '}
          </motion.h1>
          {article && (
            <motion.p variants={fadeUp} className="text-sm text-blue-100">
              Updated {new Date(article.updated_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
            </motion.p>
          )}
        </motion.div>
      </section>

      <section className="flex-1 bg-white py-14">
        <div className={`${containerClass} max-w-3xl mx-auto`}>
          {loading ? (
            <p className="text-gray-700">Loading…</p>
          ) : notFound ? (
            <div>
              <p className="text-lg text-gray-800 mb-5">This guide could not be found.</p>
              <Link to={`/kb/${slug}`} className="group text-bloom-teal-deep font-bold inline-flex items-center gap-2">
                Back to the topic <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <>
              <p className="text-lg text-gray-800 leading-8 whitespace-pre-wrap">{renderBody(article.body)}</p>

              {/* Next step when the guide did not cover it */}
              <div className="mt-14 pt-8 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center gap-5">
                <span className="w-14 h-14 rounded-full bg-bloom-navy text-bloom-teal flex items-center justify-center text-xl flex-shrink-0">
                  <FaComments />
                </span>
                <div className="flex-grow">
                  <p className="text-lg font-extrabold text-bloom-navy">Still stuck?</p>
                  <p className="text-gray-800">Ask other BloomAudit users in the forum.</p>
                </div>
                <Link
                  to="/community?ask=1"
                  className="group self-start sm:self-auto px-6 py-3 bg-bloom-teal text-white rounded-xl font-bold hover:bg-bloom-teal-deep transition-colors inline-flex items-center gap-2"
                >
                  Ask a question <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <WebsiteLink path="/resources/guides">Browse the full guides on bloomaudit.com</WebsiteLink>
                <WebsiteLink path="/contact">Contact BloomAudit support</WebsiteLink>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KnowledgeBaseArticle;
