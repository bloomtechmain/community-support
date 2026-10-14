import React from 'react';
import { WEBSITE_URL } from '../api';

const Footer = () => (
  <footer className="bg-[#0e3b5e] py-8 px-5 sm:px-6 md:px-10 text-center">
    <p className="text-blue-100/60 text-sm">
      &copy; {new Date().getFullYear()} BloomAudit Community Support &middot;{' '}
      <a href={WEBSITE_URL} className="text-[#00cba9] hover:underline">
        Back to BloomAudit
      </a>
    </p>
    <p className="text-blue-100/50 text-xs mt-2">
      Need more help? Contact BloomAudit support at{' '}
      <a href="mailto:info@bloomaudit.com" className="text-[#00cba9] hover:underline">
        info@bloomaudit.com
      </a>
    </p>
  </footer>
);

export default Footer;
