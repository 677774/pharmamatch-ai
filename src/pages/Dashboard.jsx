import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetch('https://dzamar-pharmamatch-backend.hf.space/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          // Sync with local storage
          const localProjects = JSON.parse(localStorage.getItem('pharmamatch_projects') || '[]');
          const localPending = JSON.parse(localStorage.getItem('pharmamatch_pending_validations') || '[]');
          
          const syncedData = data.data.map(stat => {
            if (stat.label === 'Total Molecules Analyzed') {
              return { ...stat, value: localProjects.length.toString() };
            }
            if (stat.label === 'Recent Predictions') {
              return { ...stat, value: localPending.length.toString() };
            }
            return stat;
          });
          setStats(syncedData);
        }
      })
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-label text-sm text-on-surface-variant mb-1 uppercase tracking-wider">Overview</p>
          <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">Dashboard</h2>
        </div>
        <Link to="/new-prediction" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-container text-on-primary font-label text-sm font-semibold rounded-lg hover:bg-primary-container/90 transition-colors shadow-sm w-full sm:w-auto">
          <span className="material-symbols-outlined">add</span>
          Start Session
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.length > 0 ? stats.map((stat, index) => (
          <div key={stat.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 flex flex-col justify-between h-full relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <p className="font-label text-sm text-on-surface-variant font-medium">{stat.label}</p>
                {index === 3 && <span className="px-2 py-0.5 bg-tertiary-container text-on-tertiary text-[10px] font-bold uppercase rounded-sm tracking-wider">New</span>}
              </div>
              <div className="p-2 bg-secondary-container/50 rounded-lg text-on-secondary-container">
                <span className="material-symbols-outlined text-xl">{stat.icon}</span>
              </div>
            </div>
            <div>
              <h3 className="font-headline text-3xl font-bold text-on-surface tracking-tight">{stat.value}</h3>
              <p className="font-label text-xs text-outline mt-1">{stat.tag}</p>
            </div>
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl transition-colors ${index === 0 ? 'bg-primary-fixed/20 group-hover:bg-primary-fixed/30' : index === 1 ? 'bg-secondary-fixed/20 group-hover:bg-secondary-fixed/30' : index === 2 ? 'bg-tertiary-fixed-dim/10 group-hover:bg-tertiary-fixed-dim/20' : 'bg-primary-fixed/20 group-hover:bg-primary-fixed/30'}`}></div>
          </div>
        )) : (
          <div className="col-span-4 text-center text-on-surface-variant p-8">Loading metrics from backend...</div>
        )}
      </div>

      {/* Bento Grid Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Left Column (Projects) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Active Projects Empty State */}
          <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/40 rounded-2xl flex flex-col shadow-sm min-h-[300px]">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center">
              <h3 className="font-headline text-lg font-bold text-on-surface">Active Projects</h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-4" style={{ fontVariationSettings: "'wght' 200" }}>folder_open</span>
              <h4 className="font-headline text-lg font-bold text-on-surface mb-2">No Active Projects</h4>
              <p className="text-on-surface-variant text-sm max-w-sm mb-6">Start a new formulation analysis session to create a project and track its compatibility over time.</p>
              <Link to="/new-prediction" className="px-5 py-2.5 bg-[#004251] text-white rounded font-label text-sm font-semibold hover:bg-[#005b6f] transition-colors shadow-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Start New Session
              </Link>
            </div>
          </div>

          {/* Model Fidelity Legend Panel */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4">Model Fidelity Index</h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="font-label text-sm text-on-surface">High Confidence (&gt;90%)</span>
                  </div>
                  <span className="font-label text-xs text-outline">Clinical phase readiness</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-tertiary-container"></div>
                    <span className="font-label text-sm text-on-surface">Moderate (70-89%)</span>
                  </div>
                  <span className="font-label text-xs text-outline">Requires further simulation</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-outline"></div>
                    <span className="font-label text-sm text-on-surface">Low Confidence (&lt;70%)</span>
                  </div>
                  <span className="font-label text-xs text-outline">Structural review needed</span>
                </div>
              </div>
              <div className="hidden md:block w-px bg-outline-variant/30"></div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="font-label text-xs text-on-surface-variant leading-relaxed">
                  The Random Forest (RF) algorithm bases confidence scoring on structural similarity to known stable compounds, molecular weight constraints, and predicted receptor binding affinity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Validations Widget) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Recent Validations Empty State */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl flex flex-col h-full overflow-hidden min-h-[300px]">
            <div className="px-6 py-5 border-b border-outline-variant/30 bg-surface-container-low/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">science</span>
                <h3 className="font-headline text-base font-bold text-on-surface">Lab Validations</h3>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest/50">
               <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-outline-variant mb-4">
                 <span className="material-symbols-outlined text-3xl">biotech</span>
               </div>
               <p className="font-label text-sm font-bold text-on-surface mb-1">No Validations Yet</p>
               <p className="text-xs text-on-surface-variant leading-relaxed">Submit your first formulation to the laboratory to see physical validation results appear here.</p>
            </div>
            <div className="px-5 py-3 border-t border-outline-variant/20 bg-surface-container-low/30">
              <Link to="/lab-validation" className="block w-full text-center font-label text-xs font-semibold text-primary hover:text-primary-container transition-colors">
                Go to Validation Hub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
