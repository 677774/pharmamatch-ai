import { useState, useEffect } from 'react';
import { moleculeDatabase } from '../data/dummyData';

export default function MoleculeDatabase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [molecules, setMolecules] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 3D Modal State
  const [selectedMolFor3D, setSelectedMolFor3D] = useState(null);

  useEffect(() => {
    // Filter out molecules that don't have images or 3D models as per user request
    const filtered = moleculeDatabase.filter(m => m.image !== null && m.has3D);
    setMolecules(filtered);
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setMolecules(moleculeDatabase.filter(m => m.image !== null && m.has3D));
      return;
    }
    
    setLoading(true);
    try {
      // 1. Cek local data dulu untuk kecepatan
      const localResults = moleculeDatabase.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // 2. Selalu fetch dari Global PubChem API via Backend untuk data terbaru/luas
      const response = await fetch('https://dzamar-pharmamatch-backend.hf.space/api/molecules/search?name=' + encodeURIComponent(searchTerm));
      const data = await response.json();
      
      if (data.status === 'success') {
        const pubchemMol = {
          id: data.data.cid,
          name: data.data.name,
          formula: data.data.formula,
          mw: data.data.mw,
          logP: data.data.logp || "N/A",
          smiles: data.data.smiles || data.data.cas || "N/A",
          type: "Global Registry",
          has3D: true,
          image: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${data.data.cid}/PNG`
        };
        
        // Gabungkan hasil local (jika ada) dengan hasil global
        setMolecules([pubchemMol, ...localResults.filter(l => l.name !== pubchemMol.name)]);
      } else if (localResults.length > 0) {
        setMolecules(localResults);
      } else {
        setMolecules([]); 
      }
    } catch (err) {
      console.error("PubChem search failed, falling back to local search");
      const localResults = moleculeDatabase.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMolecules(localResults);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-fade-in relative">
      {/* 3D Viewer Modal */}
      {selectedMolFor3D && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/30 animate-scale-up">
            <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <h2 className="font-headline font-bold text-xl text-primary">3D Structure: {selectedMolFor3D.name}</h2>
              <button 
                onClick={() => setSelectedMolFor3D(null)}
                className="p-2 hover:bg-outline-variant/30 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 bg-black relative">
              {/* MolView iframe for robust 3D viewing */}
              <iframe 
                src={`https://embed.molview.org/v1/?mode=balls&${
                  selectedMolFor3D.id && !isNaN(selectedMolFor3D.id) && selectedMolFor3D.id > 100
                  ? `cid=${selectedMolFor3D.id}` 
                  : `q=${encodeURIComponent(selectedMolFor3D.name.replace(/\s*\(.*?\)\s*/g, '').replace(' HCL', ''))}`
                }`}
                className="w-full h-full border-0"
                title="3D MolView"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-md">
                Powered by MolView
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header & Search Area */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="font-headline text-2xl font-bold text-primary mb-1">Molecule Database</h1>
          <p className="text-on-surface-variant text-sm">Search and analyze over 10M+ structural compounds via PubChem.</p>
        </div>
        <div className="flex flex-1 max-w-2xl gap-3">
          <div className="relative w-full shadow-sm flex">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-l-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              placeholder="Search real molecules (e.g. Lisinopril)..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              className="bg-primary hover:bg-[#005b6f] text-white px-4 rounded-r-lg transition-colors font-medium text-sm flex items-center"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-primary font-medium">Querying Database...</p>
        </div>
      ) : error ? (
        <div className="bg-error-container text-on-error-container p-4 rounded-lg flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Molecule Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {molecules.map((molecule) => (
              <div key={molecule.id || molecule.name} className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden hover:border-primary-fixed-dim hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 group flex flex-col">
                <div className="h-48 bg-white flex items-center justify-center p-4 border-b border-outline-variant/30 relative shrink-0">
                  <img 
                    alt={`${molecule.name} 2D Structure`} 
                    className="max-h-full opacity-90 group-hover:opacity-100 transition-opacity" 
                    src={molecule.image}
                  />
                  <div className="absolute top-3 right-3 bg-primary-container/10 text-primary-container px-2 py-1 rounded text-xs font-semibold border border-primary-container/20 flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span> {molecule.type}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors truncate max-w-[200px]">{molecule.name}</h3>
                      <p className="text-sm text-on-surface-variant font-mono mt-1">{molecule.formula}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 flex-1">
                    <div>
                      <p className="text-xs text-outline mb-0.5">Mol Weight (BM)</p>
                      <p className="text-sm font-medium text-on-surface">{molecule.mw} g/mol</p>
                    </div>
                    <div>
                      <p className="text-xs text-outline mb-0.5">LogP</p>
                      <p className="text-sm font-medium text-on-surface">{molecule.logP}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-outline mb-0.5">SMILES</p>
                      <p className="text-[10px] font-mono bg-surface-container-low p-2 rounded text-on-surface break-all border border-outline-variant/30 line-clamp-2" title={molecule.smiles}>{molecule.smiles}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-auto">
                    <button 
                      onClick={() => setSelectedMolFor3D(molecule)}
                      className="flex-1 bg-primary hover:bg-[#005b6f] text-white py-2 rounded text-sm font-medium transition-colors duration-150 flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">3d_rotation</span> View 3D Model
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {molecules.length === 0 && (
              <div className="col-span-full py-12 text-center text-on-surface-variant bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                <p>No molecules found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
