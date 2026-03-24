import { NavLink, useLocation } from 'react-router-dom';
import {
  Building2, Vote, BarChart3, Settings, CheckSquare,
  Fingerprint, Clock,
} from 'lucide-react'
import { useEffect, useState } from 'react';

const Layouts = ({ children }) => {
  const location = useLocation();
  const [clock, setClock] = useState('');

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

  return (
    <div className='flex min-h-screen font-poppins'>
      {/* Sidebar */}
      <aside className='w-64 bg-indigo-600 flex flex-col sticky top-0 h-screen overflow-hidden relative shrink-0'>
        {/* decorative blobs */}
        <div className='absolute -top-14 -right-14 w-52 h-52 rounded-full bg-white/5 pointer-events-none'></div>
        <div className='absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none'></div>

        <div className='relative z-10 flex-1 p-6 pb-4 overflow-y-auto'>
          {/* Logo */}
          <div className='flex items-center gap-2.5 mb-7'>
            <div className='w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0'>
              <CheckSquare size={18} color="white" strokeWidth={2} />
            </div>
            <span className="text-2xl font-extrabold text-white">VoteSecure</span>
          </div>

          {/* Election info */}
          <div className='bg-white/10 border border-white/20 rounded-xl p-3.5 mb-7'>
            <p className='text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1'>Active Election</p>
            <p className='text-xl font-bold text-white leading-snug'>Municipal Council Election 2026</p>
            <div className='flex items-center gap-1.5 mt-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow inline-block' />
              <span className='text-white/60 text-[11px]'>Live · Ward 7 · Ends Mar 22</span>
            </div>
          </div>

          {/* Nav */}
          <nav className='flex flex-col gap-1'>
            {
              navItems.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 select-none cursor-pointer
                    ${isActive ? 'bg-white/20 text-white font-semibold' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                  <Icon size={16} className='shrink-0' />
                  <span>{label}</span>
                </NavLink>
              ))
            }
          </nav>
        </div>

        {/* Bottom voter card */}
        <div className="relative z-10 border-t border-white/10 p-5">
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
      </aside>

      {/* Main content */}
      <div className='flex-1 flex flex-col min-h-screen bg-blue-50'>
        <header className='bg-white border-b border-purple-100 h-16 px-9 flex items-center justify-between sticky top-0 z-10'>
          <h1 className='text-2xl font-bold text-gray-900'>{pageTitles[location.pathname] || 'VoteSecure'}</h1>
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-indigo-600 border border-blue-200 text-xs font-semibold rounded-xl px-2 py-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round"><path strokeWidth="1.5" d="M5 9c0-3.3 0-4.95 1.025-5.975S8.7 2 12 2s4.95 0 5.975 1.025S19 5.7 19 9v6c0 3.3 0 4.95-1.025 5.975S15.3 22 12 22s-4.95 0-5.975-1.025S5 18.3 5 15z" /><path strokeLinejoin="round" strokeWidth="1.5" d="M16 13v-2.5a4 4 0 0 0-8 0V13" /><path strokeLinejoin="round" strokeWidth="1.5" d="M13.5 11v-.5a1.5 1.5 0 0 0-3 0V14m3-.5V15" /><path strokeLinejoin="round" strokeWidth="2" d="M12 19v.01" /></g></svg>
              <span>Biometric Active</span>
            </span>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
              <Clock size={12} />
              {clock}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-9 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layouts;