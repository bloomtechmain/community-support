import React from 'react';

// The website's hero background: flat navy, a faint dot grid, and two large
// flat discs running off the corners. Sits behind a section's content.
const NavyBackdrop = () => (
  <>
    <div
      className="absolute inset-0 opacity-10 pointer-events-none"
      style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
    />
    <div aria-hidden="true" className="hidden lg:block absolute -top-56 -left-56 w-[620px] h-[620px] rounded-full bg-white/5 pointer-events-none" />
    <div aria-hidden="true" className="hidden lg:block absolute -bottom-64 -right-48 w-[640px] h-[640px] rounded-full bg-white/5 pointer-events-none" />
  </>
);

export default NavyBackdrop;
