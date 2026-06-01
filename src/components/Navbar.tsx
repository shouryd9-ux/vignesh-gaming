import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Blog' },
  { to: '/booking', label: 'Booking' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#070711]/90 backdrop-blur-xl border-b border-cyan-400/15 py-3' : 'bg-transparent py-5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400 blur-md opacity-50 group-hover:opacity-80 transition" />
            <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center">
              <Gamepad2 className="h-5 w-5 text-[#050510]" />
            </div>
          </div>
          <div className="leading-none">
            <div className="font-display font-extrabold text-base tracking-wider text-white">
              VIGNESH
            </div>
            <div className="font-heading text-[10px] tracking-[0.35em] text-cyan-400 uppercase">Gaming Zone</div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative px-4 py-2 font-heading text-sm font-medium tracking-wide uppercase transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-500"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
          <Link
            to="/booking"
            className="ml-2 clip-corner bg-gradient-to-r from-cyan-400 to-violet-500 text-[#050510] font-display font-bold text-xs uppercase tracking-wider px-5 py-2.5 hover:shadow-neon-cyan transition-all"
          >
            Book Now
          </Link>
        </div>

        <button className="lg:hidden text-white" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-[#070711]/98 backdrop-blur-xl border-t border-cyan-400/15"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `px-3 py-3 font-heading uppercase tracking-wide text-sm rounded ${
                      isActive ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-300'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Link to="/booking" className="mt-2 text-center clip-corner bg-gradient-to-r from-cyan-400 to-violet-500 text-[#050510] font-display font-bold text-sm uppercase tracking-wider px-5 py-3">
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
