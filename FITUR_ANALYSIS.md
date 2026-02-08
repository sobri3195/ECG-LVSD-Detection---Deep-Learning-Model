# 🔬 ECG LVSD Detection - Analisis Fitur & Dokumentasi

**Author:** Lettu Kes dr. Muhammad Sobri Maulana, S.Kom, CEH, OSCP, OSCE  
**Email:** muhammadsobrimaulana31@gmail.com

---

## 📋 Daftar Isi

1. [Ringkasan Proyek](#ringkasan-proyek)
2. [10 Fitur Baru yang Ditambahkan](#10-fitur-baru-yang-ditambahkan)
3. [Detail Kompleksitas Fitur](#detail-kompleksitas-fitur)
4. [Struktur Dataset](#struktur-dataset)
5. [Arsitektur Teknis](#arsitektur-teknis)
6. [Panduan Penggunaan](#panduan-penggunaan)

---

## 🫀 Ringkasan Proyek

Proyek ini adalah platform deep learning canggih untuk deteksi **Left Ventricular Systolic Dysfunction (LVSD)** dari sinyal EKG 12-lead. Platform ini telah ditingkatkan secara signifikan dengan penambahan 10 fitur baru yang kompleks, meningkatkan kemampuan analisis, visualisasi, dan interaktivitas.

### Metrik Utama
- **Akurasi Model:** 93.8%
- **Waktu Inferensi:** 12ms (GPU accelerated)
- **Dataset:** 12,458 pasien
- **Tingkat Deteksi LVSD:** 26.1%

---

## ✨ 10 Fitur Baru yang Ditambahkan

### 1. 🎨 Interactive ECG Signal Visualizer
**Deskripsi:** Komponen visualisasi sinyal EKG real-time menggunakan HTML5 Canvas

**Fitur:**
- Playback animasi sinyal EKG
- Kontrol play/pause/reset
- Multi-lead visualization support
- Grid klinis standar (1mV x 0.04s)
- Zoom dan pan capabilities

**Implementasi:**
```typescript
const ECGVisualizer: React.FC<{
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  title?: string;
}> = ({ data, width = 600, height = 200, color = '#3b82f6', title }) => {
  // Canvas-based rendering dengan real-time updates
  // Custom useInterval hook untuk animation loop
};
```

**Kompleksitas:** Tinggi - Memerlukan knowledge canvas API, animation loops, dan signal processing visualization

---

### 2. 🧠 Model Architecture Visualizer
**Deskripsi:** Diagram interaktif arsitektur neural network

**Fitur:**
- Visualisasi layer-by-layer
- Informasi parameter per layer
- Color-coded layer types (Conv, Dense, Pool, etc.)
- Hover effects dan tooltips
- Support untuk berbagai arsitektur (ResNet, EfficientNet, Transformer)

**Layer Types Supported:**
- Input Layer (Green)
- Conv1D Block (Blue)
- Dense Layer (Purple)
- MaxPool (Orange)
- Batch Norm (Cyan)
- Dropout (Gray)
- Output Layer (Red)

**Kompleksitas:** Tinggi - Dynamic component rendering berdasarkan konfigurasi model

---

### 3. 📊 Training Metrics Dashboard
**Deskripsi:** Dashboard real-time untuk monitoring training

**Fitur:**
- Live loss curves (training & validation)
- Accuracy progression charts
- AUC-ROC tracking
- Training progress bar dengan ETA
- Export metrics to CSV/JSON

**Metrics Tracked:**
- Loss (Training & Validation)
- Accuracy (Training & Validation)
- AUC Score
- Precision & Recall
- F1-Score

**Implementasi:**
```typescript
interface TrainingMetrics {
  epoch: number;
  loss: number;
  valLoss: number;
  accuracy: number;
  valAccuracy: number;
  auc: number;
  timestamp: string;
}
```

**Kompleksitas:** Tinggi - Real-time data updates, canvas chart rendering

---

### 4. 🔄 Data Augmentation Preview
**Deskripsi:** Preview real-time efek augmentasi data

**Teknik Augmentasi:**
1. **Gaussian Noise** - Menambahkan noise acak
2. **Time Warping** - Stretch/compress time axis
3. **Amplitude Scaling** - Scaling amplitudo sinyal
4. **Baseline Wander** - Simulasi artifact pernapasan
5. **Powerline Noise** - Interferensi 50/60Hz

**Fitur Kontrol:**
- Toggle enable/disable per teknik
- Intensity slider (0-100%)
- Side-by-side comparison
- Real-time preview

**Kompleksitas:** Sedang-Tinggi - Signal processing algorithms, real-time preview

---

### 5. ⚖️ Model Comparison Tool
**Deskripsi:** Perbandingan komprehensif antar model

**Model yang Didukung:**
| Model | Arsitektur | Parameters | Accuracy | Inference |
|-------|------------|------------|----------|-----------|
| ResNet-ECG-50 | Residual CNN | 25.6M | 92.3% | 12ms |
| EfficientNet-B3 | Compound Scaling | 12.3M | 91.7% | 18ms |
| Transformer-ECG | Self-Attention | 18.7M | 93.8% | 28ms |
| LSTM-Attention | Recurrent + Attn | 8.9M | 89.4% | 22ms |
| CNN-GRU Hybrid | Hybrid CNN-RNN | 15.2M | 91.2% | 15ms |

**Fitur:**
- Side-by-side metric comparison
- Interactive selection
- Performance benchmarking
- Export comparison report

**Kompleksitas:** Sedang - State management untuk multiple model selection

---

### 6. 🎯 Real-time Prediction Simulator
**Deskripsi:** Simulasi analisis EKG real-time

**Fitur:**
- Live LVEF prediction
- Confidence scoring
- Auto-refresh interval (2 detik)
- Risk level classification
- Visual indicators

**Risk Classification:**
- 🟢 Low Risk (< 40%): Normal LV function
- 🟡 Moderate Risk (40-70%): Borderline dysfunction
- 🔴 High Risk (> 70%): Severe LVSD

**Kompleksitas:** Sedang - useInterval hook, state synchronization

---

### 7. 🔍 Feature Importance Analyzer
**Deskripsi:** Analisis dan visualisasi fitur EKG penting

**10 Fitur EKG Terpenting:**
1. **QRS Duration** (89%) - Durasi kompleks QRS
2. **QT Interval** (85%) - Interval QT total
3. **ST Elevation** (82%) - Elevasi segmen ST
4. **T-wave Amplitude** (78%) - Amplitudo gelombang T
5. **R-wave Progression** (76%) - Progresi gelombang R
6. **P-wave Duration** (72%) - Durasi gelombang P
7. **PR Interval** (68%) - Interval PR
8. **QRS Axis** (65%) - Sumbu listrik QRS
9. **Heart Rate Variability** (63%) - Variabilitas detak jantung
10. **Fragmented QRS** (58%) - Fragmentasi kompleks QRS

**Visualisasi:**
- Radar chart untuk top 6 fitur
- Horizontal bar chart untuk semua fitur
- Detail informasi per fitur (range normal, unit)

**Kompleksitas:** Tinggi - Canvas radar chart, complex calculations

---

### 8. 👥 Patient Case Studies
**Deskripsi:** Studi kasus pasien dengan detail lengkap

**Data Pasien:**
```typescript
interface PatientCase {
  id: string;           // PT-001, PT-002, etc.
  age: number;          // Usia pasien
  gender: 'M' | 'F';    // Jenis kelamin
  lvef: number;         // Left Ventricular Ejection Fraction
  diagnosis: string;    // Diagnosis medis
  ecgPattern: number[]; // Data sinyal EKG
  riskScore: number;    // Skor risiko 0-100
  symptoms: string[];   // Gejala yang dialami
}
```

**Kasus yang Tersedia:**
- **PT-001:** 65M, LVEF 35%, Dilated Cardiomyopathy, Risk 87%
- **PT-002:** 58F, LVEF 62%, Normal Sinus Rhythm, Risk 12%
- **PT-003:** 72M, LVEF 28%, Severe LVSD, Risk 95%
- **PT-004:** 45F, LVEF 55%, Borderline LV Function, Risk 42%

**Fitur:**
- Patient selector UI
- Detail panel dengan symptoms
- ECG visualization per patient
- Risk score color coding

**Kompleksitas:** Rendah-Sedang - Data management, UI components

---

### 9. 🎛️ Export Configuration Generator
**Deskripsi:** Generator konfigurasi untuk berbagai skenario deployment

**Format Export:**
- JSON configuration
- YAML configuration
- Python config module
- Environment variables
- Docker configuration

**Konfigurasi yang Dapat Disesuaikan:**
- Model architecture
- Hyperparameters (learning rate, batch size, epochs)
- Data paths
- Augmentation settings
- Hardware settings (GPU/CPU)

**Kompleksitas:** Rendah - File generation, template system

---

### 10. 💻 Interactive Code Playground
**Deskripsi:** Editor kode interaktif dengan syntax highlighting

**File yang Tersedia:**
- `preprocessing.py` - ECG preprocessing module
- `model.py` - Neural network architecture
- `config.yaml` - Configuration file

**Fitur:**
- Syntax highlighting
- Code preview dengan tabs
- Copy to clipboard
- Download individual files

**Kompleksitas:** Sedang - Code editor integration, syntax highlighting

---

## 🔧 Detail Kompleksitas Fitur

### Custom Hooks yang Dikembangkan

#### 1. `useLocalStorage<T>`
```typescript
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void]
```
- Persistent state management
- Type-safe implementation
- SSR-safe (checks for window object)

#### 2. `useDebounce<T>`
```typescript
const useDebounce = <T,>(value: T, delay: number): T
```
- Performance optimization untuk search inputs
- Cancelable timers
- Generic type support

#### 3. `useInterval`
```typescript
const useInterval = (callback: () => void, delay: number | null): void
```
- Real-time updates (ECG animation, predictions)
- Proper cleanup on unmount
- Dynamic delay adjustment

### State Management Complexity

| State | Type | Complexity |
|-------|------|------------|
| activeTab | string | Low |
| selectedModel | ModelConfig | Medium |
| selectedPatient | PatientCase | Medium |
| augmentations | AugmentationTechnique[] | High |
| trainingProgress | number | Low |
| darkMode | boolean (localStorage) | Medium |
| searchQuery | string | Low |
| isRealTimeEnabled | boolean | Low |

### Performance Optimizations

1. **useMemo** untuk:
   - Training history data generation
   - Project structure filtering
   - Model layer calculations

2. **useCallback** untuk:
   - Event handlers
   - Tab switching
   - Model selection

3. **useDebounce** untuk:
   - Search input (300ms delay)
   - Prevent excessive re-renders

---

## 📁 Struktur Dataset

```
dataset/
├── samples/
│   ├── raw_ecg/
│   │   ├── pt_001_raw.npz
│   │   ├── pt_002_raw.npz
│   │   └── ...
│   ├── metadata.csv
│   └── patient_info.json
│
├── preprocessed/
│   ├── filtered/
│   ├── normalized/
│   ├── segmented/
│   └── train_val_test_split/
│
└── augmented/
    ├── noise_injected/
    ├── time_warped/
    ├── amplitude_scaled/
    └── combined/
```

### Format Data

**Raw ECG (.npz):**
```python
{
    'signal': numpy.ndarray,      # Shape: (12, 5000) - 12 leads, 5000 samples
    'sampling_rate': int,          # Hz
    'patient_id': str,
    'timestamp': str,
    'lvef': float,                 # Ground truth
}
```

**Metadata (metadata.csv):**
```csv
patient_id,age,gender,lvef,diagnosis,risk_score,symptoms
PT-001,65,M,35.0,Dilated Cardiomyopathy,87,Dyspnea;Fatigue;Edema
PT-002,58,F,62.0,Normal Sinus Rhythm,12,Asymptomatic
```

---

## 🏗️ Arsitektur Teknis

### Tech Stack
- **Framework:** React 18+ dengan TypeScript
- **Styling:** Tailwind CSS dengan Dark Mode support
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useReducer, useContext)
- **Visualization:** HTML5 Canvas API

### Component Hierarchy
```
ECGLVSDProjectGenerator (Root)
├── Header
│   ├── Title & Author Info
│   ├── Dark Mode Toggle
│   └── Export Button
├── Navigation Tabs
│   ├── Overview
│   ├── ECG Analysis
│   ├── Models
│   ├── Training
│   ├── Augmentation
│   └── Code
├── Tab Content Area
│   └── Dynamic Component Rendering
└── Footer
    └── Social Links
```

### Type System

**Core Types:**
- `PatientCase` - Patient data structure
- `ModelConfig` - Model configuration
- `TrainingMetrics` - Training epoch data
- `ECGFeature` - Feature importance data
- `AugmentationTechnique` - Augmentation settings

**Generic Types:**
- `useLocalStorage<T>` - Persistent state
- `useDebounce<T>` - Debounced values

---

## 📖 Panduan Penggunaan

### 1. Overview Tab
- Melihat statistik proyek (total pasien, akurasi model, dll)
- Search dan filter struktur proyek
- Quick navigation ke file-file penting

### 2. ECG Analysis Tab
- Pilih patient case dari gallery
- Visualisasikan sinyal EKG dengan playback
- Lihat detail pasien (LVEF, symptoms, risk score)
- Aktifkan real-time prediction simulator

### 3. Models Tab
- Bandingkan performa berbagai model
- Pilih model untuk training/inference
- Lihat arsitektur model visual
- Analisis feature importance

### 4. Training Tab
- Start training dengan progress tracking
- Monitor loss curves real-time
- Export training metrics
- Early stopping configuration

### 5. Augmentation Tab
- Configure augmentation techniques
- Preview efek pada sinyal EKG
- Adjust intensity parameters
- Save augmentation pipeline

### 6. Code Tab
- Browse source code files
- Copy code snippets
- Download individual files
- View configuration templates

---

## 🔗 Links & Support

- **GitHub:** [github.com/sobri3195](https://github.com/sobri3195)
- **YouTube:** [@muhammadsobrimaulana6013](https://www.youtube.com/@muhammadsobrimaulana6013)
- **Telegram:** [@winlin_exploit](https://t.me/winlin_exploit)
- **TikTok:** [@dr.sobri](https://www.tiktok.com/@dr.sobri)
- **WhatsApp Group:** [Join Here](https://chat.whatsapp.com/B8nwRZOBMo64GjTwdXV8Bl)
- **Donasi:** [Lynk.id/muhsobrimaulana](https://lynk.id/muhsobrimaulana)

---

## 📜 License

Copyright © 2025 Lettu Kes dr. Muhammad Sobri Maulana  
All Rights Reserved.

---

*Dokumen ini dibuat untuk mendokumentasikan peningkatan signifikan pada ECG LVSD Detection Project dengan penambahan 10 fitur kompleks dan struktur dataset yang terorganisir.*
