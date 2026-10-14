import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaRocket, FaUsers, FaFileInvoiceDollar, FaShieldAlt, FaCheck,
  FaBookOpen, FaDownload, FaLock, FaDatabase, FaHistory, FaStar,
} from 'react-icons/fa';
import dashboardShot from '../../assets/screenshots/advanced-analytics.png';
import statementsShot from '../../assets/screenshots/financial-statements.png';
import { PLAN_GUIDES, PLAN_TIERS, FEATURE_GUIDES } from '../../guides';
import WebsiteLink from '../WebsiteLink';
import { EASE, containerClass, fadeUp, popIn, stagger } from '../../motion';

// The sections of apps/website's /resources/guides page, kept in the same
// order and wording so both pages describe the guides the same way.

const inView = { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.15 } };

const slideIn = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

const chevronFirst = 'polygon(0 0, calc(100% - 26px) 0, 100% 50%, calc(100% - 26px) 100%, 0 100%)';
const chevronNext = 'polygon(0 0, calc(100% - 26px) 0, 100% 50%, calc(100% - 26px) 100%, 0 100%, 26px 50%)';

export const Eyebrow = ({ children, dark, centered }) => {
  const tone = dark ? 'text-bloom-teal' : 'text-bloom-teal-deep';
  const rule = dark ? 'bg-bloom-teal' : 'bg-bloom-teal-deep';
  return (
    <p className={`${tone} font-bold tracking-widest text-sm uppercase mb-2 flex items-center gap-2 ${centered ? 'justify-center' : ''}`}>
      <span className={`w-6 h-px ${rule}`} /> {children} {centered && <span className={`w-6 h-px ${rule}`} />}
    </p>
  );
};

// Downloadable plan guides — click a plan on the roadmap and the guides it
// includes stay lit while the rest fade.
export const PlanGuides = () => {
  // Defaults to Enterprise so a first-time visitor sees every guide highlighted.
  const [selectedTier, setSelectedTier] = useState(3);

  return (
    <section id="plan-guides" className="relative py-20 bg-white overflow-hidden scroll-mt-20">
      <div aria-hidden="true" className="hidden lg:block absolute -top-56 -right-56 w-[620px] h-[620px] rounded-full bg-bloom-teal/10 pointer-events-none" />
      <div className={containerClass}>
        <div className="text-center mb-12">
          <Eyebrow centered>Free downloads</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-extrabold text-bloom-navy mb-4">Learn BloomAudit, Plan by Plan</h2>
          <p className="text-lg text-gray-800 max-w-2xl mx-auto">
            Five guides, in order — each one picks up exactly where the last left off, so by the guide you land on your plan, you already understand everything below it.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-12">
          <p className="text-center text-sm font-bold text-gray-700 mb-5">
            Guides are cumulative — pick your plan and we&apos;ll highlight exactly which ones are yours.
          </p>
          <div className="grid grid-cols-2 gap-3 md:flex md:gap-0">
            {PLAN_TIERS.map((tier, i) => {
              const isActive = i <= selectedTier;
              const isCurrent = i === selectedTier;
              return (
                <button
                  key={tier.key}
                  type="button"
                  onClick={() => setSelectedTier(i)}
                  aria-pressed={isCurrent}
                  className={`md:flex-1 h-28 flex flex-col items-center justify-center gap-1 rounded-xl md:rounded-none md:[clip-path:var(--chevron)] transition-colors duration-300 ${i > 0 ? 'md:-ml-4 md:pl-9 md:pr-6' : 'md:pl-4 md:pr-6 md:rounded-l-xl'} ${
                    isCurrent ? 'bg-bloom-teal text-white' : isActive ? 'bg-bloom-navy text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ '--chevron': i === 0 ? chevronFirst : chevronNext }}
                >
                  <span className={`font-mono text-2xl font-bold leading-none ${isCurrent ? 'text-white' : isActive ? 'text-bloom-teal' : 'text-gray-600'}`}>{i + 1}</span>
                  <span className="text-base font-bold">{tier.label}</span>
                  <span className="text-xs font-semibold opacity-80">Guides 1–{tier.through + 1}</span>
                </button>
              );
            })}
          </div>
          <p className="text-center text-sm text-gray-700 mt-5">
            Not sure which plan you are on?{' '}
            <WebsiteLink path="/pricing">Compare plans on bloomaudit.com</WebsiteLink>
          </p>
        </div>

        <motion.div variants={stagger(0.08, 0.1)} {...inView} className="border-b border-gray-200">
          {PLAN_GUIDES.map((guide) => {
            const isBonus = guide.tierIndex === null;
            const included = isBonus || guide.tierIndex <= selectedTier;
            return (
              <motion.div
                key={guide.title}
                variants={fadeUp}
                className={`flex flex-col md:flex-row md:items-center gap-5 md:gap-8 py-7 border-t border-gray-200 transition-opacity duration-300 ${included ? '' : 'opacity-40'}`}
              >
                <span className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-2xl font-bold ${
                  isBonus ? 'bg-bloom-navy text-bloom-teal' : included ? 'bg-bloom-teal text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {isBonus ? <FaStar size={22} /> : guide.badge}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                    <h3 className="text-xl font-bold text-bloom-navy inline-flex items-center gap-2">
                      <guide.icon className="text-bloom-teal-deep" size={16} /> {guide.title}
                    </h3>
                    {isBonus ? (
                      <span className="text-[11px] font-bold uppercase tracking-wide text-bloom-navy bg-gray-100 px-2.5 py-1 rounded-full">Works with any plan</span>
                    ) : included ? (
                      <span className="text-[11px] font-bold uppercase tracking-wide text-bloom-teal-deep bg-bloom-teal/10 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"><FaCheck size={9} /> Included in your plan</span>
                    ) : (
                      <span className="text-[11px] font-bold uppercase tracking-wide text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">Not in your plan yet</span>
                    )}
                  </div>
                  <p className="text-gray-800 leading-relaxed">{guide.desc}</p>
                </div>
                <a
                  href={guide.file}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start md:self-auto px-6 py-3 bg-bloom-teal text-white rounded-xl font-bold text-sm hover:bg-bloom-teal-deep transition-colors inline-flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <FaDownload /> Download PDF
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

// One small, focused how-to per module (navy).
export const FeatureGuides = () => (
  <section id="feature-guides" className="relative py-20 overflow-hidden bg-bloom-navy-deep scroll-mt-20">
    <div aria-hidden="true" className="hidden lg:block absolute -bottom-64 -right-56 w-[680px] h-[680px] rounded-full bg-white/5 pointer-events-none" />
    <div className={containerClass}>
      <div className="text-center mb-14">
        <Eyebrow dark centered>Feature guides</Eyebrow>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">One Guide Per Feature</h2>
        <p className="text-lg text-blue-50 max-w-2xl mx-auto">
          Short, focused walkthroughs of individual modules — each one includes a worked example and a checklist so you can verify the result for yourself.
        </p>
      </div>

      <motion.div variants={stagger(0.08, 0.1)} {...inView} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 lg:gap-x-14">
        {FEATURE_GUIDES.map((guide) => (
          <motion.div key={guide.title} variants={fadeUp} className="flex gap-5 py-8 border-t border-white/10">
            <span className="w-14 h-14 rounded-full bg-white/10 text-bloom-teal flex items-center justify-center text-xl flex-shrink-0">
              <guide.icon />
            </span>
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-white mb-2">{guide.title}</h3>
              <p className="text-blue-50 leading-relaxed mb-4">{guide.desc}</p>
              <a
                href={guide.file}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm font-bold text-bloom-teal hover:text-white transition-colors"
              >
                <FaDownload size={12} /> Download PDF
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-6 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-blue-50">Looking for a module that has no guide yet?</p>
        <WebsiteLink path="/modules" tone="dark">See every module on bloomaudit.com</WebsiteLink>
      </div>
    </div>
  </section>
);

const STEPS = [
  { title: 'Sign Up & Setup', description: 'Create your account in seconds and select your business type. Your Chart of Accounts and tax tables are ready the moment you register.', icon: FaRocket },
  { title: 'Connect Your Banks', description: 'Securely link your bank accounts. Bloom Audit automatically imports transactions, categorizes them, and prepares them for reconciliation.', icon: FaShieldAlt },
  { title: 'Manage Invoices', description: 'Create professional invoices with custom branding. Set up recurring payments and automatic reminders to get paid faster.', icon: FaFileInvoiceDollar },
  { title: 'Collaborate', description: 'Invite your accountant or team members. Assign roles and permissions to ensure everyone has the right access level.', icon: FaUsers, done: true },
];

// Four filled chevrons (white).
export const HowBloomWorks = () => (
  <section className="relative py-20 bg-white overflow-hidden">
    <div aria-hidden="true" className="hidden lg:block absolute -bottom-48 -left-48 w-[460px] h-[460px] rounded-full bg-bloom-navy/5 pointer-events-none" />
    <div className={containerClass}>
      <div className="text-center mb-14">
        <Eyebrow centered>Four steps</Eyebrow>
        <h2 className="text-4xl md:text-5xl font-extrabold text-bloom-navy mb-4">How Bloom Works</h2>
        <p className="text-lg text-gray-800 max-w-xl mx-auto">Simplifying complex accounting into four easy steps.</p>
      </div>

      {/* Desktop: a row of chevrons with each step's detail beneath it */}
      <motion.div variants={stagger(0.15, 0.1)} {...inView} className="hidden lg:block">
        <div className="flex">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              variants={slideIn}
              className={`flex-1 h-32 flex items-center gap-4 text-white ${i > 0 ? '-ml-4 pl-12 pr-8' : 'pl-7 pr-8 rounded-l-2xl'} ${step.done ? 'bg-bloom-teal' : 'bg-bloom-navy'}`}
              style={{ clipPath: i === 0 ? chevronFirst : chevronNext }}
            >
              <step.icon className={`text-3xl flex-shrink-0 ${step.done ? 'text-white' : 'text-bloom-teal'}`} />
              <span className="text-lg font-bold leading-tight">{step.title}</span>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-4 mt-8">
          {STEPS.map((step, i) => (
            <motion.div key={step.title} variants={fadeUp} className="pr-8 pl-7 border-l-2 border-gray-200">
              <p className="font-mono text-sm font-bold text-bloom-teal-deep mb-2">0{i + 1}</p>
              <p className="text-gray-800 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mobile and tablet: the same steps as stacked filled blocks */}
      <motion.div variants={stagger(0.12, 0.1)} {...inView} className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        {STEPS.map((step, i) => (
          <motion.div key={step.title} variants={fadeUp} className={`rounded-2xl p-6 text-white ${step.done ? 'bg-bloom-teal' : 'bg-bloom-navy'}`}>
            <div className="flex items-center gap-3 mb-3">
              <step.icon className={`text-2xl ${step.done ? 'text-white' : 'text-bloom-teal'}`} />
              <span className={`font-mono text-sm font-bold ${step.done ? 'text-white/70' : 'text-bloom-teal'}`}>0{i + 1}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className={`leading-relaxed ${step.done ? 'text-white/90' : 'text-blue-50'}`}>{step.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10 text-center">
        <WebsiteLink path="/support/onboarding">Read more about getting set up</WebsiteLink>
      </div>
    </div>
  </section>
);

const DASHBOARD_POINTS = ['Customizable Widgets', 'Real-time Cash Flow', 'One-Click Reports'];

const REPORT_POINTS = [
  { title: 'P&L Statements', sub: 'Generated instantly' },
  { title: 'Tax Ready', sub: 'Compliance built-in', accent: true },
];

// The real analytics and statements screens, not mocks.
export const ProductScreens = () => (
  <>
    <section className="relative py-20 overflow-hidden bg-bloom-navy">
      <div aria-hidden="true" className="hidden lg:block absolute -top-64 -left-56 w-[680px] h-[680px] rounded-full bg-white/5 pointer-events-none" />
      <div className={`${containerClass} grid grid-cols-1 lg:grid-cols-2 gap-14 items-center`}>
        <motion.div variants={stagger(0.12, 0.1)} {...inView}>
          <motion.div variants={fadeUp}><Eyebrow dark>Dashboard</Eyebrow></motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Your Financial Command Center</motion.h2>
          <motion.p variants={fadeUp} className="text-blue-50 text-lg mb-8 leading-relaxed max-w-xl">
            The Bloom Audit dashboard gives you a bird&apos;s-eye view of your business health. Customize widgets to see exactly what matters most to you: cash flow, pending invoices, or expense breakdowns.
          </motion.p>
          <ul className="max-w-xl divide-y divide-white/10 border-t border-b border-white/10 list-none p-0 m-0">
            {DASHBOARD_POINTS.map((item) => (
              <motion.li key={item} variants={fadeUp} className="flex items-center gap-3 py-3.5 text-white font-bold">
                <span className="w-7 h-7 rounded-full bg-bloom-teal text-white flex items-center justify-center flex-shrink-0">
                  <FaCheck size={11} />
                </span>
                {item}
              </motion.li>
            ))}
          </ul>
          <motion.div variants={fadeUp} className="mt-8">
            <WebsiteLink path="/modules/analytics" tone="dark">Explore Advanced Analytics</WebsiteLink>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE }}>
          <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
            <img src={dashboardShot} alt="BloomAudit Advanced Analytics dashboard" className="w-full h-auto block" loading="lazy" />
          </div>
          <p className="mt-4 text-sm text-blue-100">The Advanced Analytics dashboard in Bloom Audit.</p>
        </motion.div>
      </div>
    </section>

    <section className="relative py-20 bg-white overflow-hidden">
      <div aria-hidden="true" className="hidden lg:block absolute -bottom-56 -right-40 w-[560px] h-[560px] rounded-full bg-bloom-teal/10 pointer-events-none" />
      <div className={`${containerClass} grid grid-cols-1 lg:grid-cols-2 gap-14 items-center`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="order-2 lg:order-1"
        >
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-2xl">
            <img src={statementsShot} alt="BloomAudit financial statements" className="w-full h-auto block" loading="lazy" />
          </div>
          <p className="mt-4 text-sm text-gray-700">Financial statements in Bloom Audit.</p>
        </motion.div>

        <motion.div variants={stagger(0.12, 0.1)} {...inView} className="order-1 lg:order-2">
          <motion.div variants={fadeUp}><Eyebrow>Reporting</Eyebrow></motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-bloom-navy mb-6 leading-tight">Insights That Drive Growth</motion.h2>
          <motion.p variants={fadeUp} className="text-gray-800 text-lg mb-8 leading-relaxed max-w-xl">
            Stop guessing and start knowing. Our advanced reporting tools generate detailed financial statements, audit trails, and tax reports in seconds.
          </motion.p>
          <div className="grid grid-cols-2 gap-4 max-w-xl">
            {REPORT_POINTS.map((point) => (
              <motion.div key={point.title} variants={popIn} className={`rounded-2xl px-6 py-6 text-white ${point.accent ? 'bg-bloom-teal' : 'bg-bloom-navy'}`}>
                <h3 className="text-xl font-extrabold mb-1">{point.title}</h3>
                <p className={`text-sm font-semibold ${point.accent ? 'text-white/90' : 'text-blue-50'}`}>{point.sub}</p>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeUp} className="mt-8">
            <WebsiteLink path="/modules/general-ledger">See the General Ledger module</WebsiteLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  </>
);

// Platform facts, worded as on the website's Security page.
const FOUNDATIONS = [
  { title: 'Encrypted In Transit', desc: 'All traffic is forced to HTTPS with HSTS, every request between you and Bloom Audit is TLS/SSL encrypted.', icon: FaLock },
  { title: 'Complete Data Isolation', desc: 'Every business\'s data is kept fully separate, your data is never mixed with anyone else\'s.', icon: FaDatabase, accent: true },
  { title: 'Full Audit Trail', desc: 'Every financial transaction records who, what, when, the old value, the new value, and the IP address.', icon: FaHistory },
];

export const Foundations = () => (
  <section className="relative py-20 bg-bloom-navy-deep text-white overflow-hidden">
    <div aria-hidden="true" className="hidden lg:block absolute -top-56 -right-56 w-[620px] h-[620px] rounded-full bg-white/5 pointer-events-none" />
    <div className={containerClass}>
      <div className="text-center mb-14">
        <Eyebrow dark centered>Under the hood</Eyebrow>
        <h2 className="text-4xl md:text-5xl font-extrabold">Built on Modern Tech</h2>
      </div>
      <motion.div variants={stagger(0.15, 0.1)} {...inView} className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-white/10">
        {FOUNDATIONS.map((item) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            className="py-10 md:px-10 border-white/10 border-b last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 md:first:pl-0"
          >
            <span className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-6 ${item.accent ? 'bg-bloom-teal text-white' : 'bg-white/10 text-bloom-teal'}`}>
              <item.icon />
            </span>
            <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
            <p className="text-blue-50 leading-relaxed max-w-sm">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-8 text-center">
        <WebsiteLink path="/security" tone="dark">See the full security overview</WebsiteLink>
      </div>
    </div>
  </section>
);

// This app has no sign-up, so the closing button goes to the website's plans.
export const GuidesCta = () => (
  <section className="relative py-20 bg-white overflow-hidden">
    <div aria-hidden="true" className="hidden lg:block absolute -bottom-56 -left-40 w-[520px] h-[520px] rounded-full bg-bloom-navy/5 pointer-events-none" />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`${containerClass} flex flex-col lg:flex-row lg:items-center justify-between gap-8`}
    >
      <div className="flex items-start gap-6">
        <span className="hidden sm:flex w-20 h-20 rounded-full bg-bloom-navy text-bloom-teal items-center justify-center text-3xl flex-shrink-0">
          <FaBookOpen />
        </span>
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-bloom-navy mb-3">Ready to Master Bloom Audit?</h2>
          <p className="text-lg text-gray-800 max-w-2xl">
            Pick a plan and follow the guides in order, starting with the Starter Plan Guide.
          </p>
        </div>
      </div>
      <div className="self-start lg:self-auto flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-shrink-0">
        <WebsiteLink path="/pricing" variant="button" className="px-10 py-4 text-lg">See plans and pricing</WebsiteLink>
        <WebsiteLink>Visit bloomaudit.com</WebsiteLink>
      </div>
    </motion.div>
  </section>
);
