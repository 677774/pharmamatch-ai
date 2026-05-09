import { useState, useEffect } from 'react';

export default function LabValidation() {
  const [pendingValidations, setPendingValidations] = useState([]);
  const [recentValidations, setRecentValidations] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const savedPending = JSON.parse(localStorage.getItem('pharmamatch_pending_validations') || '[]');
    const savedRecent = JSON.parse(localStorage.getItem('pharmamatch_recent_validations') || '[]');
    setPendingValidations(savedPending);
    setRecentValidations(savedRecent);
    if (savedPending.length > 0) {
      setExpandedId(savedPending[0].id);
    }
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSaveValidation = (e, item) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const status = formData.get(`status_${item.id}`);
    const method = formData.get('method');

    if (!status) {
      alert('Mohon pilih Hasil Uji Klinis (Kompatibel / Inkompatibel)');
      return;
    }

    const newItem = {
      ...item,
      result: status === 'Kompatibel' ? 'Compatible' : 'Incompatible',
      method: method || 'Standard Test',
      dateValidated: new Date().toISOString()
    };

    const newPending = pendingValidations.filter(v => v.id !== item.id);
    const newRecent = [newItem, ...recentValidations];

    setPendingValidations(newPending);
    setRecentValidations(newRecent);

    localStorage.setItem('pharmamatch_pending_validations', JSON.stringify(newPending));
    localStorage.setItem('pharmamatch_recent_validations', JSON.stringify(newRecent));
    setExpandedId(null);
  };

  const accuracy = recentValidations.length === 0 ? 0 : 
    Math.round((recentValidations.filter(v => 
      (v.predictedStatus === 'Compatible' && v.result === 'Compatible') || 
      (v.predictedStatus !== 'Compatible' && v.result !== 'Compatible')
    ).length / recentValidations.length) * 100);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      {/* Stats Header */}
      <div className="bg-surface-container-lowest/85 backdrop-blur-[12px] border border-outline-variant/40 rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="font-headline text-2xl font-extrabold text-primary mb-1">Validation Metrics</h2>
          <p className="font-body text-sm text-secondary">Clinical Precision Overview</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium font-body bg-surface-container-low p-3 rounded-lg border border-outline-variant/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#cf9c6c]"></span>
            <span className="text-on-surface">{pendingValidations.length} Pending</span>
          </div>
          <span className="text-outline-variant">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#003a7f]"></span>
            <span className="text-on-surface">{recentValidations.length} Validated</span>
          </div>
          <span className="text-outline-variant">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            <span className="text-on-surface">{accuracy}% Prediction Accuracy</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Pending Validations Column */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-headline text-lg font-bold text-primary flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#cf9c6c]" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
            Pending Validations
          </h3>

          {pendingValidations.map((item) => (
            <article key={item.id} className="bg-white border border-outline-variant/50 rounded-xl overflow-hidden group shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              {/* Header / Summary */}
              <div 
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-surface-container-lowest transition-colors"
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-headline font-bold text-base text-on-surface">{item.api} + {item.excipient}</h4>
                    {item.predictedStatus === 'Warning' ? (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#ffdad6] text-[#93000a] uppercase tracking-wider font-label">Moderate Risk</span>
                    ) : item.predictedStatus === 'Compatible' ? (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#d2e6ee] text-[#004251] uppercase tracking-wider font-label">Low Risk</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-outline-variant/30 text-on-surface-variant uppercase tracking-wider font-label">Unknown</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-secondary font-body">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">psychology</span> 
                      AI Confidence: {item.confidence}%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">science</span> 
                      Batch: BT-{item.id}-A
                    </span>
                  </div>
                </div>
                <button className="text-primary hover:bg-surface-container-low p-2 rounded-full transition-colors self-start sm:self-auto">
                  <span className="material-symbols-outlined transition-transform duration-200" style={{ transform: expandedId === item.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                </button>
              </div>

              {/* Validation Form (Expanded State) */}
              {expandedId === item.id && (
                <div className="border-t border-outline-variant/40 bg-surface-container-lowest p-5 animate-fade-in">
                  <form className="space-y-5" onSubmit={(e) => handleSaveValidation(e, item)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Status */}
                      <div>
                        <label className="block font-label text-xs font-semibold text-secondary uppercase mb-3">Hasil Uji Klinis</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input className="form-radio text-[#003a7f] focus:ring-[#003a7f] border-outline-variant h-4 w-4" name={`status_${item.id}`} value="Kompatibel" type="radio" />
                            <span className="font-body text-sm font-medium text-on-surface">Kompatibel</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input className="form-radio text-[#ba1a1a] focus:ring-[#ba1a1a] border-outline-variant h-4 w-4" name={`status_${item.id}`} value="Inkompatibel" type="radio" />
                            <span className="font-body text-sm font-medium text-on-surface">Inkompatibel</span>
                          </label>
                        </div>
                      </div>

                      {/* Date Picker */}
                      <div>
                        <label className="block font-label text-xs font-semibold text-secondary uppercase mb-2">Tanggal Validasi</label>
                        <div className="relative">
                          <input className="w-full bg-white border border-outline-variant/70 text-on-surface text-sm rounded-md focus:ring-2 focus:ring-primary-container focus:border-primary-container block p-2.5 font-body" type="date" required />
                        </div>
                      </div>
                    </div>

                    {/* Dropdown */}
                    <div>
                      <label className="block font-label text-xs font-semibold text-secondary uppercase mb-2">Metode Uji</label>
                      <select name="method" className="bg-white border border-outline-variant/70 text-on-surface text-sm rounded-md focus:ring-2 focus:ring-primary-container focus:border-primary-container block w-full p-2.5 font-body" required defaultValue="">
                        <option value="" disabled>Select method...</option>
                        <option value="dsc">DSC (Differential Scanning Calorimetry)</option>
                        <option value="ftir">FTIR (Fourier Transform Infrared Spectroscopy)</option>
                        <option value="xrd">XRD (X-Ray Diffraction)</option>
                        <option value="tga">TGA (Thermogravimetric Analysis)</option>
                      </select>
                    </div>

                    {/* Text Area */}
                    <div>
                      <label className="block font-label text-xs font-semibold text-secondary uppercase mb-2">Catatan Lab</label>
                      <textarea 
                        className="block p-2.5 w-full text-sm text-on-surface bg-white rounded-md border border-outline-variant/70 focus:ring-2 focus:ring-primary-container focus:border-primary-container font-body resize-none" 
                        placeholder="Enter clinical observations..." 
                        rows="3"
                      ></textarea>
                    </div>

                    {/* Action */}
                    <div className="flex justify-end pt-2">
                      <button 
                        className="bg-primary-container hover:bg-[#005b6f] text-white font-body font-medium text-sm px-5 py-2.5 rounded transition-colors duration-150 focus:ring-2 focus:ring-offset-2 focus:ring-primary-container" 
                        type="submit"
                      >
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
              <p>No pending validations. All clean!</p>
            </div>
          )}
        </section>

        {/* Recently Validated Column */}
        <aside className="flex flex-col gap-4">
          <h3 className="font-headline text-lg font-bold text-primary flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#003a7f]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Recently Validated
          </h3>
          
          <div className="bg-surface-container-lowest/85 backdrop-blur-[12px] border border-outline-variant/40 rounded-xl p-5 shadow-sm">
            <div className="relative border-l border-outline-variant/50 ml-3 space-y-6 pb-2">
              {recentValidations.map((item, index) => (
                <div key={item.id} className="relative pl-6">
                  <span className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-surface-container-lowest ${item.result === 'Compatible' ? 'bg-[#003a7f]' : 'bg-[#ba1a1a]'}`}></span>
                  <div className="flex flex-col">
                    <h4 className="font-headline font-bold text-sm text-on-surface mb-0.5">{item.api} + {item.excipient}</h4>
                    <div className="flex items-center gap-2 mb-1">
                      {item.result === 'Compatible' ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#e2e2e4] text-[#003a7f] uppercase font-label">Kompatibel</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#ffdad6] text-[#ba1a1a] uppercase font-label">Inkompatibel</span>
                      )}
                      <span className="text-xs text-secondary font-body">Lab, {item.method.toUpperCase()}</span>
                    </div>
                    <span className="text-xs text-outline font-body">Just now by Current User</span>
                  </div>
                </div>
              ))}
              {recentValidations.length === 0 && (
                 <p className="text-sm text-on-surface-variant pl-4 py-2">Belum ada data validasi.</p>
              )}
            </div>
            
            <button className="w-full mt-4 text-center text-sm font-medium text-primary-container hover:text-[#005b6f] py-2 transition-colors duration-150 font-body">
              View All History
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
