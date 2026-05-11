import { useNavigate, useLocation } from 'react-router-dom';
import { usePrediction } from '../context/PredictionContext';

export default function CompatibilityReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const { predictionResult } = usePrediction();
  
  const projectName = location.state?.projectName || "Custom Analysis";
  const dosageForm = location.state?.dosageForm || "Tablet / Kapsul";

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-primary-container">
            <span className="material-symbols-outlined text-sm">analytics</span>
            <span>Project: {projectName}</span>
            <span className="text-outline-variant mx-1">|</span>
            <span className="material-symbols-outlined text-sm">medication</span>
            <span>{dosageForm}</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">Compatibility Report</h1>
          <p className="text-on-surface-variant text-sm mt-1">Comprehensive analysis of Active Pharmaceutical Ingredient interactions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-primary-container text-primary-container bg-transparent rounded-lg font-label text-sm font-semibold hover:bg-primary-container/5 transition-colors duration-150">
            <span className="material-symbols-outlined text-lg">download</span>
            Export
          </button>
        </div>
      </div>

      {/* Content Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Matrix & Legend */}
        <div className="lg:col-span-8 space-y-6">
          {/* Compatibility Matrix Panel */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-outline-variant/30 bg-surface flex justify-between items-center">
              <h2 className="font-headline font-bold text-on-surface text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">grid_on</span>
                Excipient Compatibility Matrix
              </h2>
              <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded-full border border-outline-variant/50">API: {predictionResult?.api_name || "Unknown"}</span>
            </div>
            <div className="p-5 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr>
                    <th className="font-label text-xs uppercase tracking-wider font-semibold text-on-surface-variant bg-surface-container-low px-4 py-3 rounded-tl-lg border-b-2 border-outline-variant/30">Excipient</th>
                    <th className="font-label text-xs uppercase tracking-wider font-semibold text-on-surface-variant bg-surface-container-low px-4 py-3 border-b-2 border-outline-variant/30">Class</th>
                    <th className="font-label text-xs uppercase tracking-wider font-semibold text-on-surface-variant bg-surface-container-low px-4 py-3 border-b-2 border-outline-variant/30 text-center">Status</th>
                    <th className="font-label text-xs uppercase tracking-wider font-semibold text-on-surface-variant bg-surface-container-low px-4 py-3 rounded-tr-lg border-b-2 border-outline-variant/30 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="font-body text-sm divide-y divide-outline-variant/20">
                  {predictionResult && predictionResult.predictions ? (
                    predictionResult.predictions.map((item, index) => (
                      <tr 
                        key={index} 
                        onClick={() => navigate('/model-insights', { state: { predictionItem: item, apiName: predictionResult.api_name } })}
                        className={`cursor-pointer group hover:bg-surface-container-highest transition-colors ${item.status === 'Warning' || item.status === 'Incompatible' ? 'bg-error-container/20 hover:bg-error-container/40' : ''}`}
                        title="Click to view Model Insights for this specific pair"
                      >
                        <td className="px-4 py-3 font-medium text-on-surface flex items-center gap-2 group-hover:text-primary transition-colors">
                          {item.excipient}
                          {(item.status === 'Warning' || item.status === 'Incompatible') && (
                            <span className="material-symbols-outlined text-error text-[16px]">warning</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-on-surface-variant">Predicted</td>
                        <td className="px-4 py-3 text-center">
                          {item.source && item.source.includes('Knowledge Base') ? (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${item.status === 'Warning' || item.status === 'Incompatible' ? 'bg-error-container text-on-error-container border border-error/30' : 'bg-[#e6f4ea] text-[#137333] border border-[#a8dab5]'}`}>
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              KB
                            </span>
                          ) : item.source && item.source.includes('Suitability') ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#fce4ec] text-[#b71c1c] border border-[#ef9a9a]">
                              <span className="material-symbols-outlined text-[14px]">block</span>
                              FORM
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${item.status === 'Warning' || item.status === 'Incompatible' ? 'bg-tertiary-fixed text-tertiary border border-tertiary-fixed-dim' : 'bg-[#e3f2fd] text-[#003a7f] border border-[#bbdefb]'}`}>
                              <span className="material-symbols-outlined text-[14px]">psychology</span>
                              ML
                            </span>
                          )}
                        </td>
                        <td className={`px-4 py-3 text-right font-mono text-xs font-medium ${item.status === 'Warning' || item.status === 'Incompatible' ? 'text-error' : 'text-on-surface-variant'}`}>
                          {item.compatibility_score}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-on-surface-variant">No prediction data found. Please run an analysis first.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend Section */}
          <div className="flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-surface border border-outline-variant/40 text-sm shadow-sm">
            <div className="flex flex-col gap-1 md:w-1/2">
              <div className="flex items-center gap-2 font-semibold text-on-surface mb-1">
                <span className="material-symbols-outlined text-[18px] text-[#003a7f]">check_circle</span>
                KB (Validated)
              </div>
              <p className="text-on-surface-variant text-xs leading-relaxed">Knowledge Base entries represent historically validated, physically tested interactions confirmed by established pharmacological literature or empirical laboratory results.</p>
            </div>
            <div className="hidden md:block w-px bg-outline-variant/30"></div>
            <div className="md:hidden h-px bg-outline-variant/30 w-full"></div>
            <div className="flex flex-col gap-1 md:w-1/2">
              <div className="flex items-center gap-2 font-semibold text-on-surface mb-1">
                <span className="material-symbols-outlined text-[18px] text-tertiary">psychology</span>
                ML (Prediction)
              </div>
              <p className="text-on-surface-variant text-xs leading-relaxed">Machine Learning predictions are generated via molecular structural analysis algorithms. These indicate potential compatibility levels that require physical validation.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Detail Card: Warning */}
          {predictionResult?.predictions?.filter(p => p.status === 'Warning' || p.status === 'Incompatible').length > 0 ? (
            (() => {
              const warningItem = predictionResult.predictions.find(p => p.status === 'Warning' || p.status === 'Incompatible');
              return (
                <div className="relative bg-surface-container-lowest/85 backdrop-blur-md rounded-xl border-l-4 border-error shadow-[0_4px_24px_rgba(0,0,0,0.03)] border-t border-r border-b border-outline-variant/30 p-5 overflow-hidden">
                  <div className="absolute -right-6 -top-6 text-error/5 rotate-12 select-none pointer-events-none">
                    <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-xs font-semibold text-error uppercase tracking-wider mb-1 flex items-center gap-1">
                          {warningItem.status === 'Incompatible' ? 'High Risk Interaction' : 'Moderate Risk Interaction'}
                        </div>
                        <h3 className="font-headline font-bold text-xl text-on-surface">{predictionResult.api_name} + {warningItem.excipient}</h3>
                      </div>
                      <div className="bg-error-container text-on-error-container font-mono text-xs px-2 py-1 rounded font-semibold border border-error/20">
                        Score: {warningItem.compatibility_score}
                      </div>
                    </div>
              
              <div className="space-y-4">
                <div className="bg-surface-container-low p-3 rounded border border-outline-variant/20">
                  <span className="text-xs font-label text-on-surface-variant block mb-1">Source Analysis</span>
                  <div className="flex items-center gap-2 text-sm font-medium text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">psychology</span>
                    {warningItem.reason}
                  </div>
                </div>

                {/* Feature Importance Section */}
                {warningItem.feature_importance && (
                  <div className="bg-surface-container-lowest p-3 rounded border border-outline-variant/20">
                    <span className="text-xs font-label text-on-surface-variant block mb-2">AI Feature Importance (Why?)</span>
                    <div className="space-y-2">
                      {Object.entries(warningItem.feature_importance).sort((a, b) => b[1] - a[1]).map(([feature, impact]) => (
                        <div key={feature}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-on-surface">{feature.replace(/_/g, ' ')}</span>
                            <span className="text-on-surface-variant font-mono">{impact}%</span>
                          </div>
                          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                            <div className="bg-error h-1.5 rounded-full" style={{ width: `${impact}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex flex-col gap-2">
                <button 
                  onClick={() => navigate('/lab-validation')}
                  className="w-full px-4 py-2 bg-primary-container text-white rounded font-label text-sm font-semibold hover:bg-[#005b6f] transition-colors duration-150 flex justify-center items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">science</span>
                  Tandai Validasi Lab
                </button>
                <button 
                  onClick={() => navigate('/model-insights', { state: { predictionItem: warningItem, apiName: predictionResult.api_name } })}
                  className="w-full px-4 py-2 border border-outline text-on-surface bg-transparent rounded font-label text-sm font-semibold hover:bg-surface transition-colors duration-150 flex justify-center items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  Lihat Detail ML
                </button>
              </div>
            </div>
          </div>
            );
          })()
          ) : (
          <div className="bg-[#e8f5e9] border border-[#a5d6a7] p-5 rounded-xl shadow-sm">
             <h3 className="text-[#2e7d32] font-bold flex items-center gap-2 mb-2"><span className="material-symbols-outlined">check_circle</span> All Clear!</h3>
             <p className="text-sm text-[#1b5e20]">Tidak ada peringatan interaksi untuk formulasi ini. Semua eksipien tergolong aman.</p>
          </div>
          )}

          {/* Action Bar Card */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-5 shadow-sm">
            <h3 className="font-headline font-bold text-on-surface text-base mb-4">Report Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2.5 border border-outline-variant text-on-surface bg-white rounded font-label text-sm font-medium hover:bg-surface-container-low transition-colors duration-150 flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">picture_as_pdf</span>
                  Export PDF
                </div>
                <span className="material-symbols-outlined text-[16px] text-outline-variant group-hover:text-primary transition-colors">arrow_forward</span>
              </button>
              <button className="w-full px-4 py-2.5 border border-outline-variant text-on-surface bg-white rounded font-label text-sm font-medium hover:bg-surface-container-low transition-colors duration-150 flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">csv</span>
                  Export CSV
                </div>
                <span className="material-symbols-outlined text-[16px] text-outline-variant group-hover:text-primary transition-colors">arrow_forward</span>
              </button>
              <div className="pt-3 mt-3 border-t border-outline-variant/30">
                <button 
                  onClick={() => navigate('/projects')}
                  className="w-full px-4 py-2.5 bg-[#004251] text-white rounded font-label text-sm font-semibold hover:bg-[#005b6f] transition-colors duration-150 flex justify-center items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  Validasi Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
