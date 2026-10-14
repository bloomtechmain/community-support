import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowRight } from 'react-icons/fa';
import logo from '../assets/bloomlogo.png';
import { WEBSITE_URL } from '../api';
import { fadeUp, stagger } from '../motion';

const EMAILS = ['help@bloomaudit.com', 'info@bloomaudit.com'];

const LINK_GROUPS = [
  {
    title: 'Community',
    links: [
      { label: 'Forum', to: '/community' },
      { label: 'Ask a question', to: '/community?ask=1' },
      { label: 'Knowledge Base', to: '/kb' },
    ],
  },
  {
    title: 'BloomAudit',
    links: [
      { label: 'Website', href: WEBSITE_URL },
      { label: 'Pricing', href: `${WEBSITE_URL}/pricing` },
      { label: 'FAQ', href: `${WEBSITE_URL}/faq` },
      { label: 'Contact us', href: `${WEBSITE_URL}/contact` },
    ],
  },
];

const linkClass = 'group inline-flex items-center gap-2 text-blue-50 hover:text-bloom-teal transition-colors';

const LinkArrow = () => (
  <FaArrowRight size={9} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
);

const Footer = () => (
  <footer className="relative overflow-hidden bg-bloom-navy text-white pt-16 font-sans">
    <motion.div
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="relative z-10 w-full px-4 sm:px-8 lg:px-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12">
        <motion.div variants={fadeUp} className="lg:col-span-5 lg:pr-12">
          <Link to="/" className="inline-block mb-5">
            <img src={logo} alt="Bloom Audit" className="h-14 w-auto object-contain" />
          </Link>
          <p className="text-blue-50 leading-relaxed max-w-sm mb-7">
            Questions answered by other BloomAudit users, and step-by-step guides from our team.
          </p>
          <ul className="space-y-3 text-sm text-blue-50">
            {EMAILS.map((email) => (
              <li key={email}>
                <a href={`mailto:${email}`} className="inline-flex items-center gap-3 hover:text-bloom-teal transition-colors">
                  <FaEnvelope className="text-bloom-teal flex-shrink-0" size={13} /> {email}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Link columns, divided by hairlines rather than boxed */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-y-10">
          {LINK_GROUPS.map((group) => (
            <motion.div key={group.title} variants={fadeUp} className="pr-4 lg:pl-8 lg:border-l lg:border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-widest text-bloom-teal mb-5">{group.title}</h4>
              <ul className="space-y-3 text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className={linkClass}>{link.label} <LinkArrow /></Link>
                    ) : (
                      <a href={link.href} className={linkClass}>{link.label} <LinkArrow /></a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        variants={fadeUp}
        className="mt-14 py-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-blue-100 gap-4"
      >
        <p>Copyright © {new Date().getFullYear()} BloomAudit LLC. All rights reserved.</p>
        <div className="flex gap-6">
          <a href={`${WEBSITE_URL}/terms-and-conditions`} className="hover:text-white transition-colors">Terms of Use</a>
          <a href={`${WEBSITE_URL}/privacy-policy`} className="hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </motion.div>
    </motion.div>

    {/* Oversized faded wordmark, cropped by the footer's lower edge */}
    <div aria-hidden="true" className="relative z-0 -mt-[2vw] md:-mt-[5vw] flex justify-center pointer-events-none select-none">
      <span className="-mb-[2vw] whitespace-nowrap font-extrabold tracking-tight leading-none text-[17.5vw] text-white/[0.06]">
        BloomAudit
      </span>
    </div>
  </footer>
);

export default Footer;
