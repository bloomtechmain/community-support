import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaComments, FaBook, FaArrowRight } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NavyBackdrop from '../components/NavyBackdrop';
import ForumPreview from '../components/home/ForumPreview';
import TopicBars from '../components/home/TopicBars';
import HowItWorks from '../components/home/HowItWorks';
import API_URL from '../api';
import { containerClass, fadeUp, inView, popIn, stagger } from '../motion';

const Home = () => {
  // null while loading, so the hero counters and diagrams can tell "loading" from "empty".
  const [questions, setQuestions] = useState(null);
  const [topics, setTopics] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/community/questions`)
      .then((res) => res.json())
      .then((data) => setQuestions(data.questions || []))
      .catch(() => setQuestions([]));
    fetch(`${API_URL}/api/kb/topics`)
      .then((res) => res.json())
      .then((data) => setTopics(data.topics || []))
      .catch(() => setTopics([]));
  }, []);

  const articleCount = topics ? topics.reduce((sum, t) => sum + Number(t.article_count || 0), 0) : null;

  const areas = [
    {
      icon: FaComments,
      caption: 'Community Forum',
      title: 'Ask the people who use Bloom every day',
      text: 'Post a question and other BloomAudit users reply. You do not need an account to ask or to answer.',
      to: '/community',
      cta: 'Browse the forum',
      accent: true,
      diagram: <ForumPreview questions={questions} />,
    },
    {
      icon: FaBook,
      caption: 'Knowledge Base',
      title: 'Step-by-step answers from our team',
      text: 'Short guides grouped by area of the product: accounting, banking, sales, payroll and the rest.',
      to: '/kb',
      cta: 'Browse all topics',
      diagram: <TopicBars topics={topics} />,
    },
  ];

  return (
    <div className="font-sans overflow-x-hidden bg-white">
      <Header />

      {/* Hero — headline beside two filled counters */}
      <section className="relative overflow-hidden bg-bloom-navy pt-36 pb-20">
        <NavyBackdrop />
        <div className={`${containerClass} grid grid-cols-1 lg:grid-cols-12 gap-14 items-center`}>
          <motion.div variants={stagger()} initial="hidden" animate="visible" className="lg:col-span-7">
            <motion.p variants={fadeUp} className="text-xs md:text-sm font-bold tracking-[0.3em] text-bloom-teal uppercase mb-4">
              Community Support
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white mb-6 leading-tight">
              Answers from our team,
              <span className="block text-bloom-teal">and from each other.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-blue-50 mb-10 leading-relaxed max-w-2xl">
              Ask other BloomAudit users in the forum, or read the step-by-step guides in the Knowledge Base.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Link
                to="/community?ask=1"
                className="group px-10 py-4 bg-bloom-teal text-white rounded-xl font-bold text-lg hover:bg-bloom-teal-deep transition-colors inline-flex items-center gap-2"
              >
                Ask a question <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/kb" className="group text-white font-bold inline-flex items-center gap-2 hover:text-bloom-teal transition-colors">
                Browse the Knowledge Base <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={stagger(0.15, 0.3)} initial="hidden" animate="visible" className="lg:col-span-5 flex items-center justify-center lg:justify-end gap-5 sm:gap-8">
            <motion.div variants={popIn} className="w-36 h-36 sm:w-52 sm:h-52 rounded-full bg-bloom-teal text-white flex flex-col items-center justify-center text-center">
              <span className="text-5xl sm:text-7xl font-extrabold leading-none">{questions ? questions.length : '–'}</span>
              <span className="text-xs sm:text-sm font-bold mt-2">questions asked</span>
            </motion.div>
            <motion.div variants={popIn} className="w-36 h-36 sm:w-52 sm:h-52 rounded-full bg-white/10 text-white flex flex-col items-center justify-center text-center">
              <span className="text-5xl sm:text-7xl font-extrabold leading-none">{articleCount ?? '–'}</span>
              <span className="text-xs sm:text-sm font-bold mt-2 text-bloom-teal">guides written</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The two areas, as open columns split by a hairline, each with a live diagram */}
      <section className="relative bg-white py-20 overflow-hidden">
        <div aria-hidden="true" className="hidden lg:block absolute -top-56 -right-56 w-[620px] h-[620px] rounded-full bg-bloom-teal/10 pointer-events-none" />
        <motion.div variants={stagger(0.15)} {...inView} className={`${containerClass} grid grid-cols-1 md:grid-cols-2 border-t border-b border-gray-200`}>
          {areas.map((area) => (
            <motion.div
              key={area.caption}
              variants={fadeUp}
              className="py-12 md:px-10 md:first:pl-0 md:last:pr-0 flex flex-col border-gray-200 border-b last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${area.accent ? 'bg-bloom-teal text-white' : 'bg-bloom-navy text-bloom-teal'}`}>
                  <area.icon />
                </span>
                <p className="text-xs font-bold uppercase tracking-widest text-bloom-teal-deep">{area.caption}</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-bloom-navy leading-tight mb-3">{area.title}</h2>
              <p className="text-gray-800 leading-relaxed mb-8 max-w-lg">{area.text}</p>
              <div className="flex-grow mb-8">{area.diagram}</div>
              <Link to={area.to} className="group text-bloom-teal-deep font-bold inline-flex items-center gap-2 self-start">
                {area.cta} <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <HowItWorks />

      <Footer />
    </div>
  );
};

export default Home;
