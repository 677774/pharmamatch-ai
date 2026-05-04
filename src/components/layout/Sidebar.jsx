import { NavLink } from 'react-router-dom'
import { currentUser } from '../../data/dummyData'

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col bg-surface-container-lowest border-r border-outline-variant/30 w-72 z-40 transition-all duration-200 ease-in-out h-screen overflow-y-auto shrink-0">
      <div className="p-6 border-b border-outline-variant/30 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-headline font-bold shrink-0">
          {currentUser.initials}
        </div>
        <div>
          <h2 className="font-headline text-lg font-black text-primary">PharmaMatch AI</h2>
          <p className="font-label text-xs text-on-surface-variant">Phase II Active</p>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-label text-sm font-medium transition-colors group ${isActive ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
          <span className={`material-symbols-outlined ${window.location.pathname === '/dashboard' ? 'fill' : 'text-on-surface-variant group-hover:text-primary transition-colors'}`}>dashboard</span>
          Dashboard
        </NavLink>
        <NavLink to="/knowledge-base" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-label text-sm font-medium transition-colors group ${isActive ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
          <span className={`material-symbols-outlined ${window.location.pathname === '/knowledge-base' ? 'fill' : 'text-on-surface-variant group-hover:text-primary transition-colors'}`}>menu_book</span>
          Knowledge Base
        </NavLink>
        <NavLink to="/new-prediction" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-label text-sm font-medium transition-colors group ${isActive ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
          <span className={`material-symbols-outlined ${window.location.pathname === '/new-prediction' ? 'fill' : 'text-on-surface-variant group-hover:text-primary transition-colors'}`}>query_stats</span>
          New Prediction
        </NavLink>
        <NavLink to="/projects" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-label text-sm font-medium transition-colors group ${isActive ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
          <span className={`material-symbols-outlined ${window.location.pathname === '/projects' ? 'fill' : 'text-on-surface-variant group-hover:text-primary transition-colors'}`}>folder_open</span>
          Projects
        </NavLink>
        <NavLink to="/molecules" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-label text-sm font-medium transition-colors group ${isActive ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
          <span className={`material-symbols-outlined ${window.location.pathname === '/molecules' ? 'fill' : 'text-on-surface-variant group-hover:text-primary transition-colors'}`}>science</span>
          Molecule Database
        </NavLink>
        <NavLink to="/report" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-label text-sm font-medium transition-colors group ${isActive ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
          <span className={`material-symbols-outlined ${window.location.pathname === '/report' ? 'fill' : 'text-on-surface-variant group-hover:text-primary transition-colors'}`}>analytics</span>
          History / Reports
        </NavLink>
        <div className="pt-4 mt-4 border-t border-outline-variant/30">
          <NavLink to="/model-insights" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-label text-sm font-medium transition-colors group ${isActive ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
            <span className={`material-symbols-outlined ${window.location.pathname === '/model-insights' ? 'fill' : 'text-on-surface-variant group-hover:text-primary transition-colors'}`}>psychology</span>
            Model Insights
          </NavLink>
          <NavLink to="/profile" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-label text-sm font-medium transition-colors group ${isActive ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
            <span className={`material-symbols-outlined ${window.location.pathname === '/profile' ? 'fill' : 'text-on-surface-variant group-hover:text-primary transition-colors'}`}>settings</span>
            Settings
          </NavLink>
          <NavLink to="/login" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low font-label text-sm font-medium transition-colors group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">logout</span>
            Logout
          </NavLink>
        </div>
      </nav>
    </aside>
  )
}
