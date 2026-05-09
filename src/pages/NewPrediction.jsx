import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePrediction } from '../context/PredictionContext';

export default function NewPrediction() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setPredictionResult } = usePrediction();

  // State untuk Input Dinamis
  const [apiName, setApiName] = useState('');
  const [excipientInput, setExcipientInput] = useState('');
  const [excipientsList, setExcipientsList] = useState([]);

  const handleAddExcipient = () => {
    if (excipientInput.trim() !== '') {
      setExcipientsList([...excipientsList, excipientInput.trim()]);
      setExcipientInput('');
    }
  };

  const handleRemoveExcipient = (index) => {
    setExcipientsList(excipientsList.filter((_, i) => i !== index));
  };

  const handlePredict = async () => {
    if (excipientsList.length === 0) {
      alert("Harap tambahkan minimal 1 Eksipien!");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('https://dzamar-pharmamatch-backend.hf.space/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api: apiName,
          excipients: excipientsList
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setPredictionResult(data);
        
        // --- Save to localStorage ---
        const newProject = {
          id: Date.now(),
          name: `${apiName} Formulation`,
          status: 'In Progress',
          stability: parseInt(data.global_confidence?.replace('%', '') || 85),
          combinations: excipientsList.length,
          date: new Date().toISOString(),
          icon: 'science'
        };
        const existingProjects = JSON.parse(localStorage.getItem('pharmamatch_projects') || '[]');
        localStorage.setItem('pharmamatch_projects', JSON.stringify([newProject, ...existingProjects]));
        
        // Add pending validations
        const newPending = data.predictions.map((p, idx) => ({
          id: Date.now() + idx,
          api: apiName,
          excipient: p.excipient,
          predictedStatus: p.status,
          confidence: Math.round(p.compatibility_score * 100),
          date: new Date().toISOString()
        }));
        const existingPending = JSON.parse(localStorage.getItem('pharmamatch_pending_validations') || '[]');
        localStorage.setItem('pharmamatch_pending_validations', JSON.stringify([...newPending, ...existingPending]));
        
        navigate('/report');
      }
    } catch (err) {
      console.error(err);
      navigate('/report');
    }
    setIsLoading(false);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto animate-fade-in relative">
      {/* Page Header (Mobile Only) */}
      <div className="md:hidden mb-6">
        <h1 className="text-2xl font-bold text-primary font-headline tracking-tight">New Compatibility Prediction</h1>
        <p className="text-on-surface-variant text-sm mt-1">Configure APIs and excipients for interaction analysis.</p>
      </div>

      <div className="mb-6 hidden md:block">
        <h1 className="text-3xl font-bold text-primary font-headline tracking-tight">New Compatibility Prediction</h1>
        <p className="text-on-surface-variant mt-1">Configure APIs and excipients for interaction analysis.</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Inputs & Formulations (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Formulation Components Card */}
          <section className="bg-surface rounded-xl border border-outline-variant p-5 shadow-[0_10px_30px_rgba(0,43,53,0.05)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold font-headline text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
                Formulation Components
              </h2>
              <span className="bg-secondary-container text-on-secondary-container text-xs font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider">Draft Mode</span>
            </div>

            {/* API Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-on-surface mb-2 font-label">Active Pharmaceutical Ingredient (API)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[18px]">search</span>
                </div>
                <input 
                  className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded bg-white text-on-surface text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" 
                  type="text" 
                  value={apiName}
                  onChange={(e) => setApiName(e.target.value)}
                  placeholder="Ketik nama API di sini..."
                />
                {apiName && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[#003a7f] text-[18px]">check_circle</span>
                </div>
                )}
              </div>
            </div>

            {/* Excipients List with KB Hit Indicators */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <input 
                  className="flex-1 px-3 py-2 border border-outline-variant rounded bg-white text-sm focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Ketik nama Eksipien..."
                  value={excipientInput}
                  onChange={(e) => setExcipientInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddExcipient()}
                />
                <button 
                  onClick={handleAddExcipient}
                  className="bg-primary-container text-on-primary-container px-3 py-2 rounded text-sm font-medium hover:bg-[#005b6f] transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">add</span> Tambah
                </button>
              </div>
              
              <div className="border border-outline-variant rounded-lg bg-white overflow-hidden">
                <ul className="divide-y divide-outline-variant/50">
                  {excipientsList.map((exc, index) => (
                    <li key={index} className="p-3 flex items-center justify-between hover:bg-surface-container-low transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center text-secondary font-medium text-xs">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div>
                          <p className="font-medium text-on-surface text-sm">{exc}</p>
                          <p className="text-xs text-on-surface-variant">Excipient Candidate</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#003a7f] bg-blue-50 px-2 py-1 rounded">
                          <span className="material-symbols-outlined text-[14px]">science</span> Active
                        </span>
                        <button 
                          onClick={() => handleRemoveExcipient(index)}
                          className="text-outline hover:text-error transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    </li>
                  ))}
                  {excipientsList.length === 0 && (
                    <li className="p-4 text-center text-sm text-outline">Belum ada eksipien. Silakan tambah di atas.</li>
                  )}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Analysis & Visual (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Analysis Summary Card (Glassmorphism) */}
          <section className="bg-white/85 backdrop-blur-[12px] border border-[#dde3ea] rounded-xl p-6 relative overflow-hidden shadow-sm">
            {/* Decorative bg */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-fixed opacity-20 rounded-full blur-2xl"></div>
            
            <h3 className="text-base font-bold font-headline text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
              Smart Check Summary
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
              <div className="bg-white/60 rounded border border-outline-variant/50 p-3 flex flex-col justify-center items-center text-center">
                <span className="text-2xl font-black font-headline text-[#003a7f]">0</span>
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mt-1">From KB</span>
                <span className="text-[10px] text-on-surface-variant mt-0.5">Instant retrieval</span>
              </div>
              <div className="bg-tertiary-fixed/40 rounded border border-tertiary-fixed-dim/50 p-3 flex flex-col justify-center items-center text-center">
                <span className="text-2xl font-black font-headline text-tertiary-container">{excipientsList.length}</span>
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mt-1">Need ML Analysis</span>
                <span className="text-[10px] text-on-surface-variant mt-0.5">De novo prediction</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-t border-outline-variant/30 mb-6 relative z-10">
              <span className="text-sm font-medium text-on-surface-variant">Estimated Compute Time</span>
              <span className="text-sm font-bold text-primary font-mono bg-primary-fixed/30 px-2 py-0.5 rounded">&lt; 2s</span>
            </div>
            
            <button 
              onClick={handlePredict}
              disabled={isLoading}
              className="w-full bg-[#004251] hover:bg-[#005b6f] text-white font-semibold py-3 px-4 rounded transition-colors duration-150 flex items-center justify-center gap-2 shadow-sm relative z-10 disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-[20px]">memory</span>
              {isLoading ? 'Processing ML...' : 'Run Analysis Now'}
            </button>
          </section>

          {/* Chemical Context Visual Panel */}
          <section className="bg-surface rounded-xl border border-outline-variant p-5 shadow-[0_10px_30px_rgba(0,43,53,0.05)] flex-1 flex flex-col min-h-[250px]">
            <h3 className="text-sm font-bold font-headline text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-outline text-[18px]">hub</span>
              Molecular Structure Context
            </h3>
            <div className="flex-1 bg-white border border-outline-variant/50 rounded flex items-center justify-center p-4 relative overflow-hidden group">
              <img 
                alt="Molecular Structure" 
                className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale mix-blend-multiply" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmNDUOPkaj5LZL0PZJkwMEBzepYbpyfXl5X0H_wVbM63TzlM_TAfLOM6syRfImE8i_B_cUzH5QP-AmwlImZ5ieDAk1EGjcei-QZKAtDuriAMSY4AUV5gghO2eRlBn71D9F29GMeyNhKEJWhUxEcV0BEm2cpiCKLlvHW5UoHBdaWHmHaLsJWQADC8BDz2rbRAAsb5wJE1Z3shLT_2g2f_jE2pu0ZtfFEINirC49r4n4XlaXZFvuZRw0B_YQNxQym-mMTXd_BtwwogAb"
              />
              <div className="z-10 text-center">
                <span className="material-symbols-outlined text-outline-variant text-4xl mb-2">blur_on</span>
                <p className="text-xs text-on-surface-variant font-medium">Metformin HCL spatial preview available after analysis.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Overlay/Modal: Smart Check Results Breakdown */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/95 backdrop-blur-[16px] border border-[#dde3ea] shadow-[0_20px_40px_rgba(0,43,53,0.08)] w-full max-w-lg rounded-xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-outline-variant/50 flex items-center justify-between bg-white/50">
              <h3 className="text-lg font-bold font-headline text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
                Smart Check Results
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-outline hover:text-on-surface transition-colors p-1 rounded hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <p className="text-sm text-on-surface-variant mb-6">Initial screening complete. Evaluating formulation candidates against knowledge base.</p>
              
              <div className="space-y-4">
                {/* Instant Found Box */}
                <div className="flex items-start gap-4 p-4 rounded bg-blue-50/50 border border-[#003a7f]/20">
                  <div className="mt-0.5 text-[#003a7f]">
                    <span className="material-symbols-outlined text-2xl">database</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#003a7f] mb-1">0 Excipients Found in Knowledge Base</h4>
                    <p className="text-xs text-on-surface-variant">No instant retrieval available for the current combinations.</p>
                  </div>
                  <span className="text-xs font-bold text-[#003a7f] bg-white px-2 py-1 rounded border border-[#003a7f]/20 shadow-sm">Instant</span>
                </div>
                
                {/* ML Required Box */}
                <div className="flex items-start gap-4 p-4 rounded bg-tertiary-fixed/20 border border-tertiary-fixed-dim/30">
                  <div className="mt-0.5 text-tertiary-container">
                    <span className="material-symbols-outlined text-2xl">model_training</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-tertiary-container mb-1">{excipientsList.length} New Excipients Require ML Analysis</h4>
                    <p className="text-xs text-on-surface-variant">De novo interaction prediction will be executed against {apiName}.</p>
                  </div>
                  <span className="text-xs font-bold text-tertiary-container bg-white px-2 py-1 rounded border border-tertiary-fixed-dim/30 shadow-sm">Compute</span>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant/50 flex items-center justify-end gap-3">
              <Link 
                to="/knowledge-base"
                className="px-4 py-2 text-sm font-semibold text-[#004251] border border-[#004251] rounded hover:bg-surface-container transition-colors"
              >
                Lihat Detail KB
              </Link>
              <button 
                onClick={handlePredict}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#004251] rounded hover:bg-[#005b6f] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
              >
                {isLoading ? 'Processing ML...' : 'Lanjutkan Prediksi'}
                {!isLoading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
