import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function KnowledgeBase() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // All, Compatible, Incompatible
  const [kbData, setKbData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetch('https://dzamar-pharmamatch-backend.hf.space/api/knowledge-base')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setKbData(data.data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching KB:", err);
        setIsLoading(false);
      });
  }, []);

  const filteredData = useMemo(() => {
    return kbData.filter(item => {
      // search filter
      const searchLower = search.toLowerCase();
      const matchesSearch = item.api.toLowerCase().includes(searchLower) || 
                            item.excipient.toLowerCase().includes(searchLower);
      
      // chip filter
      let matchesFilter = true;
      if (activeFilter === 'Compatible') {
        matchesFilter = item.status === 'Compatible';
      } else if (activeFilter === 'Incompatible' || activeFilter === 'Warning') {
        matchesFilter = item.status === activeFilter;
      }

      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter, kbData]);

  return (
    <div className="animate-fade-in flex flex-col min-h-full">
      {/* Page Header & Search */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface mb-6 tracking-tight">Knowledge Base Explorer</h1>
        
        {/* Search & Filters Container */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface font-body text-sm transition-shadow" 
              placeholder="Search API or Excipient..." 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Validated', 'Compatible'].map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-label font-medium border transition-colors ${
                  activeFilter === filter 
                    ? 'bg-secondary-container text-on-secondary-container border-transparent' 
                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/50 hover:bg-surface-container-low'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6 px-2">
          <p className="text-sm text-on-surface-variant font-label font-medium">{filteredData.length} combinations found</p>
          <button className="text-primary hover:text-primary-container text-sm font-label font-semibold flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            More Filters
          </button>
        </div>

        {/* Bento Grid / Cards Layout for Results */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-4 animate-spin">sync</span>
            <h3 className="text-lg font-headline font-bold text-on-surface mb-2">Loading Knowledge Base...</h3>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredData.map((item, idx) => (
              <div key={idx} className="bg-surface-container-lowest/85 backdrop-blur-[12px] border border-outline-variant/40 rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2 items-center">
                    <span className="material-symbols-outlined text-outline">science</span>
                    <h3 className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors">{item.api}</h3>
                  </div>
                  {item.status === 'Compatible' ? (
                    <span className="px-2 py-1 bg-[#e6f4ea] text-[#137333] rounded text-[10px] font-label font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span> Safe
                    </span>
                  ) : item.status === 'Incompatible' ? (
                    <span className="px-2 py-1 bg-error-container text-on-error-container rounded text-[10px] font-label font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">cancel</span> Danger
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-warning-container text-warning rounded text-[10px] font-label font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">warning</span> Risk
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <p className="font-body font-medium">{item.excipient}</p>
                </div>
                
                <div className="mt-auto pt-4 border-t border-outline-variant/20 flex justify-between items-center text-xs text-outline">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">menu_book</span> 
                    <span className="text-primary font-medium truncate max-w-[150px]">{item.source || "Literature"}</span>
                  </span>
                  <button onClick={() => setSelectedItem(item)} className="text-primary hover:underline font-medium font-label flex items-center gap-1">
                    View Details <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">search_off</span>
            <h3 className="text-lg font-headline font-bold text-on-surface mb-2">No combinations found</h3>
            <p className="text-sm text-on-surface-variant max-w-md">Try adjusting your search terms or filters to find what you're looking for.</p>
          </div>
        )}

        {/* Missing Excipient CTA */}
        <div className="mt-12 mb-8 flex justify-center">
          <div className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-6 text-center max-w-lg w-full flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-outline text-3xl">manage_search</span>
            <p className="font-body text-on-surface-variant text-sm">Cannot find the specific excipient combination?</p>
            <Link 
              to="/new-prediction" 
              className="inline-flex items-center gap-2 text-primary-container font-label font-bold hover:text-primary transition-colors"
            >
              Run New Prediction <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/30">
            <div className="sticky top-0 bg-surface/90 backdrop-blur-md px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center">
              <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">menu_book</span>
                Literature Details
              </h2>
              <button onClick={() => setSelectedItem(null)} className="text-outline hover:text-on-surface transition-colors p-1 rounded-full hover:bg-surface-container-high">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Header Box */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-label text-xs uppercase tracking-wider text-outline">API</span>
                    <h3 className="font-headline font-bold text-lg text-primary">{selectedItem.api}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label text-xs uppercase tracking-wider text-outline">Excipient</span>
                    <h3 className="font-headline font-medium text-base text-on-surface">{selectedItem.excipient}</h3>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-label font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit
                    ${selectedItem.status === 'Compatible' ? 'bg-[#e6f4ea] text-[#137333]' : 
                      selectedItem.status === 'Incompatible' ? 'bg-error-container text-on-error-container' : 
                      'bg-warning-container text-warning'}`}>
                    <span className="material-symbols-outlined text-[16px]">
                      {selectedItem.status === 'Compatible' ? 'check_circle' : selectedItem.status === 'Incompatible' ? 'cancel' : 'warning'}
                    </span>
                    {selectedItem.status}
                  </span>
                </div>
              </div>

              {/* Reason Box */}
              <div>
                <h4 className="font-headline font-bold text-sm text-on-surface mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">biotech</span>
                  Mekanisme Interaksi
                </h4>
                <div className="bg-surface-container-low border border-outline-variant/30 p-4 rounded-xl text-sm text-on-surface-variant leading-relaxed">
                  {selectedItem.reason}
                </div>
              </div>

              {/* Solution Box */}
              <div>
                <h4 className="font-headline font-bold text-sm text-[#93000a] mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  Solusi Formulasi
                </h4>
                <div className="bg-white/80 border border-error-container p-4 rounded-xl text-sm font-medium text-on-surface leading-relaxed shadow-sm">
                  {selectedItem.solution}
                </div>
              </div>
              
              {/* Source Footer */}
              <div className="pt-4 border-t border-outline-variant/30 flex items-start gap-2">
                 <span className="material-symbols-outlined text-outline mt-0.5 text-[18px]">import_contacts</span>
                 <div>
                   <p className="text-xs font-bold text-outline uppercase tracking-wider mb-0.5">Sumber Literatur Utama</p>
                   <p className="text-sm font-medium text-primary italic">{selectedItem.source}</p>
                 </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-surface-container-lowest px-6 py-4 border-t border-outline-variant/30 flex justify-end">
              <button onClick={() => setSelectedItem(null)} className="px-5 py-2 rounded-lg bg-surface-container-high text-on-surface font-label font-bold text-sm hover:bg-outline-variant/30 transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
