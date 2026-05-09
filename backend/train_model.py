import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

print("1. Membaca dataset dari clinical_dataset.csv...")
try:
    df = pd.read_csv('clinical_dataset.csv')
except FileNotFoundError:
    print("ERROR: File CSV tidak ditemukan! Jalankan generate_dataset.py terlebih dahulu.")
    exit()

X = df.drop('Is_Incompatible', axis=1)
y = df['Is_Incompatible']

print("2. Membagi data menjadi Data Latih (80%) & Data Uji (20%)...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("3. Melatih algoritma Random Forest dengan Feature Importance...")
rf_model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
rf_model.fit(X_train, y_train)

print("4. Menguji akurasi model...")
y_pred = rf_model.predict(X_test)
akurasi = accuracy_score(y_test, y_pred) * 100
print(f"   => Akurasi Model: {akurasi:.2f}%")
print("\n--- Detail Evaluasi ---")
print(classification_report(y_test, y_pred))

# Save the model and feature names together
model_data = {
    'model': rf_model,
    'features': X.columns.tolist()
}

model_filename = "rf_model.pkl"
with open(model_filename, "wb") as f:
    pickle.dump(model_data, f)
    
print(f"5. Model dan Metadata (Feature Names) berhasil di-export sebagai '{model_filename}'!")
