import React, { useState } from 'react';
import { Download, FileText, Code, Database, Brain, FileCode } from 'lucide-react';

const ECGLVSDProjectGenerator = () => {
  const [downloading, setDownloading] = useState(false);

  const generateZip = async () => {
    setDownloading(true);
    
    // Simulate download preparation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, you would generate and download the actual zip file
    // For this demo, we'll create a structure preview
    alert('Struktur proyek telah disiapkan!\n\nSilakan salin kode dari setiap file di bawah untuk membuat proyek lengkap.');
    
    setDownloading(false);
  };

  const projectStructure = [
    { name: 'README.md', icon: FileText, color: 'text-blue-500' },
    { name: 'requirements.txt', icon: FileCode, color: 'text-green-500' },
    { name: 'src/preprocessing.py', icon: Code, color: 'text-purple-500' },
    { name: 'src/models.py', icon: Brain, color: 'text-red-500' },
    { name: 'src/train.py', icon: Code, color: 'text-yellow-500' },
    { name: 'src/evaluate.py', icon: Code, color: 'text-indigo-500' },
    { name: 'src/utils.py', icon: Code, color: 'text-pink-500' },
    { name: 'src/visualization.py', icon: Code, color: 'text-cyan-500' },
    { name: 'data/dataset_loader.py', icon: Database, color: 'text-orange-500' },
    { name: 'notebooks/EDA.ipynb', icon: FileText, color: 'text-teal-500' },
  ];

  const readmeContent = `# ECG LVSD Detection - Deep Learning Model

🫀 **Model Deep Learning untuk Deteksi Disfungsi Sistolik Ventrikel Kiri dari EKG 12-Lead**

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

Proyek ini mengembangkan model deep learning untuk mendeteksi disfungsi sistolik 
ventrikel kiri (LVEF ≤40%) dari sinyal elektrokardiografi (EKG) 12-lead.`;

  const requirementsContent = `# Deep Learning Frameworks
torch>=2.0.0
torchvision>=0.15.0
tensorflow>=2.13.0

# Data Processing
numpy>=1.24.0
pandas>=2.0.0
scipy>=1.10.0
h5py>=3.8.0

# Signal Processing
wfdb>=4.1.0
neurokit2>=0.2.0

# Visualization
matplotlib>=3.7.0
seaborn>=0.12.0
plotly>=5.14.0`;

  const preprocessingContent = `"""
ECG Signal Preprocessing Module
Author: Lettu Kes dr. Muhammad Sobri Maulana, S.Kom, CEH, OSCP, OSCE
Email: muhammadsobrimaulana31@gmail.com
"""

import numpy as np
from scipy import signal
from scipy.signal import butter, filtfilt, iirnotch

class ECGPreprocessor:
    def __init__(self, sampling_rate=500, target_length=5000):
        self.sampling_rate = sampling_rate
        self.target_length = target_length`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Brain className="w-12 h-12 text-indigo-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                ECG LVSD Detection Project
              </h1>
              <p className="text-gray-600">
                Deep Learning untuk Deteksi Disfungsi Sistolik Ventrikel Kiri
              </p>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-700">Author:</p>
                <p className="text-gray-600">Lettu Kes dr. Muhammad Sobri Maulana, S.Kom, CEH, OSCP, OSCE</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Contact:</p>
                <p className="text-gray-600">muhammadsobrimaulana31@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Structure */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Struktur Proyek</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectStructure.map((file, index) => {
              const IconComponent = file.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <IconComponent className={`w-6 h-6 ${file.color}`} />
                  <span className="text-gray-700 font-mono text-sm">{file.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Download Button */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Download Project Files</h2>
          <p className="text-gray-600 mb-6">
            Klik tombol di bawah untuk melihat preview struktur proyek lengkap
          </p>
          <button
            onClick={generateZip}
            disabled={downloading}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            {downloading ? 'Menyiapkan...' : 'Preview Project Structure'}
          </button>
        </div>

        {/* Code Preview Sections */}
        <div className="space-y-6">
          {/* README.md */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-bold text-gray-800">README.md</h3>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
              {readmeContent}
            </pre>
          </div>

          {/* requirements.txt */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-2 mb-4">
              <FileCode className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-bold text-gray-800">requirements.txt</h3>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm">
              {requirementsContent}
            </pre>
          </div>

          {/* preprocessing.py */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-6 h-6 text-purple-500" />
              <h3 className="text-xl font-bold text-gray-800">src/preprocessing.py</h3>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm">
              {preprocessingContent}
            </pre>
          </div>

          {/* Download Instructions */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">📥 Cara Download Project Lengkap</h3>
            <div className="space-y-3">
              <p>1. Scroll ke atas dan klik tombol "Preview Project Structure"</p>
              <p>2. Salin semua kode dari setiap file yang ditampilkan</p>
              <p>3. Buat struktur folder sesuai dengan struktur proyek</p>
              <p>4. Paste kode ke file yang sesuai</p>
              <p>5. Install dependencies dengan: pip install -r requirements.txt</p>
            </div>
            
            <div className="mt-6 p-4 bg-white/10 rounded-lg">
              <p className="font-semibold mb-2">💡 Tips:</p>
              <p className="text-sm">Untuk mendapatkan file lengkap dengan semua kode Python, model architectures, dan notebooks, silakan hubungi:</p>
              <p className="text-sm mt-2">📧 muhammadsobrimaulana31@gmail.com</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              🔗 Connect & Support
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="https://github.com/sobri3195" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-3 p-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                <Code className="w-6 h-6" />
                <span>GitHub: sobri3195</span>
              </a>
              <a href="https://lynk.id/muhsobrimaulana" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                <Download className="w-6 h-6" />
                <span>Donasi (Lynk.id)</span>
              </a>
              <a href="https://www.youtube.com/@muhammadsobrimaulana6013" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                <FileText className="w-6 h-6" />
                <span>YouTube Channel</span>
              </a>
              <a href="https://t.me/winlin_exploit" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                <Brain className="w-6 h-6" />
                <span>Telegram</span>
              </a>
              <a href="https://www.tiktok.com/@dr.sobri" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 p-4 bg-black text-white rounded-lg hover:bg-gray-900 transition">
                <FileText className="w-6 h-6" />
                <span>TikTok: @dr.sobri</span>
              </a>
              <a href="https://chat.whatsapp.com/B8nwRZOBMo64GjTwdXV8Bl" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <Database className="w-6 h-6" />
                <span>WhatsApp Group</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECGLVSDProjectGenerator;
