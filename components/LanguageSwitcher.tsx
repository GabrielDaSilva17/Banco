import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeIcon } from '../constants/icons';

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };
  
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <GlobeIcon className="w-6 h-6" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10">
          <ul className="py-1">
            <li>
              <button
                onClick={() => changeLanguage('en')}
                className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === 'en' ? 'text-cyan-400' : 'text-slate-300'} hover:bg-slate-700`}
              >
                {t('language.english')}
              </button>
            </li>
            <li>
              <button
                onClick={() => changeLanguage('pt')}
                className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === 'pt' ? 'text-cyan-400' : 'text-slate-300'} hover:bg-slate-700`}
              >
                {t('language.portuguese')}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
