# 📊 ECG LVSD Detection Dataset

## Struktur Folder

```
dataset/
├── samples/          # Data EKG mentah (raw ECG signals)
├── preprocessed/     # Data yang sudah dipreprocessing
└── augmented/        # Data hasil augmentasi
```

## Deskripsi Dataset

### Raw ECG Data (samples/)
Format: `.npz` (NumPy compressed)
- Sampling rate: 500 Hz
- Duration: 10 seconds
- Leads: 12-lead ECG
- Shape: (12, 5000)

### Metadata Format
```csv
patient_id,age,gender,lvef,diagnosis,risk_score,symptoms,recording_date
PT-001,65,M,35.0,Dilated Cardiomyopathy,87,Dyspnea;Fatigue;Edema,2024-01-15
PT-002,58,F,62.0,Normal Sinus Rhythm,12,Asymptomatic,2024-01-16
PT-003,72,M,28.0,Severe LVSD,95,Chest Pain;Palpitations;Syncope,2024-01-17
PT-004,45,F,55.0,Borderline LV Function,42,Mild Fatigue,2024-01-18
```

## Statistics

- **Total Patients:** 12,458
- **LVEF ≤ 40% (Positive):** 3,247 (26.1%)
- **LVEF > 40% (Negative):** 9,211 (73.9%)
- **Age Range:** 18-95 years
- **Gender Distribution:** 58% Male, 42% Female

## Preprocessing Pipeline

1. Bandpass Filter (0.5-45 Hz)
2. Powerline Noise Removal (50/60 Hz)
3. Wavelet Denoising
4. Z-Score Normalization
5. Resampling to 5000 samples

## Augmentation Techniques

- Gaussian Noise (σ = 0.1)
- Time Warping (±15%)
- Amplitude Scaling (±20%)
- Baseline Wander Simulation

## Citation

Jika menggunakan dataset ini, mohon citasi:

```
Maulana, M.S. (2025). ECG LVSD Detection Dataset. 
GitHub: https://github.com/sobri3195
```
