import { useState, useEffect } from 'react'
import { currentUser } from '../../data/dummyData'

export default function Header() {
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.add('dark-mode-hack');
      localStorage.setItem('theme', 'dark');
      
      if (!document.getElementById('dark-mode-style')) {
        const style = document.createElement('style');
        style.id = 'dark-mode-style';
        style.innerHTML = `
          .dark-mode-hack { filter: invert(1) hue-rotate(180deg) contrast(0.9); }
          .dark-mode-hack img, .dark-mode-hack video { filter: invert(1) hue-rotate(180deg); }
        `;
        document.head.appendChild(style);
      }
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('dark-mode-hack');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-6 py-4 sticky top-0 z-30 bg-surface-container-lowest/85 backdrop-blur-md border-b border-outline-variant/30 transition-all">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 -ml-2 text-on-surface hover:bg-surface-container rounded-full transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="font-headline font-bold text-xl text-primary md:hidden tracking-tight">PharmaMatch AI</h1>
        <div className="hidden md:flex relative w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all placeholder:text-outline text-on-surface font-body" 
            placeholder="Search KB, molecules, projects..." 
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-all"
          title="Toggle Dark Mode"
        >
          <span className="material-symbols-outlined">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <button className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/30 hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container">
          <img alt="User Avatar" className="w-full h-full object-cover" src={currentUser.avatar} />
        </button>
      </div>
    </header>
  )
}
