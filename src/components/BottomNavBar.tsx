
import React from 'react';
import { HomeIcon, ListBulletIcon, SparklesIcon } from '../constants/icons';

type View = 'dashboard' | 'transactions' | 'ai';

interface BottomNavBarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick }) => {
  const activeColor = 'text-cyan-400';
  const inactiveColor = 'text-slate-400';
  const color = isActive ? activeColor : inactiveColor;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 w-full h-full transition-colors hover:text-cyan-400"
    >
      <div className={`w-6 h-6 ${color}`}>
        {icon}
      </div>
      <span className={`text-xs font-medium ${color}`}>
        {label}
      </span>
    </button>
  );
};

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 z-40">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        <NavItem
          label="Dashboard"
          icon={<HomeIcon />}
          isActive={activeView === 'dashboard'}
          onClick={() => setActiveView('dashboard')}
        />
        <NavItem
          label="Transactions"
          icon={<ListBulletIcon />}
          isActive={activeView === 'transactions'}
          onClick={() => setActiveView('transactions')}
        />
        <NavItem
          label="AI Assistant"
          icon={<SparklesIcon />}
          isActive={activeView === 'ai'}
          onClick={() => setActiveView('ai')}
        />
      </div>
    </nav>
  );
};