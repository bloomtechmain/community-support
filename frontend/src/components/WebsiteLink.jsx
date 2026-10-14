import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { WEBSITE_URL } from '../api';

// Shortcut to a page on the BloomAudit website. Opens in a new tab so the
// reader keeps their place here.
//   tone: 'light' on white sections, 'dark' on navy sections
//   variant: 'text' (inline link) or 'button' (solid teal)
const WebsiteLink = ({ path = '', children, tone = 'light', variant = 'text', className = '' }) => {
  const href = `${WEBSITE_URL}${path}`;

  if (variant === 'button') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-bloom-teal text-white hover:bg-bloom-teal-deep transition-colors ${className}`}
      >
        {children}
        <FaExternalLinkAlt size={11} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
      </a>
    );
  }

  const color = tone === 'dark' ? 'text-bloom-teal hover:text-white' : 'text-bloom-teal-deep hover:text-bloom-navy';
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2 font-bold transition-colors ${color} ${className}`}
    >
      {children}
      <FaExternalLinkAlt size={10} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
    </a>
  );
};

export default WebsiteLink;
