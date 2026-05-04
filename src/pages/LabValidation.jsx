import { useState } from 'react';
import { pendingValidations, recentValidations } from '../data/dummyData';

export default function LabValidation() {
  const [expandedId, setExpandedId] = useState(pendingValidations[0]?.id || null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
            <span className="text-on-surface">12 Pending</span>
          </div>
          <span className="text-outline-variant">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#003a7f]"></span>
            <span className="text-on-surface">847 Validated</span>
          </div>
          <span className="text-outline-variant">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            <span className="text-on-surface">98.2% Prediction Accuracy</span>
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
                  <form className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Status */}
                      <div>
                        <label className="block font-label text-xs font-semibold text-secondary uppercase mb-3">Hasil Uji Klinis</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input className="form-radio text-[#003a7f] focus:ring-[#003a7f] border-outline-variant h-4 w-4" name={`status_${item.id}`} type="radio" />
                            <span className="font-body text-sm font-medium text-on-surface">Kompatibel</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input className="form-radio text-[#ba1a1a] focus:ring-[#ba1a1a] border-outline-variant h-4 w-4" name={`status_${item.id}`} type="radio" />
                            <span className="font-body text-sm font-medium text-on-surface">Inkompatibel</span>
                          </label>
                        </div>
                      </div>

                      {/* Date Picker */}
                      <div>
                        <label className="block font-label text-xs font-semibold text-secondary uppercase mb-2">Tanggal Validasi</label>
                        <div className="relative">
                          <input className="w-full bg-white border border-outline-variant/70 text-on-surface text-sm rounded-md focus:ring-2 focus:ring-primary-container focus:border-primary-container block p-2.5 font-body" type="date" />
                        </div>
                      </div>
                    </div>

                    {/* Dropdown */}
                    <div>
                      <label className="block font-label text-xs font-semibold text-secondary uppercase mb-2">Metode Uji</label>
                      <select className="bg-white border border-outline-variant/70 text-on-surface text-sm rounded-md focus:ring-2 focus:ring-primary-container focus:border-primary-container block w-full p-2.5 font-body">
                        <option value="" disabled selected>Select method...</option>
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
                        type="button"
                        onClick={() => toggleExpand(item.id)}
                      >
                        Simpan Validasi
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </article>
          ))}
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
                    <h4 className="font-headline font-bold text-sm text-on-surface mb-0.5">{item.api} + {item.excipient.split(' ')[0]}</h4>
                    <div className="flex items-center gap-2 mb-1">
                      {item.result === 'Compatible' ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#e2e2e4] text-[#003a7f] uppercase font-label">Kompatibel</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#ffdad6] text-[#ba1a1a] uppercase font-label">Inkompatibel</span>
                      )}
                      <span className="text-xs text-secondary font-body">Lab, {item.method}</span>
                    </div>
                    <span className="text-xs text-outline font-body">{index === 0 ? '2 hours ago' : 'Yesterday'} by Dr. Sarah J.</span>
                  </div>
                </div>
              ))}
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
