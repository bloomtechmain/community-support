import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaArrowLeft, FaChevronRight } from 'react-icons/fa';
import API_URL from '../api';

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
    <div className="font-sans overflow-x-hidden bg-white">
      <Header />

      <section className="pt-16 sm:pt-20 pb-14 sm:pb-20 px-5 sm:px-6 md:px-12 lg:px-20 bg-gray-50 min-h-[60vh]">
        <div className="max-w-3xl mx-auto">
          <Link to="/kb" className="inline-flex items-center gap-2 text-[#00cba9] font-bold text-sm my-8 no-underline hover:underline">
            <FaArrowLeft /> Back to topics
          </Link>

          {loading ? (
            <p className="text-gray-500 text-center py-12">Loading...</p>
          ) : notFound ? (
            <p className="text-gray-500 text-center py-12">This topic could not be found.</p>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0e3b5e] mb-8">{topic.name}</h1>
              <div className="space-y-3">
                {articles.map((a) => (
                  <Link
                    key={a.id}
                    to={`/kb/${slug}/${a.id}`}
                    className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#00cba9]/30 transition-all no-underline"
                  >
                    <span className="font-semibold text-[#0e3b5e]">{a.title}</span>
                    <FaChevronRight className="text-[#00cba9] flex-shrink-0 ml-3" />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KnowledgeBaseTopic;
