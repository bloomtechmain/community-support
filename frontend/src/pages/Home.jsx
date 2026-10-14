import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaComments, FaBook, FaUsers, FaArrowRight } from 'react-icons/fa';
import communityNetworkImg from '../assets/community-network.jpg';

const HUB_CARDS = [
  {
    icon: FaComments,
    title: 'Community Forum',
    description: 'Ask a question and get answers from other Bloom users. No account needed — anyone can post or reply.',
    to: '/community',
    cta: 'Browse the forum',
    accent: 'from-[#00cba9] to-[#00a389]',
  },
  {
    icon: FaBook,
    title: 'Knowledge Base',
    description: 'Browse our own step-by-step Q&A, organized by topic — Home, Accounting, Banking, Sales, and more.',
    to: '/kb',
    cta: 'Browse topics',
    accent: 'from-[#1c3bd8] to-[#0e3b5e]',
  },
];

const Home = () => {
  return (
    <div className="font-sans overflow-x-hidden bg-white">
      <Header />

      <section className="relative min-h-[50vh] lg:min-h-[64vh] flex items-center pt-16 sm:pt-20 pb-14 sm:pb-20 px-5 sm:px-6 md:px-12 lg:px-20 overflow-hidden bg-[#0e3b5e]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 flex justify-center">
            <img
              src={communityNetworkImg}
              alt=""
              className="w-full max-w-[1600px] h-full object-cover object-center opacity-50 grayscale"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0e3b5e]/85 via-[#1c3bd8]/40 to-[#0e3b5e]/90" />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#00cba9]/20 rounded-full blur-[120px]"
          />
        </div>
        <div className="max-w-5xl mx-auto w-full relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#00cba9]/10 border border-[#00cba9]/30 text-[#00cba9] font-bold text-xs sm:text-sm mb-6 sm:mb-8 tracking-wide uppercase backdrop-blur-md"
          >
            <FaUsers /> Community Support
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-white"
          >
            Answers, from us <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00cba9] to-blue-400">and each other.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed px-2"
          >
            Ask fellow Bloom users a question in the community forum, or browse our own curated Q&A knowledge base.
          </motion.p>
        </div>
      </section>

      <section className="py-14 sm:py-20 md:py-24 px-5 sm:px-6 md:px-12 lg:px-20 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {HUB_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all p-8 sm:p-10 flex flex-col"
            >
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${card.accent}`} />
              <div
                className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${card.accent} opacity-[0.07] blur-2xl group-hover:opacity-[0.14] transition-opacity`}
              />

              <div
                className={`relative bg-gradient-to-br ${card.accent} p-4 rounded-2xl text-white text-3xl shadow-lg w-fit mb-6 group-hover:scale-110 transition-transform`}
              >
                <card.icon />
              </div>
              <h3 className="text-2xl font-bold text-[#0e3b5e] mb-3">{card.title}</h3>
              <p className="text-gray-600 mb-8 leading-relaxed flex-1">{card.description}</p>
              <Link
                to={card.to}
                className={`relative inline-flex items-center justify-center gap-2 bg-gradient-to-r ${card.accent} text-white font-bold py-3 px-8 rounded-full text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 no-underline w-fit`}
              >
                {card.cta}
                <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
