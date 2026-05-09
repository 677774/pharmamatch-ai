import requests
import json

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
                
                # Fetch more details like status if possible, or provide defaults
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
    Fetches raw numeric features for the AI model based on the molecule name.
    """
    mol_data = search_molecule_pubchem(name)
    if not mol_data:
        # Fallback to defaults if PubChem fails
        return {
            "mw": 150.0,
            "logp": 1.0,
            "psa": 50.0, # Polar Surface Area (dummy if not in simple pug)
            "h_donors": 1,
            "h_acceptors": 2
        }
        
    return {
        "mw": float(mol_data["weight"].replace(" g/mol", "")),
        "logp": float(mol_data["logp"]),
        "psa": float(mol_data.get("psa", 50.0)), # Often requires another API call, we'll dummy it if not present
        "h_donors": 1, # Dummy if not present
        "h_acceptors": 2 # Dummy if not present
    }
