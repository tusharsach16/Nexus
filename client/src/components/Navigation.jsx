import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Users, User, LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Navigation = () => {
  const logout = useAuthStore((state) => state.logout);

  const navItems = [
    { to: '/dashboard', icon: <MessageSquare className="w-5 h-5" />, label: 'Chats' },
    { to: '/find-friends', icon: <Users className="w-5 h-5" />, label: 'Find Friends' },
    { to: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:relative md:flex-col md:w-20 bg-[#1a1a1a] border-t md:border-t-0 md:border-r border-dark-border flex justify-around md:justify-start items-center p-4 z-50">
      <div className="hidden md:flex mb-10">
        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-xl shadow-primary/5 border border-white/5 group-hover:scale-105 transition-transform duration-500">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="flex md:flex-col gap-6 md:gap-8 flex-1 justify-center">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 group transition-all duration-300 ${isActive ? 'text-primary' : 'text-neutral-500 hover:text-neutral-300'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-3 rounded-2xl transition-all duration-300 border ${isActive ? 'bg-primary/10 border-primary/20 shadow-inner' : 'bg-transparent border-transparent group-hover:bg-neutral-800'}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] md:hidden font-semibold tracking-wide uppercase">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <button 
        onClick={logout}
        className="hidden md:flex p-3 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all duration-300 mt-auto border border-transparent hover:border-red-400/20"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default Navigation;
