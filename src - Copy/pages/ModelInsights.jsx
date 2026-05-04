import { featureImportance, modelVersions } from '../data/dummyData';
import { usePrediction } from '../context/PredictionContext';

export default function ModelInsights() {
  const activeModel = modelVersions[0]; // Active version
  const { predictionResult } = usePrediction();
  
  // Ambil API Name dan Excipient yang memiliki warning/incompatible
  const apiName = predictionResult?.api_name || "Unknown API";
  const warningExcipient = predictionResult?.predictions?.find(p => p.status === 'Warning' || p.status === 'Incompatible')?.excipient || "Unknown Excipient";
  const modelStatus = predictionResult?.predictions?.find(p => p.status === 'Warning' || p.status === 'Incompatible')?.status || "Safe";

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-tertiary">
            <span className="material-symbols-outlined text-sm">psychology</span>
            <span>SHAP Interpretability Dashboard</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">Model Insights</h1>
          <p className="text-on-surface-variant text-sm mt-1">Understanding the factors driving the ML predictions for {apiName} + {warningExcipient}.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface-container-low border border-outline-variant/50 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
            <span className="text-on-surface-variant">Model:</span>
            <span className="font-semibold text-primary">{activeModel.version}</span>
            <span className={`w-2 h-2 rounded-full ${activeModel.status === 'Active' ? 'bg-[#003a7f]' : 'bg-outline'} ml-1`}></span>
          </div>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest/85 backdrop-blur-[12px] p-5 rounded-xl border border-outline-variant/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#e3f2fd] text-[#003a7f] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">troubleshoot</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider mb-1">Global Confidence</p>
            <p className="text-2xl font-bold text-on-surface">82<span className="text-lg text-on-surface-variant">%</span></p>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest/85 backdrop-blur-[12px] p-5 rounded-xl border border-outline-variant/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-error-container/50 text-[#93000a] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider mb-1">Primary Driver</p>
            <p className="text-xl font-bold text-on-surface truncate">LogP Difference</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest/85 backdrop-blur-[12px] p-5 rounded-xl border border-outline-variant/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-tertiary-fixed-dim text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">model_training</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider mb-1">Algorithm</p>
            <p className="text-xl font-bold text-on-surface">Random Forest</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* SHAP Plot Chart */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center">
            <h2 className="font-headline font-bold text-on-surface text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">bar_chart</span>
              Feature Importance (SHAP Values)
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {featureImportance.map((feature, index) => {
                // Max importance is 0.35 in our dummy data, so we scale relative to 0.40 for UI
                const widthPercent = (feature.importance / 0.40) * 100;
                
                return (
                  <div key={index} className="relative">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-semibold text-sm text-on-surface">{feature.feature}</span>
                      <span className="text-xs font-mono text-on-surface-variant font-medium">+{feature.importance.toFixed(3)}</span>
                    </div>
                    <div className="w-full bg-surface-variant rounded-full h-3 overflow-hidden flex">
                      <div 
                        className="bg-primary-container h-3 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${widthPercent}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1.5">{feature.description}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 pt-4 border-t border-outline-variant/30 flex justify-between text-xs text-outline font-medium">
              <span>Low Impact</span>
              <span>High Impact</span>
            </div>
          </div>
        </div>

        {/* AI Insight Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 shadow-sm relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute -right-8 -top-8 text-primary-container/5 rotate-12 select-none pointer-events-none">
              <span className="material-symbols-outlined text-[150px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>

            <div className="relative z-10">
              <h3 className="font-headline font-bold text-on-surface text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">lightbulb</span>
                Interpretability Summary
              </h3>
              
              <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed font-body">
                <p>
                  Berdasarkan model <strong>{activeModel.version}</strong>, interaksi antara <strong className="text-on-surface">{apiName}</strong> dan <strong className="text-on-surface">{warningExcipient}</strong> memiliki probabilitas <strong className="text-error">{modelStatus} Risk</strong>.
                </p>
                <p>
                  Prediksi ini sangat dipengaruhi oleh <strong>LogP Difference (+0.35)</strong>. Perbedaan sifat fisikokimia yang mencolok antara kedua molekul menyebabkan risiko pemisahan fase dan agregasi.
                </p>
                <div className="bg-error-container/40 border border-error-container p-3 rounded text-on-surface">
                  <span className="font-semibold text-[#93000a] block mb-1">Rekomendasi Tindakan:</span>
                  Disarankan untuk menggunakan surfaktan non-ionik (seperti Polysorbate 80) sebagai alternatif SLS untuk mengurangi risiko inkompatibilitas.
                </div>
              </div>

              <button className="w-full mt-6 bg-primary-container text-white py-2 rounded font-label text-sm font-semibold hover:bg-[#005b6f] transition-colors duration-150 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Download SHAP Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
