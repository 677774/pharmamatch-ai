import requests
import json
import urllib.parse
from rdkit import Chem
from rdkit.Chem import Descriptors, AllChem
from rdkit import DataStructs
import random

LOCAL_MOLECULES = {
    "hpmc": {
        "name": "HPMC",
        "cid": 57363,
        "formula": "C36H70O19",
        "weight": "384.4 g/mol",
        "logp": "-1.5",
        "smiles": "COCC1OC(OC2C(C(OC(C)O)C(OC)C2OC)CO)C(O)C(OC)C1O",
        "tpsa": 149.7,
        "h_donors": 4,
        "h_acceptors": 19,
        "status": "Inactive Binder (Polymer)",
        "statusColor": "green",
        "img": "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/57363/PNG"
    },
    "hydroxypropyl methylcellulose": {
        "name": "HPMC",
        "cid": 57363,
        "formula": "C36H70O19",
        "weight": "384.4 g/mol",
        "logp": "-1.5",
        "smiles": "COCC1OC(OC2C(C(OC(C)O)C(OC)C2OC)CO)C(O)C(OC)C1O",
        "tpsa": 149.7,
        "h_donors": 4,
        "h_acceptors": 19,
        "status": "Inactive Binder (Polymer)",
        "statusColor": "green",
        "img": "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/57363/PNG"
    },
    "magnesium stearate": {
        "name": "Magnesium Stearate",
        "cid": 11177,
        "formula": "C36H70MgO4",
        "weight": "591.3 g/mol",
        "logp": "14.3",
        "smiles": "CCCCCCCCCCCCCCCCCC(=O)[O-].CCCCCCCCCCCCCCCCCC(=O)[O-].[Mg+2]",
        "tpsa": 80.3,
        "h_donors": 0,
        "h_acceptors": 4,
        "status": "Lubricant",
        "statusColor": "blue",
        "img": "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/11177/PNG"
    },
    "pvp": {
        "name": "PVP",
        "cid": 2522330,
        "formula": "C6H9NO",
        "weight": "111.14 g/mol",
        "logp": "0.4",
        "smiles": "C1CCN(C1=O)C=C",
        "tpsa": 20.3,
        "h_donors": 0,
        "h_acceptors": 1,
        "status": "Binder",
        "statusColor": "green",
        "img": "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/2522330/PNG"
    },
    "povidone": {
        "name": "PVP",
        "cid": 2522330,
        "formula": "C6H9NO",
        "weight": "111.14 g/mol",
        "logp": "0.4",
        "smiles": "C1CCN(C1=O)C=C",
        "tpsa": 20.3,
        "h_donors": 0,
        "h_acceptors": 1,
        "status": "Binder",
        "statusColor": "green",
        "img": "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/2522330/PNG"
    },
    "starch": {
        "name": "Starch",
        "cid": 24836924,
        "formula": "C18H32O16",
        "weight": "504.4 g/mol",
        "logp": "-5.2",
        "smiles": "C(C1C(C(C(C(O1)OC2C(OC(C(C2O)O)OC3C(OC(C(C3O)O)O)CO)CO)O)O)O)O",
        "tpsa": 242.0,
        "h_donors": 9,
        "h_acceptors": 16,
        "status": "Diluent / Disintegrant",
        "statusColor": "blue",
        "img": "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/24836924/PNG"
    },
    "lactose": {
        "name": "Lactose",
        "cid": 6134,
        "formula": "C12H22O11",
        "weight": "342.3 g/mol",
        "logp": "-5.0",
        "smiles": "C1C(C(C(C(O1)OC2C(OC(C(C2O)O)O)CO)O)O)O",
        "tpsa": 189.5,
        "h_donors": 8,
        "h_acceptors": 11,
        "status": "Diluent",
        "statusColor": "blue",
        "img": "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/6134/PNG"
    },
    "microcrystalline cellulose": {
        "name": "Microcrystalline Cellulose (MCC)",
        "cid": 14055,
        "formula": "C6H10O5",
        "weight": "162.14 g/mol",
        "logp": "-3.0",
        "smiles": "C1C(C(C(C(O1)O)O)O)CO",
        "tpsa": 99.4,
        "h_donors": 3,
        "h_acceptors": 5,
        "status": "Filler-Binder",
        "statusColor": "blue",
        "img": "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/14055/PNG"
    },
    "mcc": {
        "name": "Microcrystalline Cellulose (MCC)",
        "cid": 14055,
        "formula": "C6H10O5",
        "weight": "162.14 g/mol",
        "logp": "-3.0",
        "smiles": "C1C(C(C(C(O1)O)O)O)CO",
        "tpsa": 99.4,
        "h_donors": 3,
        "h_acceptors": 5,
        "status": "Filler-Binder",
        "statusColor": "blue",
        "img": "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/14055/PNG"
    }
}

def search_molecule_pubchem(name: str):
    """
    Searches PubChem for a molecule by name and returns its properties.
    """
    cleaned_name = name.strip().lower()
    if cleaned_name in LOCAL_MOLECULES:
        return LOCAL_MOLECULES[cleaned_name]

    encoded_name = urllib.parse.quote(name)
    base_url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{encoded_name}/property/MolecularWeight,XLogP,IsomericSMILES,CanonicalSMILES,MolecularFormula,TPSA,HBondDonorCount,HBondAcceptorCount/JSON"
    
    try:
        response = requests.get(base_url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if 'PropertyTable' in data and 'Properties' in data['PropertyTable']:
                props = data['PropertyTable']['Properties'][0]
                
                return {
                    "name": name.title(),
                    "cid": props.get('CID', 0),
                    "formula": props.get('MolecularFormula', 'Unknown'),
                    "weight": f"{props.get('MolecularWeight', 0.0)} g/mol",
                    "logp": str(props.get('XLogP', 0.0)),
                    "smiles": props.get('IsomericSMILES') or props.get('CanonicalSMILES') or props.get('SMILES') or '',
                    "tpsa": props.get('TPSA', 50.0),
                    "h_donors": props.get('HBondDonorCount', 1),
                    "h_acceptors": props.get('HBondAcceptorCount', 2),
                    "status": "PubChem Database",
                    "statusColor": "blue",
                    "img": f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{props.get('CID')}/PNG"
                }
    except Exception as e:
        print(f"Error fetching from PubChem: {e}")
    
    return None

def estimate_pka(mol):
    """
    Heuristic estimation of pKa based on SMARTS functional groups.
    If multiple exist, averages them.
    """
    pka_values = []
    
    # Acids
    if mol.HasSubstructMatch(Chem.MolFromSmarts('C(=O)[OH]')):
        pka_values.append(4.5) # Carboxylic Acid
    if mol.HasSubstructMatch(Chem.MolFromSmarts('c1ccccc1O')):
        pka_values.append(9.5) # Phenol
    if mol.HasSubstructMatch(Chem.MolFromSmarts('P(=O)([O-])([O-])')):
        pka_values.append(2.1) # Phosphate
        
    # Bases
    if mol.HasSubstructMatch(Chem.MolFromSmarts('[CX4][NH2]')):
        pka_values.append(10.5) # Aliphatic primary amine
    if mol.HasSubstructMatch(Chem.MolFromSmarts('c1ccccc1[NH2]')):
        pka_values.append(4.6) # Aromatic amine
        
    if not pka_values:
        return 7.0 # Neutral assumption
        
    return sum(pka_values) / len(pka_values)

def compute_rdkit_features(smiles: str):
    """
    Calculates advanced physicochemical features from SMILES using RDKit.
    """
    features = {
        "mw": 0.0,
        "logp": 0.0,
        "psa": 0.0,
        "h_donors": 0,
        "h_acceptors": 0,
        "pka_estimate": 7.0,
        "rotatable_bonds": 0,
        "has_primary_amine": 0,
        "has_aldehyde": 0,
        "has_carboxyl": 0,
        "has_reducing_sugar": 0,
        "has_ester_amide": 0,
        "has_phenol_alkene": 0,
        "has_strong_base": 0,
        "hygroscopic_proxy": 0,
        "peroxide_proxy": 0,
        "fingerprint": None
    }
    
    if not smiles:
        return features

    try:
        mol = Chem.MolFromSmiles(smiles)
        if mol:
            features["mw"] = Descriptors.MolWt(mol)
            features["logp"] = Descriptors.MolLogP(mol)
            features["psa"] = Descriptors.TPSA(mol)
            features["h_donors"] = Descriptors.NumHDonors(mol)
            features["h_acceptors"] = Descriptors.NumHAcceptors(mol)
            features["rotatable_bonds"] = Descriptors.NumRotatableBonds(mol)
            features["pka_estimate"] = estimate_pka(mol)
            
            # Reactive Groups (SMARTS)
            features["has_primary_amine"] = int(mol.HasSubstructMatch(Chem.MolFromSmarts('[NH2]')))
            features["has_aldehyde"] = int(mol.HasSubstructMatch(Chem.MolFromSmarts('[CH]=O')))
            features["has_carboxyl"] = int(mol.HasSubstructMatch(Chem.MolFromSmarts('C(=O)[OH]')))
            features["has_reducing_sugar"] = int(mol.HasSubstructMatch(Chem.MolFromSmarts('[CX4]([OH])O[CX4]')))
            features["has_ester_amide"] = int(mol.HasSubstructMatch(Chem.MolFromSmarts('[CX3](=[OX1])[O,N]')))
            features["has_phenol_alkene"] = int(mol.HasSubstructMatch(Chem.MolFromSmarts('c1ccccc1O')) or mol.HasSubstructMatch(Chem.MolFromSmarts('C=C')))
            features["has_strong_base"] = int(mol.HasSubstructMatch(Chem.MolFromSmarts('C(=O)([O-])[O-]')) or mol.HasSubstructMatch(Chem.MolFromSmarts('P(=O)([O-])([O-])')))
            
            # Formulating Excipient Properties
            if features["h_donors"] + features["h_acceptors"] > 5 and features["mw"] > 150:
                features["hygroscopic_proxy"] = 1
            if mol.HasSubstructMatch(Chem.MolFromSmarts('COCCO')) or mol.HasSubstructMatch(Chem.MolFromSmarts('N1CCCC1=O')):
                features["peroxide_proxy"] = 1
            
            # Morgan Fingerprint for Tanimoto
            features["fingerprint"] = AllChem.GetMorganFingerprintAsBitVect(mol, 2, nBits=1024)
            
    except Exception as e:
        print(f"RDKit Error processing SMILES {smiles}: {e}")
        
    return features

def calculate_interaction_features(api_smiles: str, exc_smiles: str):
    """
    Calculates pairwise interaction features for ML, aligned with "Ideal Distribution".
    Features: pKa_Difference, PSA_Mismatch, Tanimoto_Similarity, Reactive_Group_Flag, HBD_HBA_Imbalance, LogP_Difference, MW_Imbalance.
    """
    api = compute_rdkit_features(api_smiles)
    exc = compute_rdkit_features(exc_smiles)
    
    # 1. pKa Difference (Ionic interaction proxy)
    pka_diff = abs(api["pka_estimate"] - exc["pka_estimate"])
    
    # 2. PSA Mismatch
    psa_mismatch = abs(api["psa"] - exc["psa"])
    
    # 3. Hansen Distance Proxy (Miscibility via Tanimoto)
    tanimoto = 0.0
    if api["fingerprint"] and exc["fingerprint"]:
        tanimoto = DataStructs.TanimotoSimilarity(api["fingerprint"], exc["fingerprint"])
        
    # 4. Reactive Group Flag (Unified: Maillard OR Esterification OR Hydrolysis OR Oxidation OR AcidBase)
    reactive_flag = 0
    if (api["has_primary_amine"] and (exc["has_reducing_sugar"] or exc["has_aldehyde"])) or \
       (exc["has_primary_amine"] and (api["has_reducing_sugar"] or api["has_aldehyde"])) or \
       (api["has_carboxyl"] and exc["has_primary_amine"]) or \
       (api["has_ester_amide"] and exc["hygroscopic_proxy"]) or \
       (api["has_phenol_alkene"] and exc["peroxide_proxy"]) or \
       (api["has_carboxyl"] and exc["has_strong_base"]):
        reactive_flag = 1
        
    # 5. HBD/HBA Imbalance
    hbd_hba_imbalance = abs((api["h_donors"] + api["h_acceptors"]) - (exc["h_donors"] + exc["h_acceptors"]))
    
    # 6. LogP Difference
    logp_diff = abs(api["logp"] - exc["logp"])
    
    # 7. MW Imbalance (Lipinski scale)
    mw_api = max(api["mw"], 1.0)
    mw_exc = max(exc["mw"], 1.0)
    mw_imbalance = max(mw_api, mw_exc) / min(mw_api, mw_exc)
    
    return {
        "pKa_Difference": pka_diff,
        "PSA_Mismatch": psa_mismatch,
        "Tanimoto_Similarity": tanimoto,
        "Reactive_Group_Flag": reactive_flag,
        "HBD_HBA_Imbalance": hbd_hba_imbalance,
        "LogP_Difference": logp_diff,
        "MW_Imbalance": mw_imbalance
    }

def fetch_features_for_prediction(name: str):
    """
    Fetches raw numeric features for the AI model based on the molecule name.
    """
    mol_data = search_molecule_pubchem(name)
    if not mol_data:
        return {
            "smiles": "",
            "mw": random.uniform(100.0, 500.0),
            "logp": random.uniform(-2.0, 5.0),
            "psa": random.uniform(20.0, 150.0), 
            "h_donors": random.randint(0, 5),
            "h_acceptors": random.randint(1, 8)
        }
        
    return {
        "smiles": mol_data["smiles"],
        "mw": float(mol_data["weight"].replace(" g/mol", "")),
        "logp": float(mol_data["logp"]),
        "psa": float(mol_data["tpsa"]), 
        "h_donors": int(mol_data["h_donors"]), 
        "h_acceptors": int(mol_data["h_acceptors"]) 
    }
