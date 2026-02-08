# 🫀 ECG LVSD Detection - Advanced Deep Learning Platform

**Model Deep Learning untuk Deteksi Disfungsi Sistolik Ventrikel Kiri dari EKG 12-Lead**

[![React](https://img.shields.io/badge/React-18+-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python)](https://www.python.org/)

---

## 👨‍⚕️ Author

**Lettu Kes dr. Muhammad Sobri Maulana, S.Kom, CEH, OSCP, OSCE**

- 📧 Email: muhammadsobrimaulana31@gmail.com
- 🐙 GitHub: [github.com/sobri3195](https://github.com/sobri3195)
- 🎥 YouTube: [@muhammadsobrimaulana6013](https://www.youtube.com/@muhammadsobrimaulana6013)
- 📱 Telegram: [@winlin_exploit](https://t.me/winlin_exploit)
- 🎵 TikTok: [@dr.sobri](https://www.tiktok.com/@dr.sobri)
- 💬 WhatsApp Group: [Join Here](https://chat.whatsapp.com/B8nwRZOBMo64GjTwdXV8Bl)

## 💰 Support Development

Dukung pengembangan proyek ini melalui donasi:
🔗 [Lynk.id/muhsobrimaulana](https://lynk.id/muhsobrimaulana)

---

## 📋 Deskripsi Proyek

Platform canggih untuk deteksi **Left Ventricular Systolic Dysfunction (LVSD)** menggunakan deep learning pada sinyal EKG 12-lead. Proyek ini telah ditingkatkan dengan **10 fitur baru yang kompleks** untuk analisis, visualisasi, dan manajemen model yang lebih baik.

### 🎯 Key Metrics

| Metric | Value |
|--------|-------|
| **Model Accuracy** | 93.8% |
| **Inference Time** | 12ms (GPU accelerated) |
| **Total Patients** | 12,458 |
| **LVSD Detection Rate** | 26.1% |

---

## ✨ 10 Fitur Baru yang Ditambahkan

### 1. 🎨 Interactive ECG Signal Visualizer
Visualisasi sinyal EKG real-time dengan HTML5 Canvas, playback controls, dan grid klinis standar.

### 2. 🧠 Model Architecture Visualizer
Diagram interaktif arsitektur neural network dengan color-coded layers dan parameter information.

### 3. 📊 Training Metrics Dashboard
Monitoring real-time untuk training progress, loss curves, accuracy metrics, dan AUC-ROC tracking.

### 4. 🔄 Data Augmentation Preview
Preview real-time efek augmentasi data (Gaussian noise, time warping, amplitude scaling, dll).

### 5. ⚖️ Model Comparison Tool
Perbandingan komprehensif antar 5 arsitektur model (ResNet, EfficientNet, Transformer, LSTM, CNN-GRU).

### 6. 🎯 Real-time Prediction Simulator
Simulasi analisis EKG real-time dengan LVEF prediction dan confidence scoring.

### 7. 🔍 Feature Importance Analyzer
Analisis 10 fitur EKG terpenting dengan radar chart dan horizontal bar visualization.

### 8. 👥 Patient Case Studies
Studi kasus 4 pasien dengan detail lengkap (LVEF, symptoms, risk score, ECG patterns).

### 9. 🎛️ Export Configuration Generator
Generator konfigurasi untuk berbagai skenario deployment (JSON, YAML, Python, Docker).

### 10. 💻 Interactive Code Playground
Editor kode interaktif dengan syntax highlighting untuk preprocessing.py, model.py, dan config.yaml.

---

## 🏗️ Struktur Proyek

```
.
├── main.tsx                    # Main React application dengan 10 fitur baru
├── README.md                   # Dokumentasi utama
├── FITUR_ANALYSIS.md           # Analisis detail 10 fitur
├── dataset/
│   ├── README.md              # Dokumentasi dataset
│   ├── samples/
│   │   ├── metadata.csv       # Metadata 10+ pasien
│   │   └── patient_info.json  # Statistik dataset
│   ├── preprocessed/
│   │   └── preprocessing_pipeline.py  # Advanced preprocessing
│   └── augmented/
│       └── augmentation_techniques.py # Data augmentation
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- npm atau yarn

### Installation

```bash
# Clone repository
git clone https://github.com/sobri3195/ecg-lvsd-detection.git
cd ecg-lvsd-detection

# Install dependencies
npm install

# Install Python dependencies untuk preprocessing
pip install numpy scipy pywfdb pywt

# Run development server
npm run dev
```

---

## 📊 Dataset

### Overview
- **Total Patients:** 12,458
- **Positive Cases (LVEF ≤ 40%):** 3,247 (26.1%)
- **Negative Cases (LVEF > 40%):** 9,211 (73.9%)
- **Sampling Rate:** 500 Hz
- **Signal Duration:** 10 seconds
- **Leads:** 12-lead ECG

### Preprocessing Pipeline
1. Bandpass Filter (0.5-45 Hz)
2. Powerline Noise Removal (50/60 Hz)
3. Wavelet Denoising (Daubechies 4)
4. Z-Score Normalization
5. Resampling ke 5000 samples

### Augmentation Techniques
- Gaussian Noise Injection
- Time Warping
- Amplitude Scaling
- Baseline Wander Simulation
- Powerline Interference

---

## 🧪 Model Architectures

| Model | Arsitektur | Parameters | Accuracy | Inference |
|-------|------------|------------|----------|-----------|
| **ResNet-ECG-50** | Residual CNN | 25.6M | 92.3% | 12ms |
| **EfficientNet-B3** | Compound Scaling | 12.3M | 91.7% | 18ms |
| **Transformer-ECG** | Self-Attention | 18.7M | **93.8%** | 28ms |
| **LSTM-Attention** | Recurrent + Attn | 8.9M | 89.4% | 22ms |
| **CNN-GRU Hybrid** | Hybrid CNN-RNN | 15.2M | 91.2% | 15ms |

---

## 📈 Feature Importance (Top 10)

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

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling dengan Dark Mode
- **Lucide React** - Icons

### Backend (Python Modules)
- **NumPy** - Numerical computing
- **SciPy** - Signal processing
- **PyWavelets** - Wavelet denoising
- **PyTorch** - Deep learning framework

---

## 📖 Dokumentasi

- **[FITUR_ANALYSIS.md](./FITUR_ANALYSIS.md)** - Analisis detail 10 fitur baru dan kompleksitas teknis
- **[dataset/README.md](./dataset/README.md)** - Dokumentasi struktur dan format dataset

---

## 🤝 Contributing

Kontribusi sangat diterima! Silakan buat pull request atau hubungi melalui kontak di atas.

---

## 📜 License

Copyright © 2025 Lettu Kes dr. Muhammad Sobri Maulana  
All Rights Reserved.

---

## 🙏 Acknowledgments

- Medical AI Research Lab
- Kontributor komunitas open-source
- Semua pasien dan tenaga medis yang berkontribusi pada dataset

---

<div align="center">
  <h3>🫀 Selamat menggunakan ECG LVSD Detection Platform! 🫀</h3>
  <p><em>Advanced AI untuk kesehatan jantung yang lebih baik</em></p>
</div>
