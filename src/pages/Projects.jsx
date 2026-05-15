import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Load dynamic projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem('pharmamatch_projects') || '[]');
    setProjects(savedProjects);
  }, []);

  const handleDeleteProject = (e, id, projectName) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm(`Apakah Anda yakin ingin menghapus proyek "${projectName}"? Semua data validasi terkait juga akan dihapus.`)) {
      return;
    }

    // 1. Delete the project
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('pharmamatch_projects', JSON.stringify(updatedProjects));

    // 2. Cascade delete pending validations
    const pending = JSON.parse(localStorage.getItem('pharmamatch_pending_validations') || '[]');
    const updatedPending = pending.filter(v => v.projectName !== projectName);
    localStorage.setItem('pharmamatch_pending_validations', JSON.stringify(updatedPending));

    // 3. Cascade delete recent validations
    const recent = JSON.parse(localStorage.getItem('pharmamatch_recent_validations') || '[]');
    const updatedRecent = recent.filter(v => v.projectName !== projectName);
    localStorage.setItem('pharmamatch_recent_validations', JSON.stringify(updatedRecent));
  };

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
        {projects.length > 0 ? projects.map((project) => (
          <Link 
            key={project.id}
            to="/report"
            state={{ projectName: project.name, dosageForm: project.dosage_form, predictionData: project.predictionData }}
            className="bg-white border border-outline-variant/50 rounded-xl p-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-container/30 transition-all duration-300 flex flex-col h-full group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary-container transition-colors">{project.name}</h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        const newName = prompt("Enter new project name:", project.name);
                        if (newName && newName.trim() !== "") {
                          const updated = projects.map(p => p.id === project.id ? { ...p, name: newName.trim() } : p);
                          setProjects(updated);
                          localStorage.setItem('pharmamatch_projects', JSON.stringify(updated));
                        }
                      }}
                      className="p-1 rounded text-outline hover:text-primary hover:bg-surface-container-high transition-colors"
                      title="Rename Project"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (window.confirm(`Apakah Anda yakin ingin menghapus proyek "${project.name}"? Semua data validasi terkait juga akan dihapus.`)) {
                          // 1. Delete the project
                          const updated = projects.filter(p => p.id !== project.id);
                          setProjects(updated);
                          localStorage.setItem('pharmamatch_projects', JSON.stringify(updated));

                          // 2. Cascade delete pending validations
                          const pending = JSON.parse(localStorage.getItem('pharmamatch_pending_validations') || '[]');
                          const updatedPending = pending.filter(v => v.projectName !== project.name);
                          localStorage.setItem('pharmamatch_pending_validations', JSON.stringify(updatedPending));

                          // 3. Cascade delete recent validations
                          const recent = JSON.parse(localStorage.getItem('pharmamatch_recent_validations') || '[]');
                          const updatedRecent = recent.filter(v => v.projectName !== project.name);
                          localStorage.setItem('pharmamatch_recent_validations', JSON.stringify(updatedRecent));
                        }
                      }}
                      className="p-1 rounded text-outline hover:text-error hover:bg-error-container/30 transition-colors"
                      title="Delete Project"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant font-body mt-1">ID: PRJ-{new Date(project.date).getFullYear()}-{project.id.toString().slice(-4)}</p>
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
              {project.labStatus === 'confirmed' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#e6f4ea] text-[#137333] border border-[#a8dab5]">
                  <span className="material-symbols-outlined text-[12px]">verified</span> Lab Confirmed
                </span>
              )}
              {project.labStatus === 'contradicted' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#fce8e6] text-[#c5221f] border border-[#f5b7b1]">
                  <span className="material-symbols-outlined text-[12px]">warning</span> Lab Contradicted
                </span>
              )}
            </div>
            
            <div className="mt-2 space-y-4 flex-1">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                  <span className="material-symbols-outlined text-[18px] text-outline">{project.icon || 'science'}</span>
                  <span>{project.combinations} active combinations</span>
                </div>
                {project.dosage_form && (
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant font-body">
                    <span className="material-symbols-outlined text-[18px] text-outline">medication</span>
                    <span>{project.dosage_form}</span>
                  </div>
                )}
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
        )) : (
          <div className="col-span-1 md:col-span-2 xl:col-span-3 text-center py-20 bg-surface-container-lowest/50 border border-outline-variant/50 rounded-xl">
            <span className="material-symbols-outlined text-5xl text-outline mb-4">folder_off</span>
            <h3 className="text-xl font-bold font-headline text-on-surface">No Projects Found</h3>
            <p className="text-on-surface-variant mt-2 mb-6">You haven't run any predictions yet. Create a new project to get started.</p>
            <Link 
              to="/new-prediction"
              className="inline-flex bg-[#004251] hover:bg-[#005b6f] text-white px-5 py-2.5 rounded-lg font-body text-sm font-medium items-center justify-center gap-2 transition-colors duration-150 shadow-sm"
            >
              Start New Prediction
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
