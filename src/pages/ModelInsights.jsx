import { useLocation, Link } from 'react-router-dom';
import { modelVersions } from '../data/dummyData';

export default function ModelInsights() {
  const activeModel = modelVersions[0]; // Active version
  const location = useLocation();
  const { predictionItem, apiName } = location.state || {};

  if (!predictionItem) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <span className="material-symbols-outlined text-6xl text-outline mb-4" style={{ fontVariationSettings: "'wght' 300" }}>search_off</span>
        <h2 className="text-2xl font-bold font-headline text-on-surface">No Data Selected</h2>
        <p className="text-on-surface-variant mt-2 mb-8 text-center max-w-md">Please go back to the Compatibility Report and click on a specific prediction row to view its detailed AI insights.</p>
        <Link to="/report" className="px-6 py-3 bg-[#004251] text-white rounded font-label text-sm font-semibold hover:bg-[#005b6f] transition-colors flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Return to Report
        </Link>
      </div>
    );
  }

  // --- AI Knowledge Base Mapping ---
  const insightDictionary = {
    'LogP_Difference': {
      desc: 'Perbedaan nilai koefisien partisi (LogP) yang mencolok.',
      risk: 'Perbedaan sifat hidrofilik dan lipofilik dapat menyebabkan pemisahan fase dan agregasi partikel dalam suspensi atau emulsi.',
      solution: 'Gunakan surfaktan tambahan (seperti Polysorbate 80) atau kosolven untuk menjembatani perbedaan kelarutan.'
    },
    'Molecular_Weight_Ratio': {
      desc: 'Rasio berat molekul yang sangat tidak seimbang.',
      risk: 'Perbedaan ukuran molekul yang jauh dapat mengganggu homogenitas pencampuran dan memicu segregasi fisik.',
      solution: 'Pertimbangkan teknik granulasi basah atau pengayakan (milling) untuk memastikan distribusi ukuran partikel seragam.'
    },
    'PSA_Difference': {
      desc: 'Perbedaan luas permukaan polar (Topological Polar Surface Area).',
      risk: 'Perbedaan daya tembus dan afinitas kelembapan menyebabkan interaksi antarmuka yang buruk antara zat aktif dan matriks penyalut.',
      solution: 'Evaluasi penggunaan wetting agent yang tepat untuk meratakan interaksi permukaan partikel obat.'
    },
    'H_Donor_Difference': {
      desc: 'Perbedaan kapasitas donor Ikatan Hidrogen.',
      risk: 'Memicu kompetisi ikatan hidrogen intramolekuler yang tidak merata, berisiko mengganggu kestabilan polimer pengikat.',
      solution: 'Pilih eksipien turunan selulosa yang memiliki profil donor H lebih stabil.'
    },
    'H_Acceptor_Difference': {
      desc: 'Perbedaan kapasitas akseptor Ikatan Hidrogen.',
      risk: 'Dapat memicu kristalisasi spontan atau perubahan polimorfisme zat aktif akibat interaksi dipol yang berlebihan.',
      solution: 'Uji polimorfisme tambahan dan pertimbangkan penggunaan PVP untuk menstabilkan struktur amorf.'
    },
    'Rotatable_Bonds_Difference': {
      desc: 'Perbedaan fleksibilitas molekul (Rotatable Bonds).',
      risk: 'Ketidakcocokan fleksibilitas konformasi menyulitkan eksipien untuk "membungkus" zat aktif, menyebabkan pelepasan obat yang tidak terkontrol.',
      solution: 'Gunakan plasticizer atau eksipien polimerik panjang untuk mengakomodasi molekul kaku.'
    },
    'FractionCSP3_Difference': {
      desc: 'Perbedaan tingkat saturasi karbon dan kompleksitas molekul (Fraction C sp3).',
      risk: 'Molekul datar (aromatik) vs molekul 3D (saturasi tinggi) menyebabkan gangguan penumpukan kristal (crystal packing disruption).',
      solution: 'Tinjau kembali kompatibilitas sterik dan pertimbangkan agen pengisi (filler) yang amorf.'
    },
    'Ring_Count_Difference': {
      desc: 'Perbedaan jumlah struktur cincin (Ring Count).',
      risk: 'Kekakuan cincin aromatik vs alifatik dapat memicu pemisahan fisik seiring berjalannya waktu (shelf-life stability issue).',
      solution: 'Periksa kembali studi kompatibilitas long-term dan gunakan agen pengikat yang mampu menjembatani perbedaan sterik.'
    },
    'Heavy_Atom_Difference': {
      desc: 'Ketidakseimbangan jumlah atom berat (Heavy Atom Count).',
      risk: 'Perbedaan ukuran elektron/atom yang besar dapat mengubah kerapatan elektron lokal dan memicu reaksi elektrofilik lemah.',
      solution: 'Gunakan eksipien penstabil non-reaktif dan hindari pemanasan suhu tinggi saat pencampuran.'
    }
  };

  const rawFeatures = predictionItem.feature_importance || {};
  const featureList = Object.keys(rawFeatures).map(key => ({
    feature: key,
    importance: rawFeatures[key]
  })).sort((a, b) => b.importance - a.importance);

  const topFeature = featureList.length > 0 ? featureList[0] : { feature: 'General Stability', importance: 100 };
  const insight = insightDictionary[topFeature.feature] || { 
    desc: 'Berdasarkan properti fisikokimia umum.', 
    risk: 'Dapat terjadi interaksi kompleks yang belum sepenuhnya terpetakan dalam literatur spesifik.', 
    solution: 'Perlu pengujian kompatibilitas fisik di laboratorium secara menyeluruh (Stress Testing).' 
  };

  const displayedTarget = predictionItem.excipient; // the specific excipient or pair
  const isWarning = predictionItem.status === 'Warning' || predictionItem.status === 'Incompatible';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-tertiary">
            <span className="material-symbols-outlined text-sm">psychology</span>
            <span>SHAP Interpretability Dashboard</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">Model Insights</h1>
          <p className="text-on-surface-variant text-sm mt-1">Understanding the factors driving the ML predictions for: <strong className="text-primary">{displayedTarget}</strong>.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/report" className="px-4 py-2 border border-outline-variant text-on-surface bg-white rounded font-label text-sm font-semibold hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Report
          </Link>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest/85 backdrop-blur-[12px] p-5 rounded-xl border border-outline-variant/40 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isWarning ? 'bg-error-container/50 text-[#93000a]' : 'bg-[#e8f5e9] text-[#2e7d32]'}`}>
            <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider mb-1">Status Prediction</p>
            <p className={`text-xl font-bold ${isWarning ? 'text-[#93000a]' : 'text-[#2e7d32]'}`}>{predictionItem.status}</p>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest/85 backdrop-blur-[12px] p-5 rounded-xl border border-outline-variant/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#e3f2fd] text-[#003a7f] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">troubleshoot</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-outline uppercase tracking-wider mb-1">Primary Driver</p>
            <p className="text-lg font-bold text-on-surface truncate">{topFeature.feature.replace(/_/g, ' ')}</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest/85 backdrop-blur-[12px] p-5 rounded-xl border border-outline-variant/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-tertiary-fixed-dim text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">model_training</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider mb-1">Algorithm</p>
            <p className="text-lg font-bold text-on-surface">Random Forest (Live)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* SHAP Plot Chart */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center">
            <h2 className="font-headline font-bold text-on-surface text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">bar_chart</span>
              Feature Importance (Percentage)
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-5">
              {featureList.length > 0 ? (
                featureList.map((f, index) => {
                  const widthPercent = f.importance; // Since backend already sends percentages
                  return (
                    <div key={index} className="relative group">
                      <div className="flex justify-between items-end mb-1">
                        <span className="font-semibold text-sm text-on-surface">{f.feature.replace(/_/g, ' ')}</span>
                        <span className="text-xs font-mono font-medium" style={{ color: isWarning ? '#93000a' : '#004251' }}>{f.importance.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-surface-variant rounded-full h-2.5 overflow-hidden flex shadow-inner">
                        <div 
                          className="h-2.5 rounded-full transition-all duration-1000 ease-out" 
                          style={{ 
                            width: `${widthPercent}%`, 
                            backgroundColor: isWarning ? (index === 0 ? '#ba1a1a' : '#ffb4ab') : (index === 0 ? '#004251' : '#b1cbdb')
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center text-on-surface-variant">
                  <p>Tidak ada data feature importance dari AI (kemungkinan menggunakan fallback rule).</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-4 border-t border-outline-variant/30 flex justify-between text-xs text-outline font-medium">
              <span>Low Impact</span>
              <span>High Impact</span>
            </div>
          </div>
        </div>

        {/* AI Insight Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`border rounded-xl p-6 shadow-sm relative overflow-hidden ${isWarning ? 'bg-error-container/10 border-error-container/50' : 'bg-surface-container-lowest border-outline-variant/50'}`}>
            {/* Ambient Background */}
            <div className={`absolute -right-8 -top-8 rotate-12 select-none pointer-events-none ${isWarning ? 'text-error/5' : 'text-primary-container/5'}`}>
              <span className="material-symbols-outlined text-[150px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>

            <div className="relative z-10">
              <h3 className={`font-headline font-bold text-lg mb-4 flex items-center gap-2 ${isWarning ? 'text-error' : 'text-primary'}`}>
                <span className="material-symbols-outlined">lightbulb</span>
                Interpretability Summary
              </h3>
              
              <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed font-body">
                <p>
                  Berdasarkan analisis sistem, interaksi pada <strong className="text-on-surface">{displayedTarget}</strong> dikategorikan sebagai <strong className={isWarning ? 'text-error' : 'text-[#2e7d32]'}>{predictionItem.status}</strong>.
                </p>
                <p>
                  Sistem mendeteksi bahwa faktor paling berpengaruh ({topFeature.importance.toFixed(1)}%) adalah <strong>{topFeature.feature.replace(/_/g, ' ')}</strong>.
                </p>
                
                <div className="bg-surface-container-low border border-outline-variant/30 p-3 rounded-lg shadow-inner text-on-surface italic my-3">
                  "{predictionItem.reason}"
                </div>

                {isWarning && (
                  <div className="bg-white/80 border border-error-container p-3 rounded-lg shadow-sm">
                    <span className="font-bold text-[#93000a] flex items-center gap-1 mb-1.5">
                      <span className="material-symbols-outlined text-[16px]">verified</span> Rekomendasi:
                    </span>
                    <span className="text-on-surface text-sm">
                      {topFeature.feature.includes("Literatur") 
                        ? "Interaksi ini sudah dipetakan secara literatur. Hindari kombinasi formulasi ini atau gunakan strategi pemisahan fisik (contoh: granulasi terpisah atau penyalutan ganda)." 
                        : insight.solution}
                    </span>
                  </div>
                )}
                
                {!isWarning && (
                  <div className="bg-[#e8f5e9]/70 border border-[#a5d6a7] p-3 rounded-lg shadow-sm">
                    <span className="font-bold text-[#2e7d32] flex items-center gap-1 mb-1.5">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span> Safe Formulation
                    </span>
                    <span className="text-[#1b5e20] text-sm">Properti fisikokimia senyawa selaras. Lanjutkan ke pengujian stabilitas standar.</span>
                  </div>
                )}
              </div>

              <button className={`w-full mt-6 py-2.5 rounded font-label text-sm font-bold transition-colors duration-150 flex items-center justify-center gap-2 shadow-sm ${isWarning ? 'bg-error text-white hover:bg-[#93000a]' : 'bg-[#004251] text-white hover:bg-[#005b6f]'}`}>
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
