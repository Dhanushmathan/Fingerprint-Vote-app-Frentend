import { NavLink, useLocation } from 'react-router-dom';
import {
  Building2, Vote, BarChart3, Settings, CheckSquare,
  Fingerprint, Clock,
  X,
  Menu,
} from 'lucide-react'
import { useEffect, useState } from 'react';

const Layouts = ({ children }) => {
  const location = useLocation();
  const [clock, setClock] = useState('');
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: '/register-party', icon: Building2, label: 'Party Registration' },
    { to: '/vote', icon: Vote, label: 'Cast Vote' },
    { to: '/results', icon: BarChart3, label: 'Live Results' },
    { to: '/admin', icon: Settings, label: 'Admin Panel' },
  ]

  const pageTitles = {
    '/register-party': 'Party Registration',
    '/vote': 'Cast Your Vote',
    '/results': 'Live Results',
    '/admin': 'Admin Panel',
  }

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const pad = v => String(v).padStart(2, '0');
      setClock(`${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Close drawer on route change (mobile)
  useEffect(() => { setOpen(false) }, [location.pathname]);

  const SidebarContent = () => {
    return (
      <div className='bg-indigo-800 h-full flex flex-col'>
        <div className="relative z-10 flex-1 p-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <CheckSquare size={18} color="white" strokeWidth={2} />
            </div>
            <span className="text-lg font-extrabold text-white">VoteSecure</span>
          </div>

          {/* Election info */}
          <div className="bg-white/10 border border-white/20 rounded-xl p-3.5 mb-6">
            <p className="text-white/70 text-[11px] font-extrabold uppercase tracking-widest mb-1">Active Election</p>
            <p className="text-xl font-extrabold text-white leading-snug">
              Municipal Council Election 2025
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow inline-block" />
              <span className="text-white/60 text-[11px]">Live · Ward 7 · Ends Mar 22</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium
                     transition-all duration-200 select-none cursor-pointer
                     ${isActive
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'}`
                }
              >
                <Icon size={16} className="shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="relative z-10 border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Fingerprint size={16} color="white" />
            </div>
            <div>
              <p className="text-white text-[13px] font-semibold">Biometric Active</p>
              <p className="text-white/60 text-[11px]">Fingerprint + OTP</p>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className='flex min-h-screen font-poppins'>
      {/* Sidebar */}
      <aside className='hidden lg:flex w-64 flex-col sticky top-0 h-screen overflow-hidden relative shrink-0'>
        {/* decorative blobs */}
        <div className='absolute -top-14 -right-14 w-52 h-52 rounded-full bg-white/5 pointer-events-none'></div>
        <div className='absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none'></div>
        <SidebarContent />
      </aside>

      {
        open && (
          <div className='fixed inset-0 bg-black/50 z-40 lg:hidden' onClick={() => setOpen(false)} />
        )
      }

      <aside className={`
              fixed top-0 left-0 h-full w-72 bg-primary-500 flex flex-col z-50
              transition-transform duration-300 ease-in-out lg:hidden overflow-hidden
              ${open ? 'translate-x-0' : '-translate-x-full'}
            `}>
        <div className="absolute -top-14 -right-14 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/20 rounded-lg
                           flex items-center justify-center text-white"
        >
          <X size={16} />
        </button>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className='flex-1 flex flex-col min-h-screen bg-blue-50 min-w-0'>
        <header className='bg-white border-b border-purple-100 h-14 md:h-16 px-4 md:px-6 lg:px-9 flex items-center justify-between sticky top-0 z-10'>
          {/* Hamburger — mobile/tablet only */}
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center
                                     rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <Menu size={18} />
            </button>
            <h1 className='text-2xl font-bold text-gray-900'>{pageTitles[location.pathname] || 'VoteSecure'}</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <span className="hidden bg-blue-100 text-indigo-600 border border-blue-200 text-[10px] md:text-xs font-semibold rounded-xl px-2 py-1 sm:flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round"><path strokeWidth="1.5" d="M5 9c0-3.3 0-4.95 1.025-5.975S8.7 2 12 2s4.95 0 5.975 1.025S19 5.7 19 9v6c0 3.3 0 4.95-1.025 5.975S15.3 22 12 22s-4.95 0-5.975-1.025S5 18.3 5 15z" /><path strokeLinejoin="round" strokeWidth="1.5" d="M16 13v-2.5a4 4 0 0 0-8 0V13" /><path strokeLinejoin="round" strokeWidth="1.5" d="M13.5 11v-.5a1.5 1.5 0 0 0-3 0V14m3-.5V15" /><path strokeLinejoin="round" strokeWidth="2" d="M12 19v.01" /></g></svg>
              <span>Biometric Active</span>
            </span>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
              <Clock size={12} />
              <span className='hidden sm:inline'>{clock}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-5 md:p-6 lg:p-9 overflow-auto">
          {children}
        </main>

        {/* ── Mobile Bottom Nav (xs/sm only) ──────── */}
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100
                                flex items-center justify-around px-2 py-2 z-30 safe-area-pb">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl
                         transition-all duration-200 min-w-0 flex-1
                         ${isActive ? 'text-primary-600' : 'text-gray-400'}`
              }
            >
              <Icon size={20} />
              <span className="text-[9px] font-semibold truncate w-full text-center leading-tight">
                {label.split(' ')[0]}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Layouts;