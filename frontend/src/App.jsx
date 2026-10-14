import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Forum from './pages/Forum';
import ForumThread from './pages/ForumThread';
import KnowledgeBase from './pages/KnowledgeBase';
import KnowledgeBaseTopic from './pages/KnowledgeBaseTopic';
import KnowledgeBaseArticle from './pages/KnowledgeBaseArticle';

function App() {
  return (
    <Router>
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
