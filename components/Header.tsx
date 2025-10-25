
import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarIcon, HomeIcon } from './Icons';

const Header: React.FC = () => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    const baseClasses = 'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200';
    return isActive
      ? `${baseClasses} bg-slate-700 text-cyan-300`
      : `${baseClasses} text-slate-300 hover:bg-slate-800 hover:text-white`;
  };

  return (
    <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white tracking-tight">
              ToDo App <span className="text-cyan-400">for Daily Tasks</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <NavLink to="/" className={getNavLinkClass}>
              <HomeIcon />
              <span className="hidden sm:inline">Add Task</span>
            </NavLink>
            <NavLink to="/history" className={getNavLinkClass}>
              <CalendarIcon />
              <span className="hidden sm:inline">History</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
