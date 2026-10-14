import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaArrowLeft } from 'react-icons/fa';
import API_URL from '../api';

// The seed content only ever uses **bold** markers (no other markdown), so a
// small regex split is enough — pulling in a full markdown library would be
// unwarranted for this.
const renderBody = (body) => {
  const parts = body.split(/(\*\*.+?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
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
    <div className="font-sans overflow-x-hidden bg-white">
      <Header />

      <section className="pt-16 sm:pt-20 pb-14 sm:pb-20 px-5 sm:px-6 md:px-12 lg:px-20 bg-gray-50 min-h-[60vh]">
        <div className="max-w-3xl mx-auto">
          <Link to={`/kb/${slug}`} className="inline-flex items-center gap-2 text-[#00cba9] font-bold text-sm my-8 no-underline hover:underline">
            <FaArrowLeft /> Back to {article ? article.topic_name : 'topic'}
          </Link>

          {loading ? (
            <p className="text-gray-500 text-center py-12">Loading...</p>
          ) : notFound ? (
            <p className="text-gray-500 text-center py-12">This article could not be found.</p>
          ) : (
            <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-gray-100">
              <p className="text-sm text-gray-400 mb-3">
                Last updated: {new Date(article.updated_at).toLocaleDateString()}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0e3b5e] mb-6">{article.title}</h1>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{renderBody(article.body)}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KnowledgeBaseArticle;
