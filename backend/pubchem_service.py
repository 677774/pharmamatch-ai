import requests
import json

try:
    from rdkit import Chem
    from rdkit.Chem import Descriptors
except ImportError:
    print("Warning: RDKit not installed. Features will default to zero.")

def search_molecule_pubchem(name: str):
    """
    Searches PubChem for a molecule by name and returns its properties.
    """
    base_url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{name}/property/MolecularWeight,XLogP,IsomericSMILES,MolecularFormula/JSON"
    
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
                    "smiles": props.get('IsomericSMILES', ''),
                    "status": "PubChem Database",
                    "statusColor": "blue",
                    "img": f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{props.get('CID')}/PNG"
                }
    except Exception as e:
        print(f"Error fetching from PubChem: {e}")
    
    return None

def fetch_features_for_prediction(name: str):
    """
    Fetches raw numeric features for the AI model based on the molecule name using RDKit.
    """
    mol_data = search_molecule_pubchem(name)
    
    defaults = {
        "logp": 0.0,
        "mw": 150.0,
        "tpsa": 50.0,
        "h_donors": 1,
        "h_acceptors": 2,
        "rotatable_bonds": 2,
        "fraction_csp3": 0.5,
        "ring_count": 1,
        "heavy_atoms": 10
    }
    
    if not mol_data or not mol_data.get("smiles"):
        return defaults
        
    smiles = mol_data["smiles"]
    
    try:
        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            return defaults
            
        return {
            "logp": float(Descriptors.MolLogP(mol)),
            "mw": float(Descriptors.MolWt(mol)),
            "tpsa": float(Descriptors.TPSA(mol)),
            "h_donors": int(Descriptors.NumHDonors(mol)),
            "h_acceptors": int(Descriptors.NumHAcceptors(mol)),
            "rotatable_bonds": int(Descriptors.NumRotatableBonds(mol)),
            "fraction_csp3": float(Descriptors.FractionCSP3(mol)),
            "ring_count": int(Descriptors.RingCount(mol)),
            "heavy_atoms": int(mol.GetNumHeavyAtoms())
        }
    except Exception as e:
        print(f"RDKit Error processing {name}: {e}")
        return defaults
