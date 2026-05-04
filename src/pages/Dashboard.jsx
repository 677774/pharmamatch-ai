import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { recentProjects, recentValidations } from '../data/dummyData'

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const isId = localStorage.getItem('language') === 'Bahasa Indonesia';

  useEffect(() => {
    fetch('http://localhost:8888/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setStats(data.data);
        }
      })
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-label text-sm text-on-surface-variant mb-1 uppercase tracking-wider">{isId ? 'Ringkasan' : 'Overview'}</p>
          <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">{isId ? 'Dasbor' : 'Dashboard'}</h2>
        </div>
        <Link to="/new-prediction" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-container text-on-primary font-label text-sm font-semibold rounded-lg hover:bg-primary-container/90 transition-colors shadow-sm w-full sm:w-auto">
          <span className="material-symbols-outlined">add</span>
          {isId ? 'Mulai Sesi' : 'Start Session'}
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
          <div className="col-span-4 text-center text-on-surface-variant p-8">{isId ? 'Memuat metrik dari server...' : 'Loading metrics from backend...'}</div>
        )}
      </div>

      {/* Bento Grid Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Left Column (Projects) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Recent Projects Glass Card */}
          <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/40 rounded-2xl flex flex-col shadow-sm">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center">
              <h3 className="font-headline text-lg font-bold text-on-surface">{isId ? 'Proyek Aktif' : 'Active Projects'}</h3>
              <Link to="/projects" className="text-primary font-label text-sm font-medium hover:underline">{isId ? 'Lihat Semua' : 'View All'}</Link>
            </div>
            <div className="p-0">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-surface-container-low/50 border-b border-outline-variant/20 font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                <div className="col-span-5">{isId ? 'Nama Proyek' : 'Project Name'}</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-3">{isId ? 'Kepercayaan' : 'Confidence'}</div>
                <div className="col-span-1 text-right">{isId ? 'Aksi' : 'Action'}</div>
              </div>
              
              {/* Project Rows */}
              <div className="divide-y divide-outline-variant/20">
                {recentProjects.map((project, index) => (
                  <div key={project.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-surface-container-low/30 transition-colors cursor-pointer group">
                    <div className="col-span-5 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded ${index === 0 ? 'bg-primary-container text-on-primary' : index === 1 ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-highest text-on-surface-variant'} flex items-center justify-center shrink-0`}>
                        <span className="material-symbols-outlined text-[18px]">{project.icon}</span>
                      </div>
                      <div>
                        <p className="font-label text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{project.name.split(' ')[0]}</p>
                        <p className="font-label text-xs text-outline">Target: {index === 0 ? 'Kinase Inhibitor' : index === 1 ? 'GPCR' : 'Ion Channel'}</p>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${project.status === 'In Progress' ? 'bg-primary-fixed/30 text-on-primary-fixed border-primary-fixed' : project.status === 'Validated' ? 'bg-tertiary-fixed/30 text-on-tertiary-fixed-variant border-tertiary-fixed' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/50'} font-label text-xs font-medium border`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'In Progress' ? 'bg-primary' : project.status === 'Validated' ? 'bg-tertiary-container' : 'bg-outline'}`}></span>
                        {project.status === 'In Progress' ? 'In Progress' : project.status === 'Validated' ? 'Validating' : 'Paused'}
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-full bg-surface-container-highest rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${project.stability > 80 ? 'bg-primary' : 'bg-outline'}`} style={{ width: `${project.stability}%` }}></div>
                      </div>
                      <span className="font-label text-xs font-bold text-on-surface">{project.stability}%</span>
                    </div>
                    <div className="col-span-1 text-right">
                      <button className="text-outline hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Model Fidelity Legend Panel */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-4">{isId ? 'Indeks Keandalan Model' : 'Model Fidelity Index'}</h3>
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
          {/* Recent Validations Panel */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl flex flex-col h-full overflow-hidden">
            <div className="px-6 py-5 border-b border-outline-variant/30 bg-surface-container-low/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">science</span>
                <h3 className="font-headline text-base font-bold text-on-surface">{isId ? 'Validasi Lab' : 'Lab Validations'}</h3>
              </div>
            </div>
            <div className="flex-1 p-5 space-y-4">
              {/* Validation Item 1 */}
              <div className="bg-surface border border-outline-variant/20 rounded-xl p-4 hover:border-outline-variant/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary-fixed/30 text-on-primary-fixed font-label text-[10px] font-bold uppercase tracking-wide">
                    Confirmed
                  </span>
                  <span className="font-label text-xs text-outline">2h ago</span>
                </div>
                <h4 className="font-headline text-sm font-bold text-on-surface mb-1">Metformin + SLS</h4>
                <p className="font-label text-xs text-on-surface-variant">Solubility increased by 42%. Stability confirmed at 40°C/75% RH.</p>
              </div>
              {/* Validation Item 2 */}
              <div className="bg-surface border border-outline-variant/20 rounded-xl p-4 hover:border-outline-variant/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary-fixed/30 text-on-primary-fixed font-label text-[10px] font-bold uppercase tracking-wide">
                    Confirmed
                  </span>
                  <span className="font-label text-xs text-outline">5h ago</span>
                </div>
                <h4 className="font-headline text-sm font-bold text-on-surface mb-1">Aspirin + PVP</h4>
                <p className="font-label text-xs text-on-surface-variant">Crystallization inhibited successfully over 30-day accelerated trial.</p>
              </div>
              {/* Validation Item 3 */}
              <div className="bg-surface border border-outline-variant/20 rounded-xl p-4 hover:border-outline-variant/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-error-container/50 text-on-error-container font-label text-[10px] font-bold uppercase tracking-wide">
                    Anomalous
                  </span>
                  <span className="font-label text-xs text-outline">1d ago</span>
                </div>
                <h4 className="font-headline text-sm font-bold text-on-surface mb-1">Compound X-12 + PEG</h4>
                <p className="font-label text-xs text-on-surface-variant">Phase separation observed after 48h. Model updated.</p>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-outline-variant/20 bg-surface-container-low/30">
              <Link to="/lab-validation" className="block w-full text-center font-label text-xs font-semibold text-primary hover:text-primary-container transition-colors">
                {isId ? 'Lihat Riwayat Penuh' : 'View Full Audit Trail'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
