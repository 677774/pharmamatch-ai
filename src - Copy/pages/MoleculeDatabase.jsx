import { useState } from 'react';

const mockMolecules = [
  {
    id: 1,
    name: "Metformin HCL",
    formula: "C4H11N5",
    weight: "129.16 g/mol",
    logp: "-2.6",
    smiles: "CN(C)C(=N)NC(=N)N",
    status: "FDA Approved",
    statusColor: "teal",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBk1HMF4ljbQ4SPRrE_buIMlyKCxhjn9Nd8RM3bxZ7K2dgpoN1ubH1zmwOZDJo7J873Af25Obl1f2JKNvYFP9ckwG7K2xExNG5EFGcxaMEj_N3vtqHDRAV6W-Qxaw2SiUCnFfHnSvJZfJ6feRIUpi1ZW-UqgHUNHS188GgZbgFLO4m-tCUGfTpianI09HLTmXx7f8bxT39GGrYXtrx6NMmUwui0ejcuL4nbWwOUsB7ISLdvajMmEb4_dsx4YuS-vWKwImiLJzoA64hJ"
  },
  {
    id: 2,
    name: "Paracetamol",
    formula: "C8H9NO2",
    weight: "151.16 g/mol",
    logp: "0.46",
    smiles: "CC(=O)NC1=CC=C(O)C=C1",
    status: "FDA Approved",
    statusColor: "teal",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiJFzN93k1DXc1yj39RJYWzXF5z4jduJ__e3fWiHsJkpoSgIMMeeWaAFwKIGh4Mp_pc1ZBp-dot7WOy2fTq6JatQpxlfsC4la7MGDWsNJR9LmskR2Pp-VtnBzz48Ar-PIuNFMyNzGWVwyLcsVT_A12PjY3mC0uELmF4aJxWs4c0VOnnA7ctkearLJ9Pb1bpNK3Nbn6YE-zXQ4f3wUIbcQXUBTy7pjoRMU9bE6jW_XX0bCOSCblIYuwC4e2Rup2PQRo6OpewiuU6YJD"
  },
  {
    id: 3,
    name: "Ibuprofen",
    formula: "C13H18O2",
    weight: "206.29 g/mol",
    logp: "3.97",
    smiles: "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O",
    status: "In Review",
    statusColor: "amber",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBblfsA98h76xO7Kg2Hy1BwkVNavrOagLPKJVvLLzpq-Z3cafgIY7oetzDP6-9EfEkVwETvTG_VvsmuTKM5RyXyWFk0J9ndGrCSgGZg9KcVZyZEYv1x4XF8yx8cd8cDMo04NUjEar3b5nO5R4TABR0-u_06CW66HrKbaiokz43Q8EKGnNCf3VcN1l_2RshpgqtecLxMQOpI7ebM9ceMAmgAPuyiGZ5YIxLJaczuXLXk9JE_eSwG7RtfavjAWLP6lonvZ8L9MruNdgEt"
  },
  {
    id: 4,
    name: "Aspirin",
    formula: "C9H8O4",
    weight: "180.16 g/mol",
    logp: "1.19",
    smiles: "CC(=O)OC1=CC=CC=C1C(=O)O",
    status: "FDA Approved",
    statusColor: "teal",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBk1HMF4ljbQ4SPRrE_buIMlyKCxhjn9Nd8RM3bxZ7K2dgpoN1ubH1zmwOZDJo7J873Af25Obl1f2JKNvYFP9ckwG7K2xExNG5EFGcxaMEj_N3vtqHDRAV6W-Qxaw2SiUCnFfHnSvJZfJ6feRIUpi1ZW-UqgHUNHS188GgZbgFLO4m-tCUGfTpianI09HLTmXx7f8bxT39GGrYXtrx6NMmUwui0ejcuL4nbWwOUsB7ISLdvajMmEb4_dsx4YuS-vWKwImiLJzoA64hJ"
  },
  {
    id: 5,
    name: "Amoxicillin",
    formula: "C16H19N3O5S",
    weight: "365.4 g/mol",
    logp: "0.87",
    smiles: "CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C",
    status: "Clinical Trials",
    statusColor: "blue",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiJFzN93k1DXc1yj39RJYWzXF5z4jduJ__e3fWiHsJkpoSgIMMeeWaAFwKIGh4Mp_pc1ZBp-dot7WOy2fTq6JatQpxlfsC4la7MGDWsNJR9LmskR2Pp-VtnBzz48Ar-PIuNFMyNzGWVwyLcsVT_A12PjY3mC0uELmF4aJxWs4c0VOnnA7ctkearLJ9Pb1bpNK3Nbn6YE-zXQ4f3wUIbcQXUBTy7pjoRMU9bE6jW_XX0bCOSCblIYuwC4e2Rup2PQRo6OpewiuU6YJD"
  }
];

export default function MoleculeDatabase() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMolecules = mockMolecules.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.smiles.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.formula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-fade-in">
      {/* Header & Search Area */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="font-headline text-2xl font-bold text-primary mb-1">Molecule Database</h1>
          <p className="text-on-surface-variant text-sm">Search and analyze over 10M+ structural compounds.</p>
        </div>
        <div className="flex flex-1 max-w-2xl gap-3">
          <div className="relative w-full shadow-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              placeholder="Search by name, SMILES, or formula..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-surface-container-lowest border border-outline-variant/50 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors text-sm font-medium text-on-surface shadow-sm">
            <span className="material-symbols-outlined">tune</span>
            Filters
          </button>
        </div>
      </div>

      {/* Active Filters (Bento Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-container-lowest/85 backdrop-blur-[12px] p-4 rounded-xl flex items-center justify-between border border-outline-variant/40 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-1">Molecular Weight</p>
            <p className="text-sm font-medium text-primary">200 - 500 g/mol</p>
          </div>
          <button className="text-outline hover:text-primary"><span className="material-symbols-outlined text-sm">close</span></button>
        </div>
        <div className="bg-surface-container-lowest/85 backdrop-blur-[12px] p-4 rounded-xl flex items-center justify-between border border-outline-variant/40 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-1">Functional Group</p>
            <p className="text-sm font-medium text-primary">Hydroxyl (-OH)</p>
          </div>
          <button className="text-outline hover:text-primary"><span className="material-symbols-outlined text-sm">close</span></button>
        </div>
        <div className="md:col-span-2 bg-primary-container p-4 rounded-xl flex items-center justify-between text-on-primary shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
            <div>
              <p className="text-sm font-medium">{filteredMolecules.length} Matches Found</p>
              <p className="text-xs opacity-80">Based on current filter criteria</p>
            </div>
          </div>
          <button className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-sm transition-colors">Clear All</button>
        </div>
      </div>

      {/* Molecule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMolecules.map((molecule) => (
          <div key={molecule.id} className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden hover:border-primary-fixed-dim hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 group flex flex-col">
            <div className="h-48 bg-surface-container-low/50 flex items-center justify-center p-4 border-b border-outline-variant/30 relative shrink-0">
              <img 
                alt={`${molecule.name} 2D Structure`} 
                className="max-h-full opacity-80 group-hover:opacity-100 transition-opacity mix-blend-multiply" 
                src={molecule.img}
              />
              <div className={`absolute top-3 right-3 bg-white px-2 py-1 rounded text-xs font-semibold text-${molecule.statusColor}-800 border border-${molecule.statusColor}-100 flex items-center gap-1 shadow-sm`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-${molecule.statusColor}-500`}></span> {molecule.status}
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-headline font-bold text-lg text-primary">{molecule.name}</h3>
                  <p className="text-sm text-on-surface-variant font-mono mt-1">{molecule.formula}</p>
                </div>
                <button className="text-outline hover:text-primary"><span className="material-symbols-outlined">bookmark_border</span></button>
              </div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 flex-1">
                <div>
                  <p className="text-xs text-outline mb-0.5">Mol Weight</p>
                  <p className="text-sm font-medium text-on-surface">{molecule.weight}</p>
                </div>
                <div>
                  <p className="text-xs text-outline mb-0.5">LogP</p>
                  <p className="text-sm font-medium text-on-surface">{molecule.logp}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-outline mb-0.5">SMILES</p>
                  <p className="text-xs font-mono bg-surface-container-low p-2 rounded text-on-surface break-all border border-outline-variant/30">{molecule.smiles}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-auto">
                <button className="flex-1 bg-primary hover:bg-[#005b6f] text-white py-2 rounded text-sm font-medium transition-colors duration-150 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">3d_rotation</span> View 3D Model
                </button>
                <button className="px-3 py-2 border border-primary text-primary rounded hover:bg-surface-container-low transition-colors duration-150">
                  <span className="material-symbols-outlined text-sm">download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredMolecules.length === 0 && (
          <div className="col-span-full py-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
            <p>No molecules found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-4 border-t border-outline-variant/30 gap-4">
        <p className="text-sm text-outline">Showing 1-{filteredMolecules.length} of {mockMolecules.length} results</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-outline-variant/50 rounded hover:bg-surface-container-low text-sm font-medium disabled:opacity-50" disabled>Prev</button>
          <button className="px-3 py-1 border border-primary bg-primary text-white rounded text-sm font-medium shadow-sm">1</button>
          <button className="px-3 py-1 border border-outline-variant/50 rounded hover:bg-surface-container-low text-sm font-medium bg-white">2</button>
          <button className="px-3 py-1 border border-outline-variant/50 rounded hover:bg-surface-container-low text-sm font-medium bg-white">3</button>
          <button className="px-3 py-1 border border-outline-variant/50 rounded hover:bg-surface-container-low text-sm font-medium bg-white">Next</button>
        </div>
      </div>
    </div>
  );
}
