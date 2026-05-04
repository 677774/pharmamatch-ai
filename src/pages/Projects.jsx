import { Link } from 'react-router-dom';
import { allProjects } from '../data/dummyData';

export default function Projects() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Action Bar: Search & New Project */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-lowest/85 backdrop-blur-[12px] border border-outline-variant/40 p-4 rounded-xl shadow-sm">
        <div className="relative w-full sm:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl" style={{ fontVariationSettings: "'wght' 300" }}>search</span>
          <input 
            className="w-full bg-white border border-outline-variant/50 rounded-lg pl-10 pr-4 py-2 text-sm font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all" 
            placeholder="Search projects by name or ID..." 
            type="text"
          />
        </div>
        <Link 
          to="/new-prediction"
          className="w-full sm:w-auto bg-primary-container hover:bg-[#005b6f] text-white px-5 py-2.5 rounded-lg font-body text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-150 shadow-sm whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>add</span>
          New Project
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {allProjects.map((project) => (
          <Link 
            key={project.id}
            to="/report"
            className="bg-white border border-outline-variant/50 rounded-xl p-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-container/30 transition-all duration-300 flex flex-col h-full group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary-container transition-colors">{project.name}</h3>
                <p className="text-xs text-on-surface-variant font-body mt-1">ID: PRJ-2026-{project.id.toString().padStart(3, '0')}</p>
              </div>
              
              {project.status === 'In Progress' ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-secondary-fixed text-on-secondary-fixed-variant">
                  {project.status}
                </span>
              ) : project.status === 'Validated' ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#e3f2fd] text-[#003a7f]">
                  {project.status}
                </span>
              ) : project.status === 'Review Required' ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-error-container/50 text-[#93000a]">
                  Review
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-surface-variant text-on-surface-variant">
                  {project.status}
                </span>
              )}
            </div>
            
            <div className="mt-2 space-y-4 flex-1">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                <span className="material-symbols-outlined text-[18px] text-outline">science</span>
                <span>{project.combinations} active combinations</span>
              </div>
              
              <div className="pt-4 border-t border-outline-variant/30">
                <div className="flex justify-between items-center text-xs font-body mb-1.5">
                  <span className="text-on-surface-variant">Validation Phase</span>
                  <span className="font-medium text-on-surface">{project.stability}%</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full ${project.status === 'Validated' ? 'bg-[#003a7f]' : project.status === 'Review Required' ? 'bg-[#93000a]' : project.status === 'Draft' ? 'bg-outline-variant' : 'bg-[#004251]'}`} 
                    style={{ width: `${project.stability}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
