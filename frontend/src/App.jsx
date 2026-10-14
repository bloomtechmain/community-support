import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Forum from './pages/Forum';
import ForumThread from './pages/ForumThread';
import KnowledgeBase from './pages/KnowledgeBase';
import KnowledgeBaseTopic from './pages/KnowledgeBaseTopic';
import KnowledgeBaseArticle from './pages/KnowledgeBaseArticle';

// Start each page at the top; ?ask=1 links scroll to the form themselves.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Forum />} />
        <Route path="/community/:id" element={<ForumThread />} />
        <Route path="/kb" element={<KnowledgeBase />} />
        <Route path="/kb/:slug" element={<KnowledgeBaseTopic />} />
        <Route path="/kb/:slug/:id" element={<KnowledgeBaseArticle />} />
      </Routes>
    </Router>
  );
}

export default App
