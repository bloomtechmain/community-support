import {
  FaSeedling, FaRocket, FaBuilding, FaGem, FaBookOpen,
  FaExchangeAlt, FaBook, FaFileInvoice, FaMoneyCheckAlt, FaUniversity,
} from 'react-icons/fa';

// The downloadable PDF guides, mirrored from apps/website's /resources/guides
// page. The PDFs themselves live in public/guides/ (same paths as the website)
// and must be re-copied from apps/website/frontend/public/guides/ whenever
// they change there.

// A-to-Z learning order: each plan guide builds on the one before it, then
// the testing guide ties every feature together in one real-world walkthrough.
// tierIndex marks the earliest plan a guide is required for — guides are
// cumulative, so anyone on tier N needs every guide with tierIndex <= N.
export const PLAN_GUIDES = [
  { badge: '1', title: 'Starter Plan Guide', desc: 'Start here: the 16 core accounting features, from Chart of Accounts to Invoices.', icon: FaSeedling, file: '/guides/starter-plan-guide.pdf', tierIndex: 0 },
  { badge: '2', title: 'Growth Plan Guide', desc: 'Add a full sales pipeline, purchase orders, and real bank reconciliation.', icon: FaRocket, file: '/guides/growth-plan-guide.pdf', tierIndex: 1 },
  { badge: '3', title: 'Business Plan Guide', desc: 'Add full HR & payroll, inventory, and project costing.', icon: FaBuilding, file: '/guides/business-plan-guide.pdf', tierIndex: 2 },
  { badge: '4', title: 'Enterprise Plan Guide', desc: 'Add system integrations, compliance logging, and vendor self-service.', icon: FaGem, file: '/guides/enterprise-plan-guide.pdf', tierIndex: 3 },
  { badge: '★', title: 'Practical Testing Guide', desc: 'See every feature from all 4 plans working together in one realistic company story.', icon: FaBookOpen, file: '/guides/practical-testing-guide.pdf', tierIndex: null },
];

// The roadmap milestones — clicking one sets which guides are "yours."
export const PLAN_TIERS = [
  { key: 'starter', label: 'Starter', through: 0 },
  { key: 'growth', label: 'Growth', through: 1 },
  { key: 'business', label: 'Business', through: 2 },
  { key: 'enterprise', label: 'Enterprise', through: 3 },
];

// One small, standalone how-to per module — not plan-tier gated.
export const FEATURE_GUIDES = [
  { title: 'Journal Entries & Reversing', desc: 'Post manual entries, then reverse one cleanly without breaking the audit trail.', icon: FaExchangeAlt, file: '/guides/features/journal-entries.pdf' },
  { title: 'General Ledger', desc: 'Filter every posted entry by account or module, then check the Trial Balance.', icon: FaBook, file: '/guides/features/general-ledger.pdf' },
  { title: 'Invoicing', desc: 'Send an invoice, take a partial payment, issue a credit note, and void a test one.', icon: FaFileInvoice, file: '/guides/features/invoicing.pdf' },
  { title: 'Billing (Bills / Accounts Payable)', desc: 'Take a bill through receive → approve → schedule → pay, plus disputing one.', icon: FaMoneyCheckAlt, file: '/guides/features/billing.pdf' },
  { title: 'Bank Reconciliation', desc: 'Import a statement, auto-match transactions, and post an adjusting entry for a bank fee.', icon: FaUniversity, file: '/guides/features/bank-reconciliation.pdf' },
];

export const ALL_PDF_GUIDES = [
  ...PLAN_GUIDES.map((g) => ({ ...g, kind: 'Plan guide' })),
  ...FEATURE_GUIDES.map((g) => ({ ...g, kind: 'Feature guide' })),
];

export const searchPdfGuides = (term) => {
  const t = term.trim().toLowerCase();
  if (!t) return [];
  return ALL_PDF_GUIDES.filter((g) => g.title.toLowerCase().includes(t) || g.desc.toLowerCase().includes(t));
};
