import pandas as pd
import numpy as np

# Fungsi ini menghasilkan 1000 baris data dummy klinis
# Di dunia nyata, ini adalah file Excel/CSV riwayat riset lab Anda
def create_mock_dataset():
    np.random.seed(42)
    n_samples = 1000
    
    # Fitur-fitur kimiawi yang biasanya dipertimbangkan
    logP_diff = np.random.uniform(0.0, 5.0, n_samples)
    mw_ratio = np.random.uniform(0.1, 2.5, n_samples)
    ph_difference = np.random.uniform(0.0, 7.0, n_samples)
    temperature_stability = np.random.uniform(20.0, 80.0, n_samples)
    
    # Logika buatan penentu Inkompatibilitas (Y)
    # Jika perbedaan LogP tinggi DAN perbedaan pH tinggi = Incompatible (1)
    incompatible = ((logP_diff > 3.0) & (ph_difference > 4.0)) | (temperature_stability < 30.0)
    
    # Tambahkan sedikit noise (faktor tak terduga di lab)
    noise = np.random.choice([False, True], size=n_samples, p=[0.95, 0.05])
    y_target = np.logical_xor(incompatible, noise).astype(int)
    
    # Buat DataFrame Pandas
    df = pd.DataFrame({
        'LogP_Difference': logP_diff,
        'Molecular_Weight_Ratio': mw_ratio,
        'pH_Difference': ph_difference,
        'Temp_Stability_Celsius': temperature_stability,
        'Is_Incompatible': y_target # 0 = Aman, 1 = Bahaya
    })
    
    # Simpan ke CSV
    filename = 'clinical_dataset.csv'
    df.to_csv(filename, index=False)
    print(f"Dataset berhasil dibuat: {filename} ({n_samples} baris)")

if __name__ == "__main__":
    create_mock_dataset()
