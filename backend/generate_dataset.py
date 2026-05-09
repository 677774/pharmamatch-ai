import pandas as pd
import random
import numpy as np

def create_mock_dataset(num_samples=5000):
    data = []
    
    # Kumpulan dummy API & Eksipien
    apis = ["Metformin HCL", "Paracetamol", "Ibuprofen", "Amoxicillin", "Omeprazole", "Lisinopril", "Amlodipine", "Simvastatin"]
    excipients = ["Microcrystalline Cellulose", "Sodium Lauryl Sulfate (SLS)", "Magnesium Stearate", "Lactose", "Povidone", "Talc", "Crospovidone", "PEG 6000"]
    
    for _ in range(num_samples):
        api = random.choice(apis)
        excipient = random.choice(excipients)
        
        # 9 RDKit Structural Features (Differences/Ratios between molecules)
        logP_diff = round(random.uniform(0.0, 5.0), 2)
        mw_ratio = round(random.uniform(1.0, 5.0), 2)
        psa_diff = round(random.uniform(0.0, 150.0), 2)
        h_donor_diff = random.randint(0, 8)
        h_acceptor_diff = random.randint(0, 12)
        rotatable_bonds_diff = random.randint(0, 15)
        fraction_csp3_diff = round(random.uniform(0.0, 1.0), 2)
        ring_count_diff = random.randint(0, 5)
        heavy_atoms_diff = random.randint(0, 30)
        
        # Rule-based logic (Non-linear interactions)
        is_incompatible = 0
        
        # Aturan inkompatibilitas
        if logP_diff > 3.5 and rotatable_bonds_diff > 8:
            is_incompatible = 1
        elif mw_ratio > 3.0 and psa_diff > 100:
            is_incompatible = 1
        elif h_donor_diff > 4 and h_acceptor_diff > 6:
            is_incompatible = 1
        elif fraction_csp3_diff > 0.7 and ring_count_diff > 2:
            is_incompatible = 1
        elif heavy_atoms_diff > 20 and psa_diff < 20:
            is_incompatible = 1
        
        # Sedikit noise agar model tidak overfitting
        if random.random() < 0.05:
            is_incompatible = 1 if is_incompatible == 0 else 0
            
        data.append([
            logP_diff, mw_ratio, psa_diff, h_donor_diff, h_acceptor_diff, 
            rotatable_bonds_diff, fraction_csp3_diff, ring_count_diff, heavy_atoms_diff,
            is_incompatible
        ])
        
    columns = [
        'LogP_Difference', 'Molecular_Weight_Ratio', 'PSA_Difference', 
        'H_Donor_Difference', 'H_Acceptor_Difference', 'Rotatable_Bonds_Difference',
        'FractionCSP3_Difference', 'Ring_Count_Difference', 'Heavy_Atom_Difference',
        'Is_Incompatible'
    ]
    df = pd.DataFrame(data, columns=columns)
    df.to_csv('clinical_dataset.csv', index=False)
    print("Berhasil meng-generate 5000 baris data sintetik ke 'clinical_dataset.csv' dengan fitur RDKit!")

if __name__ == "__main__":
    create_mock_dataset()
