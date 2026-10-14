// Shared framer-motion presets, matching apps/website so both apps move the
// same way: content fades up in a stagger, filled discs pop in on a spring,
// and scroll-triggered sections animate once.
export const EASE = [0.22, 1, 0.36, 1];

export const stagger = (gap = 0.12, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export const popIn = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 20 } },
};

export const inView = { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.2 } };

export const containerClass = 'relative w-full px-4 sm:px-8 lg:px-12';
