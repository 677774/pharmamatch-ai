import { useLocation, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

export default function ModelInsights() {
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
    'Ionic Interaction (pKa Gap)': {
      desc: 'Perbedaan nilai pKa yang mencolok (Ionic Interaction Risk).',
      risk: 'Dapat memicu reaksi asam-basa langsung atau pengendapan garam obat yang menurunkan bioavailabilitas.',
      solution: 'Gunakan dapar (buffer) mikro-lingkungan untuk menstabilkan pH atau gunakan pemisah fisik seperti penyalutan.'
    },
    'Polar Surface Area Mismatch': {
      desc: 'Perbedaan luas permukaan polar (Topological Polar Surface Area).',
      risk: 'Ketidakcocokan polaritas menyebabkan interaksi antarmuka yang buruk, mengurangi kestabilan fisik atau kelarutan.',
      solution: 'Tambahkan zat pembasah (wetting agent) atau surfaktan yang sesuai untuk meredakan tegangan antarmuka.'
    },
    'Chemical Miscibility (Hansen/Tanimoto)': {
      desc: 'Kemiripan struktur kimia dan parameter kelarutan (Miscibility).',
      risk: 'Struktur yang terlalu berbeda membatasi pencampuran homogen, berisiko memicu segregasi serbuk selama produksi.',
      solution: 'Gunakan pengikat (binder) netral atau lakukan granulasi basah untuk memediasi batas fase molekul.'
    },
    'Chemical Reactivity Flag': {
      desc: 'Keberadaan gugus fungsi reaktif yang rentan (ester, amina reduksi, dll).',
      risk: 'Sensitif terhadap degradasi kimia seperti Esterifikasi, reaksi Maillard, atau Oksidasi.',
      solution: 'Kontrol kelembapan udara seketat mungkin (<2% RH), hindari panas tinggi, atau tambahkan antioksidan.'
    },
    'Hydrogen Bond Instability': {
      desc: 'Ketidakseimbangan jumlah donor/akseptor ikatan hidrogen (Lipinski-aligned).',
      risk: 'Memicu kompetisi ikatan hidrogen intramolekuler yang tidak merata, berisiko mengganggu kelarutan obat.',
      solution: 'Pilih eksipien penyangga yang tidak berkompetisi dalam membentuk ikatan hidrogen kuat.'
    },
    'LogP Solubility Difference': {
      desc: 'Perbedaan kelarutan hidrofilik/lipofilik (LogP Gap).',
      risk: 'Membatasi dispersi homogen zat aktif dalam matriks eksipien, terutama pada sediaan cair/semi-solid.',
      solution: 'Tambahkan surfaktan larut air atau lakukan dispersi padat (solid dispersion).'
    },
    'Molecular Weight Imbalance': {
      desc: 'Rasio berat molekul yang tidak seimbang (Lipinski MW Gap).',
      risk: 'Perbedaan ukuran molekul besar-kecil memicu segregasi fisik saat pengempaan tablet.',
      solution: 'Gunakan pengisi dengan ukuran partikel mikro agar kerapatan massa seragam.'
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
                  <p>No AI feature importance data available (possibly using fallback rules).</p>
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
                
                <div className="bg-surface-container-low border border-outline-variant/30 p-4 rounded-lg shadow-inner text-on-surface my-3">
                  <p className="italic mb-3">"{predictionItem.reason}"</p>
                  {predictionItem.source && (
                    <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-primary">
                      <span className="material-symbols-outlined text-[14px]">menu_book</span>
                      Sumber Literatur: {predictionItem.source}
                    </div>
                  )}
                </div>

                {isWarning && (
                  <div className="bg-white/80 border border-error-container p-4 rounded-lg shadow-sm">
                    <span className="font-bold text-[#93000a] flex items-center gap-1 mb-2">
                      <span className="material-symbols-outlined text-[18px]">verified</span> Solusi & Rekomendasi Formulasi:
                    </span>
                    <span className="text-on-surface font-medium leading-relaxed block">
                      {predictionItem.solution || insight.solution}
                    </span>
                  </div>
                )}
                
                {!isWarning && (
                  <div className="bg-[#e8f5e9]/70 border border-[#a5d6a7] p-4 rounded-lg shadow-sm">
                    <span className="font-bold text-[#2e7d32] flex items-center gap-1 mb-2">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span> Safe Formulation
                    </span>
                    <span className="text-[#1b5e20] font-medium leading-relaxed block">
                      {predictionItem.solution || "Properti fisikokimia senyawa selaras. Lanjutkan ke pengujian stabilitas standar."}
                    </span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => {
                  try {
                    const doc = new jsPDF('p', 'mm', 'a4');
                    const pageW = doc.internal.pageSize.getWidth();
                    const margin = 15;
                    let y = 15;

                    // Helper to strip emojis/unsupported characters causing jsPDF encoding corruption
                    const cleanText = (text) => {
                      if (!text) return "";
                      return text
                        .replace(/⚠️/g, "[!]")
                        .replace(/⛔/g, "[X]")
                        .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '')
                        .trim();
                    };

                    // Header
                    doc.setFillColor(0, 66, 81);
                    doc.rect(0, 0, pageW, 32, 'F');
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(16);
                    doc.setFont('helvetica', 'bold');
                    doc.text('PharmaMatch AI — SHAP Insight Report', margin, 14);
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    doc.text(`Generated: ${new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' })}`, margin, 22);
                    doc.text(`Target: ${cleanText(displayedTarget)}`, margin, 28);
                    y = 40;

                    // Status
                    doc.setTextColor(0, 66, 81);
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`Status: ${cleanText(predictionItem.status)}`, margin, y);
                    y += 8;
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(60, 60, 60);
                    const reasonLines = doc.splitTextToSize(`Analysis: ${cleanText(predictionItem.reason)}`, pageW - margin * 2);
                    doc.text(reasonLines, margin, y);
                    y += reasonLines.length * 4 + 6;

                    if (predictionItem.solution) {
                      const solLines = doc.splitTextToSize(`Recommendation: ${cleanText(predictionItem.solution)}`, pageW - margin * 2);
                      doc.text(solLines, margin, y);
                      y += solLines.length * 4 + 6;
                    }

                    // Feature Importance
                    doc.setTextColor(0, 66, 81);
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.text('Feature Importance Breakdown', margin, y);
                    y += 7;
                    featureList.forEach(f => {
                      doc.setFontSize(9);
                      doc.setFont('helvetica', 'normal');
                      doc.setTextColor(60, 60, 60);
                      doc.text(`${cleanText(f.feature.replace(/_/g, ' '))}: ${f.importance.toFixed(1)}%`, margin, y);
                      // Bar
                      doc.setFillColor(isWarning ? 186 : 0, isWarning ? 26 : 66, isWarning ? 26 : 81);
                      doc.rect(margin + 80, y - 3, (pageW - margin * 2 - 80) * (f.importance / 100), 3, 'F');
                      y += 6;
                    });

                    // Footer
                    doc.setFontSize(7);
                    doc.setTextColor(130, 130, 130);
                    doc.setFont('helvetica', 'italic');
                    doc.text('PharmaMatch AI — Computational prediction. Verify experimentally.', margin, doc.internal.pageSize.getHeight() - 8);

                    doc.save(`SHAP_Report_${displayedTarget.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
                    toast.success('SHAP Report downloaded!');
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to generate report');
                  }
                }}
                className={`w-full mt-6 py-2.5 rounded font-label text-sm font-bold transition-colors duration-150 flex items-center justify-center gap-2 shadow-sm ${isWarning ? 'bg-error text-white hover:bg-[#93000a]' : 'bg-[#004251] text-white hover:bg-[#005b6f]'}`}
              >
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
