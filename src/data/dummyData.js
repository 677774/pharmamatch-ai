// ============================================
// PharmaMatch AI — Realistic Dummy Data
// ============================================

export const currentUser = {
  name: 'Dr. Rina Hartono',
  initials: 'RH',
  role: 'Lead Formulator',
  department: 'R&D Pharmaceutical Sciences',
  activeProject: 'Alpha-72',
  projectPhase: 'Clinical Trial Phase II',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_v7WIRTTcS_MVvsd_Do9jNkOETeukOtvFobO_4QIMLojpIobSc21MyzJp-1JZlksmoNAn4bVdMRzTBGReZUS01tt-936SElhLjU9LtXaUoz6OzsTO_gIJ22EVl4ill1JIsnvFtf_pAAK4H9Dp6Fk97EQqL6JwzAsyV53Jz9T9sLLXL44r4Me7lQutjXodQw786KX4XXOTy6xe9IdkOOmnPZJsFdxTt3MvtYiy67slOG_lnAElJnrgb-_j6AD-KS6Svf_Jy1sOYCo'
};

export const dashboardStats = [
  { id: 1, icon: 'hub', label: 'Total Molecules Analyzed', value: '24,892', tag: 'Global Registry', color: 'primary' },
  { id: 2, icon: 'query_stats', label: 'Recent Predictions', value: '1,104', tag: 'Last 24 Hours', color: 'primary' },
  { id: 3, icon: 'model_training', label: 'Random Forest Accuracy', value: '98.4%', tag: 'Model Metrics', color: 'primary' },
  { id: 4, icon: 'verified', label: 'Lab Validated Results', value: '847', tag: 'Knowledge Base', color: 'tertiary' },
];

export const recentProjects = [
  { id: 1, name: 'Alpha-72 Hybrid Synthesis', icon: 'pill', status: 'In Progress', modified: '2h ago', stability: 84, stabilityColor: 'tertiary' },
  { id: 2, name: 'Neuro-Receptor Compatibility', icon: 'vaccines', status: 'Validated', modified: '5h ago', stability: 92, stabilityColor: 'tertiary' },
  { id: 3, name: 'Cardio-Beta Formulation 4', icon: 'medical_services', status: 'Review Required', modified: '1d ago', stability: 42, stabilityColor: 'error' },
  { id: 4, name: 'GastroShield Coating Study', icon: 'science', status: 'In Progress', modified: '3d ago', stability: 76, stabilityColor: 'tertiary' },
];

export const allProjects = [
  { id: 1, name: 'Alpha-72 Hybrid Synthesis', description: 'Novel tablet formulation combining API with modified release excipients', status: 'In Progress', phase: 'Phase II', combinations: 12, validated: 8, modified: '2h ago', stability: 84 },
  { id: 2, name: 'Neuro-Receptor Compatibility', description: 'CNS drug delivery system compatibility screening', status: 'Validated', phase: 'Phase III', combinations: 8, validated: 8, modified: '5h ago', stability: 92 },
  { id: 3, name: 'Cardio-Beta Formulation 4', description: 'Cardiovascular drug-excipient interaction assessment', status: 'Review Required', phase: 'Phase I', combinations: 15, validated: 3, modified: '1d ago', stability: 42 },
  { id: 4, name: 'GastroShield Coating Study', description: 'Enteric coating material compatibility study', status: 'In Progress', phase: 'Phase II', combinations: 6, validated: 4, modified: '3d ago', stability: 76 },
  { id: 5, name: 'Derma-Flex Topical Series', description: 'Topical formulation excipient screening', status: 'Draft', phase: 'Pre-clinical', combinations: 0, validated: 0, modified: '1w ago', stability: 0 },
];

export const apiList = [
  { id: 1, name: 'Metformin HCL', cas: '1115-70-4', mw: 165.62, logP: -1.43, category: 'Antidiabetic' },
  { id: 2, name: 'Paracetamol', cas: '103-90-2', mw: 151.16, logP: 0.46, category: 'Analgesic' },
  { id: 3, name: 'Ibuprofen', cas: '15687-27-1', mw: 206.28, logP: 3.97, category: 'NSAID' },
  { id: 4, name: 'Amoxicillin Trihydrate', cas: '61336-70-7', mw: 419.45, logP: 0.87, category: 'Antibiotic' },
  { id: 5, name: 'Atorvastatin Calcium', cas: '134523-03-8', mw: 1155.34, logP: 6.36, category: 'Statin' },
  { id: 6, name: 'Omeprazole', cas: '73590-58-6', mw: 345.42, logP: 2.23, category: 'PPI' },
  { id: 7, name: 'Losartan Potassium', cas: '124750-99-8', mw: 461.01, logP: 4.01, category: 'ARB' },
  { id: 8, name: 'Amlodipine Besylate', cas: '111470-99-6', mw: 567.05, logP: 3.0, category: 'CCB' },
];

export const excipientList = [
  { id: 1, name: 'Microcrystalline Cellulose (MCC)', cas: '9004-34-6', function: 'Diluent/Binder', category: 'Cellulose' },
  { id: 2, name: 'Magnesium Stearate', cas: '557-04-0', function: 'Lubricant', category: 'Stearate' },
  { id: 3, name: 'Lactose Monohydrate', cas: '64044-51-5', function: 'Diluent', category: 'Sugar' },
  { id: 4, name: 'Croscarmellose Sodium', cas: '74811-65-7', function: 'Disintegrant', category: 'Cellulose' },
  { id: 5, name: 'Povidone K30 (PVP)', cas: '9003-39-8', function: 'Binder', category: 'Polymer' },
  { id: 6, name: 'Sodium Lauryl Sulfate (SLS)', cas: '151-21-3', function: 'Surfactant', category: 'Surfactant' },
  { id: 7, name: 'Polyethylene Glycol 6000', cas: '25322-68-3', function: 'Plasticizer', category: 'Polymer' },
  { id: 8, name: 'Starch 1500', cas: '9005-25-8', function: 'Disintegrant', category: 'Starch' },
  { id: 9, name: 'Colloidal Silicon Dioxide', cas: '7631-86-9', function: 'Glidant', category: 'Oxide' },
  { id: 10, name: 'Talc', cas: '14807-96-6', function: 'Glidant/Lubricant', category: 'Silicate' },
  { id: 11, name: 'Hydroxypropyl Methylcellulose (HPMC)', cas: '9004-65-3', function: 'Coating/Binder', category: 'Cellulose' },
  { id: 12, name: 'Poloxamer 188', cas: '9003-11-6', function: 'Surfactant', category: 'Polymer' },
];

export const knowledgeBaseData = [
  { id: 1, api: 'Paracetamol', excipient: 'Microcrystalline Cellulose (MCC)', compatibility: 'Compatible', score: 0.96, source: 'lab', method: 'DSC', validatedDate: '2026-03-15', notes: 'No interaction peaks observed in DSC thermogram.' },
  { id: 2, api: 'Paracetamol', excipient: 'Magnesium Stearate', compatibility: 'Compatible', score: 0.91, source: 'lab', method: 'FTIR', validatedDate: '2026-03-18', notes: 'FTIR spectra show no significant shifts.' },
  { id: 3, api: 'Paracetamol', excipient: 'Croscarmellose Sodium', compatibility: 'Warning', score: 0.62, source: 'ml', method: null, validatedDate: null, notes: 'Predicted moderate risk due to hygroscopic interaction.' },
  { id: 4, api: 'Paracetamol', excipient: 'Povidone K30 (PVP)', compatibility: 'Compatible', score: 0.94, source: 'lab', method: 'XRD', validatedDate: '2026-04-01', notes: 'XRD patterns unchanged after 4 weeks at 40°C/75% RH.' },
  { id: 5, api: 'Paracetamol', excipient: 'Lactose Monohydrate', compatibility: 'Incompatible', score: 0.18, source: 'lab', method: 'DSC', validatedDate: '2026-02-10', notes: 'Maillard reaction observed. Brown discoloration after stability study.' },
  { id: 6, api: 'Metformin HCL', excipient: 'Microcrystalline Cellulose (MCC)', compatibility: 'Compatible', score: 0.95, source: 'lab', method: 'DSC', validatedDate: '2026-01-20', notes: 'Thermally stable combination.' },
  { id: 7, api: 'Metformin HCL', excipient: 'Magnesium Stearate', compatibility: 'Compatible', score: 0.89, source: 'ml', method: null, validatedDate: null, notes: 'ML prediction based on structural similarity.' },
  { id: 8, api: 'Metformin HCL', excipient: 'Povidone K30 (PVP)', compatibility: 'Compatible', score: 0.93, source: 'lab', method: 'FTIR', validatedDate: '2026-02-28', notes: 'No functional group changes detected.' },
  { id: 9, api: 'Metformin HCL', excipient: 'Sodium Lauryl Sulfate (SLS)', compatibility: 'Warning', score: 0.55, source: 'ml', method: null, validatedDate: null, notes: 'Potential surfactant-drug interaction at high concentrations.' },
  { id: 10, api: 'Ibuprofen', excipient: 'Microcrystalline Cellulose (MCC)', compatibility: 'Compatible', score: 0.97, source: 'lab', method: 'DSC', validatedDate: '2026-03-05', notes: 'Gold standard combination for direct compression.' },
  { id: 11, api: 'Ibuprofen', excipient: 'Magnesium Stearate', compatibility: 'Warning', score: 0.68, source: 'lab', method: 'Dissolution', validatedDate: '2026-03-12', notes: 'Excessive lubricant may reduce dissolution rate.' },
  { id: 12, api: 'Ibuprofen', excipient: 'Starch 1500', compatibility: 'Compatible', score: 0.88, source: 'ml', method: null, validatedDate: null, notes: 'Good compatibility predicted based on excipient class.' },
  { id: 13, api: 'Amoxicillin Trihydrate', excipient: 'Microcrystalline Cellulose (MCC)', compatibility: 'Compatible', score: 0.90, source: 'lab', method: 'XRD', validatedDate: '2026-04-10', notes: 'No polymorphic transformation observed.' },
  { id: 14, api: 'Amoxicillin Trihydrate', excipient: 'Croscarmellose Sodium', compatibility: 'Compatible', score: 0.85, source: 'ml', method: null, validatedDate: null, notes: 'Predicted stable combination.' },
  { id: 15, api: 'Atorvastatin Calcium', excipient: 'Lactose Monohydrate', compatibility: 'Compatible', score: 0.92, source: 'lab', method: 'DSC', validatedDate: '2026-01-15', notes: 'No interaction detected. Widely used in commercial formulations.' },
  { id: 16, api: 'Atorvastatin Calcium', excipient: 'Hydroxypropyl Methylcellulose (HPMC)', compatibility: 'Compatible', score: 0.94, source: 'lab', method: 'FTIR', validatedDate: '2026-02-05', notes: 'Excellent film coating compatibility.' },
  { id: 17, api: 'Omeprazole', excipient: 'Magnesium Stearate', compatibility: 'Incompatible', score: 0.22, source: 'lab', method: 'DSC', validatedDate: '2026-03-20', notes: 'Alkaline stearate causes degradation of acid-labile omeprazole.' },
  { id: 18, api: 'Omeprazole', excipient: 'Talc', compatibility: 'Compatible', score: 0.87, source: 'ml', method: null, validatedDate: null, notes: 'Inert glidant, no predicted interaction.' },
];

export const pendingValidations = [
  { id: 101, api: 'Metformin HCL', excipient: 'Sodium Lauryl Sulfate (SLS)', predictedStatus: 'Warning', score: 0.55, predictedDate: '2026-04-28', confidence: 78 },
  { id: 102, api: 'Metformin HCL', excipient: 'Magnesium Stearate', predictedStatus: 'Compatible', score: 0.89, predictedDate: '2026-04-28', confidence: 89 },
  { id: 103, api: 'Paracetamol', excipient: 'Croscarmellose Sodium', predictedStatus: 'Warning', score: 0.62, predictedDate: '2026-04-25', confidence: 72 },
  { id: 104, api: 'Ibuprofen', excipient: 'Starch 1500', predictedStatus: 'Compatible', score: 0.88, predictedDate: '2026-04-20', confidence: 85 },
  { id: 105, api: 'Omeprazole', excipient: 'Talc', predictedStatus: 'Compatible', score: 0.87, predictedDate: '2026-04-22', confidence: 82 },
];

export const recentValidations = [
  { id: 201, api: 'Paracetamol', excipient: 'Povidone K30 (PVP)', result: 'Compatible', method: 'XRD', date: '2026-04-01' },
  { id: 202, api: 'Ibuprofen', excipient: 'Magnesium Stearate', result: 'Warning', method: 'Dissolution', date: '2026-03-12' },
  { id: 203, api: 'Metformin HCL', excipient: 'Povidone K30 (PVP)', result: 'Compatible', method: 'FTIR', date: '2026-02-28' },
];

export const featureImportance = [
  { name: 'Molecular Weight Diff.', importance: 0.182 },
  { name: 'LogP Difference', importance: 0.174 },
  { name: 'H-Bond Donors (API)', importance: 0.131 },
  { name: 'Polar Surface Area', importance: 0.115 },
  { name: 'Rotatable Bonds', importance: 0.098 },
  { name: 'H-Bond Acceptors (Exc.)', importance: 0.087 },
  { name: 'pKa Difference', importance: 0.076 },
  { name: 'Melting Point Diff.', importance: 0.065 },
  { name: 'Water Solubility (API)', importance: 0.054 },
  { name: 'Particle Size Ratio', importance: 0.018 },
];

export const modelVersions = [
  { version: 'v1.0', date: '2025-06-01', accuracy: 91.0, dataPoints: 3200 },
  { version: 'v2.0', date: '2025-09-15', accuracy: 94.0, dataPoints: 6800 },
  { version: 'v3.0', date: '2026-01-10', accuracy: 96.8, dataPoints: 10500 },
  { version: 'v4.2.1', date: '2026-04-28', accuracy: 98.4, dataPoints: 14200 },
];

export const predictionExplanations = [
  {
    id: 1,
    api: 'Metformin HCL',
    excipient: 'Lactose Monohydrate',
    prediction: 'Compatible',
    score: 0.94,
    drivers: [
      { feature: 'Low MW difference', contribution: +0.23, type: 'favorable' },
      { feature: 'Similar pKa range', contribution: +0.18, type: 'favorable' },
      { feature: 'High LogP gap', contribution: -0.08, type: 'risk' },
      { feature: 'Compatible crystal form', contribution: +0.15, type: 'favorable' },
    ],
  },
  {
    id: 2,
    api: 'Omeprazole',
    excipient: 'Magnesium Stearate',
    prediction: 'Incompatible',
    score: 0.22,
    drivers: [
      { feature: 'Alkaline pH interaction', contribution: -0.35, type: 'risk' },
      { feature: 'Acid-labile API', contribution: -0.22, type: 'risk' },
      { feature: 'Compatible MW range', contribution: +0.08, type: 'favorable' },
      { feature: 'Surface area mismatch', contribution: -0.12, type: 'risk' },
    ],
  },
  {
    id: 3,
    api: 'Paracetamol',
    excipient: 'MCC',
    prediction: 'Compatible',
    score: 0.96,
    drivers: [
      { feature: 'Inert excipient class', contribution: +0.28, type: 'favorable' },
      { feature: 'Low hygroscopicity', contribution: +0.19, type: 'favorable' },
      { feature: 'Direct compression grade', contribution: +0.14, type: 'favorable' },
      { feature: 'Minimal MW impact', contribution: +0.05, type: 'favorable' },
    ],
  },
];

export const moleculeDatabase = [
  { id: 1, name: 'Metformin HCL', type: 'API', cas: '1115-70-4', mw: 165.62, formula: 'C₄H₁₁N₅·HCl', category: 'Antidiabetic', solubility: 'Freely soluble in water', meltingPoint: '223-226°C', smiles: 'CN(C)C(=N)N=C(N)N.Cl', logP: -1.43, has3D: true, image: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=14219&t=l' },
  { id: 2, name: 'Paracetamol', type: 'API', cas: '103-90-2', mw: 151.16, formula: 'C₈H₉NO₂', category: 'Analgesic', solubility: 'Slightly soluble in water', meltingPoint: '169-172°C', smiles: 'CC(=O)NC1=CC=C(O)C=C1', logP: 0.46, has3D: true, image: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=1983&t=l' },
  { id: 3, name: 'Ibuprofen', type: 'API', cas: '15687-27-1', mw: 206.28, formula: 'C₁₃H₁₈O₂', category: 'NSAID', solubility: 'Practically insoluble', meltingPoint: '75-78°C', smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O', logP: 3.97, has3D: true, image: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=3672&t=l' },
  { id: 4, name: 'Microcrystalline Cellulose', type: 'Excipient', cas: '9004-34-6', mw: 162.14, formula: '(C₆H₁₀O₅)n', category: 'Diluent/Binder', solubility: 'Insoluble in water', meltingPoint: '260-270°C', smiles: 'C(C1C(C(C(C(O1)O)O)O)O)O', logP: -2.3, has3D: false, image: null },
  { id: 5, name: 'Magnesium Stearate', type: 'Excipient', cas: '557-04-0', mw: 591.27, formula: 'C₃₆H₇₀MgO₄', category: 'Lubricant', solubility: 'Insoluble in water', meltingPoint: '88°C', smiles: 'CCCCCCCCCCCCCCCCCC(=O)[O-].CCCCCCCCCCCCCCCCCC(=O)[O-].[Mg+2]', logP: 14.2, has3D: true, image: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=11177&t=l' },
  { id: 6, name: 'Lactose Monohydrate', type: 'Excipient', cas: '64044-51-5', mw: 360.31, formula: 'C₁₂H₂₂O₁₁·H₂O', category: 'Diluent', solubility: 'Freely soluble in water', meltingPoint: '202-203°C', smiles: 'C(C1C(C(C(C(O1)OC2C(C(OC(C2O)O)CO)O)O)O)O)O.O', logP: -5.0, has3D: true, image: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=6134&t=l' },
  { id: 7, name: 'Povidone K30', type: 'Excipient', cas: '9003-39-8', mw: 111.14, formula: '(C₆H₉NO)n', category: 'Binder', solubility: 'Freely soluble in water', meltingPoint: '150°C (decomp)', smiles: 'C1CC(=O)N(C1)C=C', logP: -0.3, has3D: false, image: null },
  { id: 8, name: 'Amoxicillin Trihydrate', type: 'API', cas: '61336-70-7', mw: 419.45, formula: 'C₁₆H₁₉N₃O₅S·3H₂O', category: 'Antibiotic', solubility: 'Slightly soluble', meltingPoint: '194°C', smiles: 'CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C.O.O.O', logP: 0.87, has3D: true, image: 'https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=33613&t=l' },
];
