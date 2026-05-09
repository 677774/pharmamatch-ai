import pandas as pd
import numpy as np

def create_mock_dataset():
    np.random.seed(42)
    n_samples = 2000
    
    # Real-world chemical interaction features
    logP_diff = np.random.uniform(0.0, 6.0, n_samples)
    mw_ratio = np.random.uniform(0.1, 3.0, n_samples)
    psa_diff = np.random.uniform(0.0, 150.0, n_samples) # Polar Surface Area difference
    h_donor_acceptor_mismatch = np.random.uniform(0.0, 5.0, n_samples)
    temperature_stability = np.random.uniform(20.0, 80.0, n_samples)
    
    # Logic for Incompatibility:
    # High LogP Diff AND High PSA Diff often leads to phase separation/incompatibility
    # High H-bond mismatch can cause precipitation
    incompatible_logp = (logP_diff > 3.5) & (psa_diff > 75.0)
    incompatible_hbond = h_donor_acceptor_mismatch > 3.0
    incompatible_temp = temperature_stability < 30.0
    
    incompatible = incompatible_logp | incompatible_hbond | incompatible_temp
    
    # Add some real-world noise
    noise = np.random.choice([False, True], size=n_samples, p=[0.90, 0.10])
    y_target = np.logical_xor(incompatible, noise).astype(int)
    
    df = pd.DataFrame({
        'LogP_Difference': logP_diff,
        'Molecular_Weight_Ratio': mw_ratio,
        'PSA_Difference': psa_diff,
        'HBond_Mismatch': h_donor_acceptor_mismatch,
        'Temp_Stability_Celsius': temperature_stability,
        'Is_Incompatible': y_target # 0 = Compatible, 1 = Incompatible
    })
    
    filename = 'clinical_dataset.csv'
    df.to_csv(filename, index=False)
    print(f"Realistic dataset generated: {filename} ({n_samples} rows)")

if __name__ == "__main__":
    create_mock_dataset()
