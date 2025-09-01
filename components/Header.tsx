import React from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';

const Logo: React.FC = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" className="text-cyan-400" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
    </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="p-4 sm:px-6 lg:px-8 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <h1 className="text-xl font-bold text-slate-100">Zenith</h1>
        </div>
        <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                <span className="font-semibold text-slate-300">JD</span>
            </div>
        </div>
      </div>
    </header>
  );
};