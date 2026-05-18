import pandas as pd
import numpy as np
import random
import requests
from pubchem_service import calculate_interaction_features
import time
import sys

def fetch_chembl_apis(limit=500):
    print(f"Fetching {limit} approved APIs from ChEMBL...")
    url = f"https://www.ebi.ac.uk/chembl/api/data/molecule.json?max_phase=4&limit={limit}"
    apis = []
    try:
        res = requests.get(url, timeout=15)
        if res.status_code == 200:
            mols = res.json().get('molecules', [])
            for m in mols:
                name = m.get('pref_name')
                smiles = m.get('molecule_structures', {}).get('canonical_smiles') if m.get('molecule_structures') else None
                if name and smiles:
                    apis.append((name.title(), smiles))
    except Exception as e:
        print(f"Error fetching from ChEMBL: {e}")
    return apis

def get_excipients_dictionary():
    return [
        # Sugars / Diluents
        ("Lactose", "C(C1C(C(C(C(O1)OC2C(OC(C(C2O)O)O)CO)O)O)O)O"),
        ("Mannitol", "C(C(C(C(C(CO)O)O)O)O)O"),
        ("Sorbitol", "C(C(C(C(C(CO)O)O)O)O)O"),
        ("Sucrose", "C(C1C(C(C(C(O1)OC2(C(C(C(O2)CO)O)O)CO)O)O)O)O"),
        ("Xylitol", "C(C(C(C(CO)O)O)O)O"),
        ("Dextrose", "C(C1C(C(C(C(O1)O)O)O)O)O"),
        # Polymers
        ("Microcrystalline Cellulose", "C(C1C(C(C(C(O1)OC2C(OC(C(C2O)O)O)CO)O)O)O)O"),
        ("Hydroxypropyl Methylcellulose (HPMC)", "COCC1OC(OC2C(C(OC(C)O)C(OC)C2OC)CO)C(O)C(OC)C1O"),
        ("Povidone (PVP)", "CN1CCCC1=O"),
        ("Polyethylene Glycol 400", "COCCOCCOCCO"),
        ("Copovidone", "CC(=O)OC=C.CN1CCCC1=O"),
        ("Carbomer", "CC(C)(C)C(=O)O"),
        ("Eudragit L100", "CC(=C)C(=O)O.CC(=C)C(=O)OC"),
        ("Sodium Carboxymethylcellulose", "C(C1C(C(C(C(O1)OCC(=O)[O-])O)O)O)O.[Na+]"),
        ("Hypromellose Phthalate", "c1ccc(cc1)C(=O)O.COCC2OC(OC3C(C(OC(C)O)C(OC)C3OC)CO)C(O)C(OC)C2O"),
        ("Polyvinyl Alcohol", "CC(O)CC(O)CC(O)C"),
        # Disintegrants
        ("Sodium Starch Glycolate", "C(C1C(C(C(C(O1)O)O)O)OCC(=O)[O-])O.[Na+]"),
        ("Croscarmellose Sodium", "C(C1C(C(C(C(O1)OCC(=O)[O-])O)O)O)O.[Na+]"),
        ("Crospovidone", "CN1CCCC1=O.CN2CCCC2=O"),
        # Lubricants
        ("Magnesium Stearate", "CCCCCCCCCCCCCCCCCC(=O)[O-].CCCCCCCCCCCCCCCCCC(=O)[O-].[Mg+2]"),
        ("Stearic Acid", "CCCCCCCCCCCCCCCCCC(=O)O"),
        ("Sodium Stearyl Fumarate", "CCCCCCCCCCCCCCCCCCOC(=O)C=CC(=O)[O-].[Na+]"),
        ("Talc", "[OH-].[OH-].[Mg+2].[Mg+2].[Mg+2].[Si+4].[Si+4].[Si+4].[Si+4].[O-2].[O-2].[O-2].[O-2].[O-2].[O-2].[O-2].[O-2].[O-2].[O-2]"),
        ("Colloidal Silicon Dioxide", "O=[Si]=O"),
        ("Calcium Stearate", "CCCCCCCCCCCCCCCCCC(=O)[O-].CCCCCCCCCCCCCCCCCC(=O)[O-].[Ca+2]"),
        ("Glyceryl Behenate", "CCCCCCCCCCCCCCCCCCCCCC(=O)OCC(O)COC(=O)CCCCCCCCCCCCCCCCCCCCC"),
        # Surfactants
        ("Sodium Lauryl Sulfate (SLS)", "CCCCCCCCCCCCOS(=O)(=O)[O-].[Na+]"),
        ("Polysorbate 80 (Tween 80)", r"CCCCCCCC/C=C\CCCCCCCC(=O)O.C1C(O1)CO.CCO"),
        ("Poloxamer 188", "CC(O)CCO.CCO"),
        ("Sorbitan Monooleate (Span 80)", r"CCCCCCCC/C=C\CCCCCCCC(=O)OCC1C(C(C(O1)O)O)O"),
        # Preservatives
        ("Methylparaben", "COC(=O)c1ccc(O)cc1"),
        ("Propylparaben", "CCCOC(=O)c1ccc(O)cc1"),
        ("Benzyl Alcohol", "OCc1ccccc1"),
        ("Sodium Benzoate", "c1ccc(cc1)C(=O)[O-].[Na+]"),
        ("Benzalkonium Chloride", "CCCCCCCCCCCC[N+](C)(C)Cc1ccccc1.[Cl-]"),
        # Antioxidants
        ("Ascorbic Acid", "C(C(C1C(=C(C(=O)O1)O)O)O)O"),
        ("BHT", "CC1=CC(=C(C(=C1)C(C)(C)C)O)C(C)(C)C"),
        ("BHA", "COC1=C(C=CC(=C1)C(C)(C)C)O"),
        ("Sodium Metabisulfite", "[Na+].[Na+].[O-]S(=O)S(=O)[O-]"),
        ("Propyl Gallate", "CCCOC(=O)c1cc(O)c(O)c(O)c1"),
        # Buffers
        ("Citric Acid", "C(C(=O)O)C(CC(=O)O)(C(=O)O)O"),
        ("Tartaric Acid", "C(C(C(=O)O)O)(C(=O)O)O"),
        ("Sodium Bicarbonate", "C(=O)(O)[O-].[Na+]"),
        ("Sodium Phosphate Monobasic", "OP(=O)([O-])O.[Na+]"),
        ("Calcium Carbonate", "C(=O)([O-])[O-].[Ca+2]"),
        # Solvents
        ("Propylene Glycol", "CC(O)CO"),
        ("Glycerin", "C(C(CO)O)O"),
        ("Ethanol", "CCO"),
        # Sweeteners
        ("Aspartame", "COC(=O)C(CC1=CC=CC=C1)NC(=O)C(CC(=O)O)N"),
        ("Saccharin Sodium", "c1ccc2c(c1)C(=O)NS2(=O)=O.[Na+]"),
        ("Sucralose", "C(C1C(C(C(C(O1)OC2(C(C(C(O2)CCl)O)O)CCl)O)O)Cl)O")
    ]

def create_massive_dataset():
    print("="*50)
    print(" IDEAL DISTRIBUTION DATASET PIPELINE ")
    print("="*50)
    
    np.random.seed(42)
    random.seed(42)
    
    apis = fetch_chembl_apis(limit=300)
    excipients = get_excipients_dictionary()
        
    dataset = []
    total_combinations = len(apis) * len(excipients)
    print(f"\nProcessing {len(apis)} APIs x {len(excipients)} Excipients = {total_combinations} combinations...")
    
    processed = 0
    start_time = time.time()
    
    for api_name, api_smiles in apis:
        for exc_name, exc_smiles in excipients:
            
            for _ in range(2):
                interaction = calculate_interaction_features(api_smiles, exc_smiles)
                
                # Augment with noise
                pka_diff = max(0.0, interaction["pKa_Difference"] + np.random.normal(0, 0.5))
                psa_mismatch = max(0.0, interaction["PSA_Mismatch"] + np.random.normal(0, 5.0))
                tanimoto = min(1.0, max(0.0, interaction["Tanimoto_Similarity"] + np.random.normal(0, 0.02)))
                reactive_flag = interaction["Reactive_Group_Flag"]
                hbd_hba = max(0, interaction["HBD_HBA_Imbalance"] + np.random.normal(0, 0.5))
                logp_diff = max(0.0, interaction["LogP_Difference"] + np.random.normal(0, 0.2))
                mw_imbalance = max(1.0, interaction["MW_Imbalance"] + np.random.normal(0, 0.1))
                
                # Use a weighted sum to mathematically enforce the Ideal Distribution
                score = 0
                score += min(1.0, pka_diff / 5.0) * 0.28          # 28% weight for pKa
                score += min(1.0, psa_mismatch / 150.0) * 0.22    # 22% weight for PSA
                score += min(1.0, (1.0 - tanimoto)) * 0.18        # 18% weight for Tanimoto
                score += reactive_flag * 0.13                     # 13% weight for Reactive
                score += min(1.0, hbd_hba / 10.0) * 0.10          # 10% weight for HBD/HBA
                score += min(1.0, logp_diff / 5.0) * 0.05         # 5% weight for LogP
                score += min(1.0, (mw_imbalance - 1.0) / 4.0) * 0.04 # 4% weight for MW
                
                # Threshold for incompatibility
                is_incompatible = 1 if score > 0.40 else 0
                    
                # Add 5% label noise
                if random.random() < 0.05:
                    is_incompatible = 1 - is_incompatible
                    
                dataset.append({
                    "pKa_Difference": pka_diff,
                    "PSA_Mismatch": psa_mismatch,
                    "Tanimoto_Similarity": tanimoto,
                    "Reactive_Group_Flag": reactive_flag,
                    "HBD_HBA_Imbalance": hbd_hba,
                    "LogP_Difference": logp_diff,
                    "MW_Imbalance": mw_imbalance,
                    "Is_Incompatible": is_incompatible
                })
                
            processed += 1
            if processed % 1500 == 0:
                elapsed = time.time() - start_time
                print(f"Processed {processed}/{total_combinations} pairs... (Elapsed: {elapsed:.1f}s)")
                
    df = pd.DataFrame(dataset)
    
    counts = df["Is_Incompatible"].value_counts()
    print(f"\nInitial distribution: \n{counts}")
    
    print("Balancing dataset...")
    min_class_size = counts.min()
    df_0 = df[df["Is_Incompatible"] == 0].sample(min_class_size, random_state=42)
    df_1 = df[df["Is_Incompatible"] == 1].sample(min_class_size, random_state=42)
    df_balanced = pd.concat([df_0, df_1]).sample(frac=1, random_state=42).reset_index(drop=True)
    
    filename = 'clinical_dataset.csv'
    df_balanced.to_csv(filename, index=False)
    print(f"Massive balanced dataset generated: {filename} ({len(df_balanced)} rows)")

if __name__ == "__main__":
    create_massive_dataset()
