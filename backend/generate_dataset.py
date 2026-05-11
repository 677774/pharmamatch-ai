import pandas as pd
import numpy as np

def create_mock_dataset():
    np.random.seed(42)
    n_samples = 5000 
    
    # Existing 5 computable features
    logP_diff = np.random.uniform(0.0, 6.0, n_samples)
    mw_ratio = np.random.uniform(0.1, 5.0, n_samples)
    psa_diff = np.random.uniform(0.0, 150.0, n_samples)
    h_donor_acceptor_mismatch = np.random.uniform(0.0, 8.0, n_samples)
    temperature_stability = np.random.uniform(20.0, 80.0, n_samples)
    
    # Complex non-linear rules for incompatibility based ONLY on 5 features
    # 1. High LogP Diff AND High PSA Diff (Severe Phase Separation)
    incomp_logp = (logP_diff > 3.5) & (psa_diff > 60.0)
    
    # 2. High H-Bond mismatch (Reactivity / Instability)
    incomp_hbond = (h_donor_acceptor_mismatch > 4.5)
    
    # 3. High MW Ratio (Segregation Risk)
    incomp_mw = (mw_ratio > 3.0) | (mw_ratio < 0.33)
    
    # 4. Bad temperature stability
    incomp_temp = temperature_stability < 30.0

    # Combine all rules
    incompatible = incomp_logp | incomp_hbond | incomp_mw | incomp_temp
    
    # Add noise (5% random flip) to make the model robust
    noise = np.random.choice([False, True], size=n_samples, p=[0.95, 0.05])
    y_target = np.logical_xor(incompatible, noise).astype(int)
    
    df = pd.DataFrame({
        'LogP_Difference': logP_diff,
        'Molecular_Weight_Ratio': mw_ratio,
        'PSA_Difference': psa_diff,
        'HBond_Mismatch': h_donor_acceptor_mismatch,
        'Temp_Stability_Celsius': temperature_stability,
        'Is_Incompatible': y_target
    })
    
    filename = 'clinical_dataset.csv'
    df.to_csv(filename, index=False)
    print(f"Realistic 5-feature dataset generated: {filename} ({n_samples} rows)")

if __name__ == "__main__":
    create_mock_dataset()
