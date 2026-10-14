import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
import logo from '../assets/bloomlogo.png';
import { WEBSITE_URL } from '../api';

const NAV_LINKS = [
  { to: '/community', label: 'Forum' },
  { to: '/kb', label: 'Knowledge Base' },
];

// Always white and solid, like the website's navbar — no transparent-over-hero mode.
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-md py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between font-sans">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src={logo} alt="Bloom Audit" className="h-12 w-auto object-contain" />
          <span className="hidden sm:block pl-3 border-l border-gray-200 text-sm font-bold text-bloom-navy leading-tight">
            Community<br />Support
          </span>
        </Link>
        <ul className="hidden md:flex gap-6 list-none m-0 p-0 items-center">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `relative block py-4 text-sm font-medium no-underline transition-colors ${
                    isActive ? 'text-bloom-navy' : 'text-gray-800 hover:text-bloom-teal-deep'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && <span className="absolute left-0 right-0 bottom-2 h-0.5 bg-bloom-teal" />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Shortcut to the main website — visible at every width, not tucked into the menu */}
        <a
          href={WEBSITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-bloom-teal text-white text-xs sm:text-sm font-bold hover:bg-bloom-teal-deep transition-colors"
        >
          <span className="sm:hidden">BloomAudit</span>
          <span className="hidden sm:inline">Visit BloomAudit</span>
          <FaExternalLinkAlt size={10} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
        </a>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="md:hidden p-2 rounded-lg text-bloom-navy hover:bg-gray-100 transition-colors"
        >
          <FaBars size={22} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-bloom-navy z-[60] flex flex-col overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <Link to="/" onClick={() => setMenuOpen(false)} className="no-underline">
                <img src={logo} alt="Bloom Audit" className="h-10 w-auto" />
              </Link>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-white p-2">
                <FaTimes size={22} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6 text-white">
              {NAV_LINKS.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="text-lg font-medium no-underline text-white">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="p-6 mt-auto border-t border-white/10">
              <a href={WEBSITE_URL} className="block w-full py-3 border border-white text-white rounded-lg font-bold text-center">
                BloomAudit website
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
