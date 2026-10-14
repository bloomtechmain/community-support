import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBook, FaComments, FaArrowLeft } from 'react-icons/fa';
import { WEBSITE_URL } from '../api';

const NAV_LINKS = [
  { to: '/community', label: 'Forum', icon: FaComments },
  { to: '/kb', label: 'Knowledge Base', icon: FaBook },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-[#0e3b5e]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="text-white font-extrabold text-xl sm:text-2xl no-underline">
          <span className="text-[#00cba9]">Bloom</span>Audit Community
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((link) => {
            const active = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold no-underline transition-all ${
                  active ? 'bg-[#00cba9] text-white' : 'text-blue-100/80 hover:bg-white/10'
                }`}
              >
                <link.icon className="text-xs" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
          <a
            href={WEBSITE_URL}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold text-blue-100/70 hover:text-white no-underline transition-all"
          >
            <FaArrowLeft className="text-xs" /> <span className="hidden sm:inline">BloomAudit</span>
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
