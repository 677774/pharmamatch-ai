import { currentUser } from '../../data/dummyData'

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full px-4 md:px-6 py-4 sticky top-0 z-30 bg-surface-container-lowest/85 backdrop-blur-md border-b border-outline-variant/30">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 -ml-2 text-on-surface hover:bg-surface-container rounded-full transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="font-headline font-bold text-xl text-primary md:hidden tracking-tight">PharmaMatch AI</h1>
        <div className="hidden md:flex relative w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-shadow placeholder:text-outline text-on-surface font-body" 
            placeholder="Search KB, molecules, projects..." 
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">

        <button className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/30 hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container">
          <img alt="User Avatar" className="w-full h-full object-cover" src={currentUser.avatar} />
        </button>
      </div>
    </header>
  )
}
