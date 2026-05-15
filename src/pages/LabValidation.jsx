import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { LabValidationSkeleton } from '../components/ui/Skeleton';

const METHOD_FIELDS = {
  dsc: { label: 'DSC (Differential Scanning Calorimetry)', fields: [
    { name: 'onset_temp', label: 'Suhu Onset (°C)', placeholder: 'misal: 132.5', type: 'number' },
    { name: 'peak_temp', label: 'Suhu Puncak Endotermik/Eksotermik (°C)', placeholder: 'misal: 138.2', type: 'number' },
    { name: 'enthalpy', label: 'Enthalpy Perubahan ΔH (J/g)', placeholder: 'misal: -45.3', type: 'number' },
    { name: 'thermal_event', label: 'Kejadian Termal', placeholder: 'misal: Puncak endotermik baru muncul di 98°C', type: 'text' },
  ]},
  ftir: { label: 'FTIR (Fourier Transform Infrared)', fields: [
    { name: 'missing_peaks', label: 'Puncak Absorpsi yang Hilang (cm⁻¹)', placeholder: 'misal: 3320, 1650', type: 'text' },
    { name: 'shifted_peaks', label: 'Puncak yang Bergeser (cm⁻¹)', placeholder: 'misal: 1720→1705', type: 'text' },
    { name: 'new_peaks', label: 'Puncak Baru yang Muncul (cm⁻¹)', placeholder: 'misal: 1540 (amida baru)', type: 'text' },
    { name: 'functional_group', label: 'Interpretasi Gugus Fungsi', placeholder: 'misal: Hilangnya O-H stretching menandakan reaksi esterifikasi', type: 'text' },
  ]},
  xrd: { label: 'XRD (X-Ray Diffraction)', fields: [
    { name: 'crystallinity', label: 'Perubahan Kristalinitas', placeholder: '', type: 'select', options: ['Tetap Kristal', 'Sebagian Amorf', 'Fully Amorf', 'Polimorfisme Baru'] },
    { name: 'two_theta', label: 'Sudut 2θ Karakteristik (°)', placeholder: 'misal: 12.1, 17.5, 25.3', type: 'text' },
    { name: 'peak_changes', label: 'Perubahan Pola Difraksi', placeholder: 'misal: Puncak 2θ=25.3 hilang pada campuran', type: 'text' },
  ]},
  tga: { label: 'TGA (Thermogravimetric Analysis)', fields: [
    { name: 'decomp_onset', label: 'Suhu Onset Dekomposisi (°C)', placeholder: 'misal: 210', type: 'number' },
    { name: 'weight_loss_pct', label: 'Persen Kehilangan Massa (%)', placeholder: 'misal: 15.2', type: 'number' },
    { name: 'weight_loss_temp', label: 'Rentang Suhu Kehilangan Massa (°C)', placeholder: 'misal: 80-120 (air kristal)', type: 'text' },
    { name: 'residue_pct', label: 'Residu pada 600°C (%)', placeholder: 'misal: 22.5', type: 'number' },
    { name: 'interpretation', label: 'Interpretasi', placeholder: 'misal: Dekomposisi lebih awal 30°C pada campuran vs API murni', type: 'text' },
  ]},
};

export default function LabValidation() {
  const [pendingValidations, setPendingValidations] = useState([]);
  const [recentValidations, setRecentValidations] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedPending = JSON.parse(localStorage.getItem('pharmamatch_pending_validations') || '[]');
      const savedRecent = JSON.parse(localStorage.getItem('pharmamatch_recent_validations') || '[]');
      setPendingValidations(savedPending);
      setRecentValidations(savedRecent);
      if (savedPending.length > 0) setExpandedId(savedPending[0].id);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const handleSaveValidation = (e, item) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const status = formData.get(`status_${item.id}`);
    const method = selectedMethod[item.id] || 'dsc';

    if (!status) { alert('Mohon pilih Hasil Uji (Kompatibel / Inkompatibel)'); return; }

    // Collect method-specific data
    const methodData = {};
    const fields = METHOD_FIELDS[method]?.fields || [];
    fields.forEach(f => { methodData[f.name] = formData.get(f.name) || ''; });

    const labResult = status === 'Kompatibel' ? 'Compatible' : 'Incompatible';
    const aiPrediction = item.predictedStatus === 'Compatible' ? 'Compatible' : 'Incompatible';
    const confirmed = labResult === aiPrediction;

    const newItem = {
      ...item,
      result: labResult,
      method: METHOD_FIELDS[method]?.label || method,
      methodKey: method,
      methodData,
      notes: formData.get('notes') || '',
      dateValidated: new Date().toISOString(),
      confirmed,
      validationStatus: confirmed ? 'Lab Confirmed' : 'Lab Contradicted',
    };

    const newPending = pendingValidations.filter(v => v.id !== item.id);
    const newRecent = [newItem, ...recentValidations];

    setPendingValidations(newPending);
    setRecentValidations(newRecent);
    localStorage.setItem('pharmamatch_pending_validations', JSON.stringify(newPending));
    localStorage.setItem('pharmamatch_recent_validations', JSON.stringify(newRecent));

    // Update project card with validation status
    const projects = JSON.parse(localStorage.getItem('pharmamatch_projects') || '[]');
    const updatedProjects = projects.map(p => {
      if (p.api === item.api) {
        return { ...p, labStatus: confirmed ? 'confirmed' : 'contradicted' };
      }
      return p;
    });
    localStorage.setItem('pharmamatch_projects', JSON.stringify(updatedProjects));

    setExpandedId(null);
    toast.success(`Lab validation for ${item.excipient} saved!`);
  };

  const handleDeleteValidation = (id, type) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data validasi ini?')) return;

    if (type === 'pending') {
      const updated = pendingValidations.filter(v => v.id !== id);
      setPendingValidations(updated);
      localStorage.setItem('pharmamatch_pending_validations', JSON.stringify(updated));
    } else {
      const updated = recentValidations.filter(v => v.id !== id);
      setRecentValidations(updated);
      localStorage.setItem('pharmamatch_recent_validations', JSON.stringify(updated));
    }
    toast.success('Validation record deleted');
  };

  const accuracy = recentValidations.length === 0 ? 0 :
    Math.round((recentValidations.filter(v => v.confirmed).length / recentValidations.length) * 100);

  const confirmedCount = recentValidations.filter(v => v.confirmed).length;
  const contradictedCount = recentValidations.filter(v => !v.confirmed).length;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      {/* Stats Header */}
      <div className="bg-surface-container-lowest/85 backdrop-blur-[12px] border border-outline-variant/40 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-headline text-2xl font-extrabold text-primary mb-1">Lab Validation</h2>
            <p className="font-body text-sm text-secondary">Input hasil uji laboratorium untuk mengkonfirmasi prediksi AI</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/30 text-center">
            <p className="text-2xl font-bold text-on-surface font-headline">{pendingValidations.length}</p>
            <p className="text-xs text-secondary font-body mt-1">Pending</p>
          </div>
          <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/30 text-center">
            <p className="text-2xl font-bold text-on-surface font-headline">{recentValidations.length}</p>
            <p className="text-xs text-secondary font-body mt-1">Validated</p>
          </div>
          <div className="bg-[#e6f4ea] rounded-lg p-3 border border-[#a8dab5] text-center">
            <p className="text-2xl font-bold text-[#137333] font-headline">{confirmedCount}</p>
            <p className="text-xs text-[#137333] font-body mt-1">✅ AI Confirmed</p>
          </div>
          <div className="bg-[#fce8e6] rounded-lg p-3 border border-[#f5b7b1] text-center">
            <p className="text-2xl font-bold text-[#c5221f] font-headline">{contradictedCount}</p>
            <p className="text-xs text-[#c5221f] font-body mt-1">⚠️ Contradicted</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Pending Validations */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-headline text-lg font-bold text-primary flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#cf9c6c]" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
            Pending Validations
          </h3>

          {isLoading ? (
            <>
              <LabValidationSkeleton />
              <LabValidationSkeleton />
            </>
          ) : pendingValidations.map((item) => (
            <article key={item.id} className="bg-white border border-outline-variant/50 rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-surface-container-lowest transition-colors" onClick={() => toggleExpand(item.id)}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-headline font-bold text-base text-on-surface">{item.api} + {item.excipient}</h4>
                    {item.predictedStatus === 'Warning' || item.predictedStatus === 'Incompatible' ? (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#ffdad6] text-[#93000a] uppercase tracking-wider font-label">Risk</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#d2e6ee] text-[#004251] uppercase tracking-wider font-label">Safe</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-secondary font-body">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">psychology</span> AI Confidence: {item.confidence}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteValidation(item.id, 'pending'); }}
                    className="p-2 text-outline hover:text-error hover:bg-error-container/20 rounded-full transition-colors"
                    title="Hapus Validation"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                  <button className="text-primary hover:bg-surface-container-low p-2 rounded-full transition-colors">
                    <span className="material-symbols-outlined transition-transform duration-200" style={{ transform: expandedId === item.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                  </button>
                </div>
              </div>

              {expandedId === item.id && (
                <div className="border-t border-outline-variant/40 bg-surface-container-lowest p-5 animate-fade-in">
                  <form className="space-y-5" onSubmit={(e) => handleSaveValidation(e, item)}>
                    {/* Row 1: Status + Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-label text-xs font-semibold text-secondary uppercase mb-3">Hasil Uji Lab</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input className="form-radio text-[#003a7f] h-4 w-4" name={`status_${item.id}`} value="Kompatibel" type="radio" />
                            <span className="font-body text-sm font-medium text-on-surface">Kompatibel</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input className="form-radio text-[#ba1a1a] h-4 w-4" name={`status_${item.id}`} value="Inkompatibel" type="radio" />
                            <span className="font-body text-sm font-medium text-on-surface">Inkompatibel</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block font-label text-xs font-semibold text-secondary uppercase mb-2">Tanggal Validasi</label>
                        <input className="w-full bg-white border border-outline-variant/70 text-on-surface text-sm rounded-md focus:ring-2 focus:ring-primary-container block p-2.5 font-body" type="date" name="date" required />
                      </div>
                    </div>

                    {/* Method Selector */}
                    <div>
                      <label className="block font-label text-xs font-semibold text-secondary uppercase mb-2">Metode Uji Instrumen</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.entries(METHOD_FIELDS).map(([key, val]) => (
                          <button key={key} type="button"
                            onClick={() => setSelectedMethod(prev => ({ ...prev, [item.id]: key }))}
                            className={`px-3 py-2.5 rounded-lg text-xs font-semibold font-label border transition-all ${(selectedMethod[item.id] || 'dsc') === key ? 'bg-primary-container text-white border-primary-container shadow-md' : 'bg-white text-on-surface-variant border-outline-variant/50 hover:border-primary-container hover:text-primary'}`}>
                            {key.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Fields */}
                    <div className="bg-surface-container-low/50 rounded-lg p-4 border border-outline-variant/30">
                      <h5 className="font-label text-xs font-semibold text-primary uppercase mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">science</span>
                        {METHOD_FIELDS[selectedMethod[item.id] || 'dsc']?.label}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(METHOD_FIELDS[selectedMethod[item.id] || 'dsc']?.fields || []).map(field => (
                          <div key={field.name}>
                            <label className="block text-xs font-medium text-on-surface-variant mb-1 font-body">{field.label}</label>
                            {field.type === 'select' ? (
                              <select name={field.name} className="w-full bg-white border border-outline-variant/70 text-on-surface text-sm rounded-md p-2.5 font-body" defaultValue="">
                                <option value="" disabled>Pilih...</option>
                                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                            ) : (
                              <input name={field.name} type={field.type === 'number' ? 'number' : 'text'} step={field.type === 'number' ? 'any' : undefined}
                                placeholder={field.placeholder}
                                className="w-full bg-white border border-outline-variant/70 text-on-surface text-sm rounded-md p-2.5 font-body placeholder:text-outline" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block font-label text-xs font-semibold text-secondary uppercase mb-2">Catatan Lab</label>
                      <textarea name="notes" className="block p-2.5 w-full text-sm text-on-surface bg-white rounded-md border border-outline-variant/70 focus:ring-2 focus:ring-primary-container font-body resize-none" placeholder="Observasi tambahan..." rows="3"></textarea>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button className="bg-primary-container hover:bg-[#005b6f] text-white font-body font-medium text-sm px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2" type="submit">
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        Simpan Validasi
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </article>
          ))}

          {pendingValidations.length === 0 && (
            <div className="bg-white border border-outline-variant/50 rounded-xl p-8 text-center text-on-surface-variant shadow-sm">
              <span className="material-symbols-outlined text-4xl mb-2 text-outline">done_all</span>
              <p className="font-body">Tidak ada validasi pending. Jalankan prediksi baru terlebih dahulu.</p>
            </div>
          )}
        </section>

        {/* Recently Validated */}
        <aside className="flex flex-col gap-4">
          <h3 className="font-headline text-lg font-bold text-primary flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#003a7f]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Riwayat Validasi
          </h3>

          <div className="bg-surface-container-lowest/85 backdrop-blur-[12px] border border-outline-variant/40 rounded-xl p-5 shadow-sm">
            <div className="relative border-l border-outline-variant/50 ml-3 space-y-6 pb-2">
              {recentValidations.map((item) => (
                <div key={item.id} className="relative pl-6">
                  <span className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-surface-container-lowest ${item.confirmed ? 'bg-[#137333]' : 'bg-[#c5221f]'}`}></span>
                  <div className="flex flex-col">
                    <h4 className="font-headline font-bold text-sm text-on-surface mb-0.5">{item.api} + {item.excipient}</h4>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {item.confirmed ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#e6f4ea] text-[#137333] uppercase font-label">✅ Confirmed</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#fce8e6] text-[#c5221f] uppercase font-label">⚠️ Contradicted</span>
                      )}
                      <span className="text-[10px] text-secondary font-body px-1.5 py-0.5 rounded bg-surface-container-low">{item.methodKey?.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs text-outline font-body">{new Date(item.dateValidated).toLocaleDateString('id-ID')}</span>
                      <button 
                        onClick={() => handleDeleteValidation(item.id, 'recent')}
                        className="text-outline hover:text-error transition-colors p-1"
                        title="Hapus Riwayat"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {recentValidations.length === 0 && (
                <p className="text-sm text-on-surface-variant pl-4 py-2">Belum ada data validasi.</p>
              )}
            </div>
          </div>

          {/* Accuracy Card */}
          {recentValidations.length > 0 && (
            <div className="bg-surface-container-lowest/85 backdrop-blur-[12px] border border-outline-variant/40 rounded-xl p-5 shadow-sm text-center">
              <p className="text-xs text-secondary font-body uppercase tracking-wider mb-2">AI Prediction Accuracy</p>
              <p className={`text-4xl font-bold font-headline ${accuracy >= 80 ? 'text-[#137333]' : accuracy >= 50 ? 'text-[#cf9c6c]' : 'text-[#c5221f]'}`}>{accuracy}%</p>
              <p className="text-xs text-on-surface-variant font-body mt-1">Based on {recentValidations.length} lab validations</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
