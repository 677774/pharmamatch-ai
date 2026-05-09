import pandas as pd
import numpy as np

def create_mock_dataset():
    np.random.seed(42)
    n_samples = 5000 # Increased sample size for better learning
    
    # Existing features
    logP_diff = np.random.uniform(0.0, 6.0, n_samples)
    mw_ratio = np.random.uniform(0.1, 3.0, n_samples)
    psa_diff = np.random.uniform(0.0, 150.0, n_samples)
    h_donor_acceptor_mismatch = np.random.uniform(0.0, 5.0, n_samples)
    temperature_stability = np.random.uniform(20.0, 80.0, n_samples)
    
    # New comprehensive features
    steric_hindrance = np.random.uniform(0.0, 10.0, n_samples)
    pka_diff = np.random.uniform(0.0, 14.0, n_samples)
    reactivity_score = np.random.uniform(0.0, 100.0, n_samples)
    solubility_diff = np.random.uniform(0.0, 50.0, n_samples)
    
    # Complex non-linear rules for incompatibility
    # 1. High LogP Diff AND High PSA Diff
    incomp_logp = (logP_diff > 4.0) & (psa_diff > 80.0)
    
    # 2. High H-Bond mismatch OR extreme pKa difference (acid-base reaction)
    incomp_hbond_pka = (h_donor_acceptor_mismatch > 4.0) | (pka_diff > 7.0)
    
    # 3. High Steric Hindrance combined with High MW ratio
    incomp_steric = (steric_hindrance > 7.5) & (mw_ratio > 2.0)
    
    # 4. High Reactivity
    incomp_reactivity = (reactivity_score > 80.0)
    
    # 5. Bad temperature stability
    incomp_temp = temperature_stability < 25.0
    
    # 6. High Solubility Difference causing precipitation
    incomp_solub = (solubility_diff > 40.0)

    # Combine all rules
    incompatible = incomp_logp | incomp_hbond_pka | incomp_steric | incomp_reactivity | incomp_temp | incomp_solub
    
    # Add noise (15% random flip) to make the model robust and not 100% deterministic
    noise = np.random.choice([False, True], size=n_samples, p=[0.85, 0.15])
    y_target = np.logical_xor(incompatible, noise).astype(int)
    
    df = pd.DataFrame({
        'LogP_Difference': logP_diff,
        'Molecular_Weight_Ratio': mw_ratio,
        'PSA_Difference': psa_diff,
        'HBond_Mismatch': h_donor_acceptor_mismatch,
        'Temp_Stability_Celsius': temperature_stability,
        'Steric_Hindrance': steric_hindrance,
        'pKa_Difference': pka_diff,
        'Reactivity_Score': reactivity_score,
        'Solubility_Difference': solubility_diff,
        'Is_Incompatible': y_target
    })
    
    filename = 'clinical_dataset.csv'
    df.to_csv(filename, index=False)
    print(f"Realistic comprehensive dataset generated: {filename} ({n_samples} rows)")

if __name__ == "__main__":
    create_mock_dataset()
