import { useLocation, Link, useNavigate } from 'react-router-dom';
import { currentUser } from '../../data/dummyData';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Knowledge Base', icon: 'menu_book', path: '/knowledge-base' },
    { name: 'New Prediction', icon: 'query_stats', path: '/new-prediction' },
    { name: 'Projects', icon: 'folder_open', path: '/projects' },
    { name: 'Molecule Database', icon: 'science', path: '/molecules' },
    { name: 'Lab Validation', icon: 'biotech', path: '/lab-validation' },
    { name: 'History / Reports', icon: 'analytics', path: '/report' },
    { name: 'Model Insights', icon: 'psychology', path: '/model-insights' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col bg-surface-container-lowest border-r border-outline-variant/30 w-72 z-40 transition-all duration-200 ease-in-out h-screen overflow-y-auto shrink-0">
      <div className="p-6 border-b border-outline-variant/30 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-headline font-bold shrink-0">
          {currentUser.initials}
        </div>
        <div>
          <h1 className="font-headline text-lg font-bold tracking-tight text-primary">PharmaMatch AI</h1>
          <p className="font-label text-xs text-on-surface-variant">Production Ready</p>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label text-sm font-medium transition-colors group ${
              location.pathname === item.path
                ? 'bg-primary-container text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span
              className={`material-symbols-outlined ${
                location.pathname === item.path ? 'fill' : 'text-on-surface-variant group-hover:text-primary transition-colors'
              }`}
            >
              {item.icon}
            </span>
            {item.name}
          </Link>
        ))}
        <div className="pt-4 mt-4 border-t border-outline-variant/30 flex flex-col gap-1">
          <Link
            to="/profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-label text-sm transition-all duration-200 ${
              location.pathname === '/profile'
                ? 'bg-secondary-container text-on-secondary-container font-bold'
                : 'text-on-surface hover:bg-surface-variant hover:text-on-surface-variant'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: location.pathname === '/profile' ? "'FILL' 1" : "'FILL' 0" }}
            >
              settings
            </span>
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-label text-sm text-error hover:bg-error-container/50 transition-all duration-200 text-left w-full mt-2"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}
