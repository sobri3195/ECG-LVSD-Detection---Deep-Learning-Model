import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Download, FileText, Code, Database, Brain, FileCode,
  Activity, TrendingUp, Layers, GitCompare, Play, Pause,
  Settings, BarChart3, Microscope, Users, Share2,
  Zap, Shield, Cpu, Eye, ChevronDown, ChevronUp,
  RefreshCw, CheckCircle, AlertCircle, Clock,
  Thermometer, Heart, ActivitySquare, Stethoscope,
  FileJson, Terminal, Server, Lock, Globe,
  Menu, X, Moon, Sun, Filter, Search, Bell,
  Award, BookOpen, GitBranch, Bug, Info
} from 'lucide-react';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface PatientCase {
  id: string;
  age: number;
  gender: 'M' | 'F';
  lvef: number;
  diagnosis: string;
  ecgPattern: number[];
  riskScore: number;
  symptoms: string[];
}

interface ModelConfig {
  name: string;
  architecture: string;
  layers: number;
  params: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  inferenceTime: number;
}

interface TrainingMetrics {
  epoch: number;
  loss: number;
  valLoss: number;
  accuracy: number;
  valAccuracy: number;
  auc: number;
  timestamp: string;
}

interface ECGFeature {
  name: string;
  importance: number;
  description: string;
  normalRange: string;
  unit: string;
}

interface AugmentationTechnique {
  name: string;
  description: string;
  intensity: number;
  enabled: boolean;
}

interface ComprehensiveFeature {
  id: string;
  name: string;
  category: 'Clinical AI' | 'Operations' | 'Compliance' | 'Integration';
  maturity: 'Pilot' | 'Production' | 'Validated';
  impact: number;
  complexity: 'Medium' | 'High' | 'Critical';
  description: string;
  capabilities: string[];
  integration: string;
}

// ============================================
// CUSTOM HOOKS
// ============================================

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current?.(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// ============================================
// MOCK DATA GENERATORS
// ============================================

const generateECGData = (length: number = 500): number[] => {
  return Array.from({ length }, (_, i) => {
    const t = i / 100;
    return Math.sin(t * 10) * 0.3 + 
           Math.sin(t * 25) * 0.2 + 
           Math.sin(t * 5) * 0.15 +
           (Math.random() - 0.5) * 0.1;
  });
};

const generateTrainingHistory = (): TrainingMetrics[] => {
  return Array.from({ length: 50 }, (_, i) => ({
    epoch: i + 1,
    loss: 0.8 * Math.exp(-i / 15) + 0.1 + Math.random() * 0.05,
    valLoss: 0.85 * Math.exp(-i / 15) + 0.12 + Math.random() * 0.08,
    accuracy: 0.5 + 0.45 * (1 - Math.exp(-i / 12)) + Math.random() * 0.03,
    valAccuracy: 0.48 + 0.45 * (1 - Math.exp(-i / 12)) + Math.random() * 0.04,
    auc: 0.52 + 0.43 * (1 - Math.exp(-i / 10)) + Math.random() * 0.02,
    timestamp: new Date(Date.now() - (50 - i) * 60000).toISOString()
  }));
};

const PATIENT_CASES: PatientCase[] = [
  { id: 'PT-001', age: 65, gender: 'M', lvef: 35, diagnosis: 'Dilated Cardiomyopathy', ecgPattern: generateECGData(), riskScore: 87, symptoms: ['Dyspnea', 'Fatigue', 'Edema'] },
  { id: 'PT-002', age: 58, gender: 'F', lvef: 62, diagnosis: 'Normal Sinus Rhythm', ecgPattern: generateECGData(), riskScore: 12, symptoms: ['Asymptomatic'] },
  { id: 'PT-003', age: 72, gender: 'M', lvef: 28, diagnosis: 'Severe LVSD', ecgPattern: generateECGData(), riskScore: 95, symptoms: ['Chest Pain', 'Palpitations', 'Syncope'] },
  { id: 'PT-004', age: 45, gender: 'F', lvef: 55, diagnosis: 'Borderline LV Function', ecgPattern: generateECGData(), riskScore: 42, symptoms: ['Mild Fatigue'] },
];

const MODEL_CONFIGS: ModelConfig[] = [
  { name: 'ResNet-ECG-50', architecture: 'Residual CNN', layers: 50, params: '25.6M', accuracy: 0.923, precision: 0.918, recall: 0.931, f1Score: 0.924, inferenceTime: 12 },
  { name: 'EfficientNet-B3', architecture: 'Compound Scaling', layers: 83, params: '12.3M', accuracy: 0.917, precision: 0.912, recall: 0.925, f1Score: 0.918, inferenceTime: 18 },
  { name: 'Transformer-ECG', architecture: 'Self-Attention', layers: 12, params: '18.7M', accuracy: 0.938, precision: 0.941, recall: 0.936, f1Score: 0.938, inferenceTime: 28 },
  { name: 'LSTM-Attention', architecture: 'Recurrent + Attention', layers: 4, params: '8.9M', accuracy: 0.894, precision: 0.887, recall: 0.902, f1Score: 0.894, inferenceTime: 22 },
  { name: 'CNN-GRU Hybrid', architecture: 'Hybrid CNN-RNN', layers: 18, params: '15.2M', accuracy: 0.912, precision: 0.908, recall: 0.918, f1Score: 0.913, inferenceTime: 15 },
];

const ECG_FEATURES: ECGFeature[] = [
  { name: 'QRS Duration', importance: 0.89, description: 'Time from Q wave start to S wave end', normalRange: '80-120', unit: 'ms' },
  { name: 'QT Interval', importance: 0.85, description: 'Total ventricular depolarization and repolarization time', normalRange: '350-440', unit: 'ms' },
  { name: 'ST Elevation', importance: 0.82, description: 'Elevation of ST segment from baseline', normalRange: '-0.5 to +1.0', unit: 'mm' },
  { name: 'T-wave Amplitude', importance: 0.78, description: 'Amplitude of T wave representing ventricular repolarization', normalRange: '1-10', unit: 'mm' },
  { name: 'R-wave Progression', importance: 0.76, description: 'Pattern of R wave amplitude across precordial leads', normalRange: 'Gradual increase', unit: 'mm' },
  { name: 'P-wave Duration', importance: 0.72, description: 'Atrial depolarization duration', normalRange: '<120', unit: 'ms' },
  { name: 'PR Interval', importance: 0.68, description: 'Time from atrial to ventricular depolarization', normalRange: '120-200', unit: 'ms' },
  { name: 'QRS Axis', importance: 0.65, description: 'Mean electrical axis of ventricular depolarization', normalRange: '-30 to +90', unit: 'degrees' },
  { name: 'Heart Rate Variability', importance: 0.63, description: 'Variation in time between consecutive heartbeats', normalRange: '20-100', unit: 'ms' },
  { name: 'Fragmented QRS', importance: 0.58, description: 'Presence of additional deflections in QRS complex', normalRange: 'Absent', unit: 'binary' },
];

const COMPREHENSIVE_FEATURES: ComprehensiveFeature[] = [
  {
    id: 'multimodal',
    name: 'Multimodal Fusion Engine',
    category: 'Clinical AI',
    maturity: 'Validated',
    impact: 96,
    complexity: 'Critical',
    description: 'Menggabungkan EKG, echocardiography summary, dan biomarker untuk prediksi LVSD yang lebih robust.',
    capabilities: ['Late-fusion attention', 'Missing modality handler', 'Uncertainty calibration'],
    integration: 'FHIR + DICOM metadata bridge'
  },
  {
    id: 'federated',
    name: 'Federated Training Coordinator',
    category: 'Operations',
    maturity: 'Production',
    impact: 90,
    complexity: 'Critical',
    description: 'Sinkronisasi training lintas rumah sakit tanpa memindahkan data sensitif.',
    capabilities: ['Secure aggregation', 'Differential privacy', 'Site performance scorecard'],
    integration: 'VPN edge node + audit logs'
  },
  {
    id: 'drift',
    name: 'Concept Drift Sentinel',
    category: 'Clinical AI',
    maturity: 'Production',
    impact: 92,
    complexity: 'High',
    description: 'Deteksi drift populasi pasien dan perubahan distribusi sinyal secara real-time.',
    capabilities: ['PSI monitor', 'Alarm thresholding', 'Auto-retraining trigger'],
    integration: 'Prometheus + alert webhook'
  },
  {
    id: 'fairness',
    name: 'Fairness & Bias Profiler',
    category: 'Compliance',
    maturity: 'Validated',
    impact: 88,
    complexity: 'High',
    description: 'Analisis bias per gender, usia, komorbid, dan lokasi fasilitas kesehatan.',
    capabilities: ['Subgroup AUC', 'Equalized odds check', 'Mitigation recommendation'],
    integration: 'Governance dashboard'
  },
  {
    id: 'explainability',
    name: 'Clinician Explainability Copilot',
    category: 'Clinical AI',
    maturity: 'Production',
    impact: 94,
    complexity: 'High',
    description: 'Memberikan alasan prediksi model berbasis lead-level saliency dan aturan klinis.',
    capabilities: ['Lead saliency map', 'Natural language rationale', 'Counterfactual signal view'],
    integration: 'EHR note assistant'
  },
  {
    id: 'triage',
    name: 'Emergency Triage Prioritizer',
    category: 'Operations',
    maturity: 'Pilot',
    impact: 85,
    complexity: 'High',
    description: 'Prioritasi pasien berisiko tinggi dengan SLA alert untuk tim jaga.',
    capabilities: ['Queue stratification', 'Color risk lane', 'Time-to-review tracker'],
    integration: 'Nurse station monitor'
  },
  {
    id: 'consent',
    name: 'Dynamic Consent Manager',
    category: 'Compliance',
    maturity: 'Production',
    impact: 83,
    complexity: 'Medium',
    description: 'Manajemen persetujuan pasien granular untuk penggunaan data penelitian dan klinis.',
    capabilities: ['Consent versioning', 'Revocation workflow', 'Policy simulation'],
    integration: 'Identity provider + legal archive'
  },
  {
    id: 'deployment',
    name: 'Smart Deployment Orchestrator',
    category: 'Integration',
    maturity: 'Validated',
    impact: 87,
    complexity: 'High',
    description: 'Blue/green deployment model dengan fallback otomatis ketika performa menurun.',
    capabilities: ['Canary rollout', 'Health probing', 'Instant rollback'],
    integration: 'Kubernetes + service mesh'
  },
  {
    id: 'simulator',
    name: 'Synthetic Cohort Simulator',
    category: 'Clinical AI',
    maturity: 'Pilot',
    impact: 82,
    complexity: 'Medium',
    description: 'Generasi cohort sintetis untuk stress-test model pada skenario langka.',
    capabilities: ['Demographic balancing', 'Rare case amplification', 'Scenario replay'],
    integration: 'Research sandbox'
  },
  {
    id: 'reporting',
    name: 'Regulatory Reporting Generator',
    category: 'Compliance',
    maturity: 'Validated',
    impact: 86,
    complexity: 'Medium',
    description: 'Menyusun laporan kepatuhan model untuk komite etik dan regulator.',
    capabilities: ['Model card export', 'Validation bundle', 'Incident timeline'],
    integration: 'PDF + JSON evidence package'
  }
];

// ============================================
// SUB-COMPONENTS
// ============================================

const ECGVisualizer: React.FC<{ data: number[]; width?: number; height?: number; color?: string; title?: string }> = 
  ({ data, width = 600, height = 200, color = '#3b82f6', title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw ECG signal
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const visiblePoints = Math.min(data.length, 200);
    const startIdx = isPlaying ? offset % (data.length - visiblePoints) : 0;
    
    for (let i = 0; i < visiblePoints; i++) {
      const x = (i / visiblePoints) * width;
      const y = height / 2 + data[startIdx + i] * (height * 0.4);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [data, width, height, color, offset, isPlaying]);

  useInterval(() => {
    if (isPlaying) setOffset(o => o + 2);
  }, 50);

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      {title && <h4 className="text-white font-semibold mb-2">{title}</h4>}
      <canvas ref={canvasRef} width={width} height={height} className="w-full rounded" />
      <div className="flex justify-center gap-2 mt-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={() => setOffset(0)}
          className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
};

const ModelArchitectureDiagram: React.FC<{ config: ModelConfig }> = ({ config }) => {
  const layers = useMemo(() => {
    const baseLayers = [
      { name: 'Input Layer', neurons: 5000, type: 'input' },
      { name: 'Conv1D Block 1', neurons: 128, type: 'conv' },
      { name: 'Batch Norm', neurons: 128, type: 'norm' },
      { name: 'MaxPool', neurons: 64, type: 'pool' },
      { name: 'Conv1D Block 2', neurons: 256, type: 'conv' },
      { name: 'Batch Norm', neurons: 256, type: 'norm' },
      { name: 'Global Avg Pool', neurons: 256, type: 'pool' },
      { name: 'Dense Layer 1', neurons: 512, type: 'dense' },
      { name: 'Dropout (0.5)', neurons: 512, type: 'dropout' },
      { name: 'Dense Layer 2', neurons: 128, type: 'dense' },
      { name: 'Output Layer', neurons: 2, type: 'output' },
    ];
    return baseLayers;
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
      <div className="flex flex-col items-center gap-2 min-w-max">
        {layers.map((layer, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div 
              className={`px-6 py-3 rounded-lg text-white font-medium text-sm shadow-lg transition-all hover:scale-105 ${
                layer.type === 'input' ? 'bg-green-600' :
                layer.type === 'conv' ? 'bg-blue-600' :
                layer.type === 'dense' ? 'bg-purple-600' :
                layer.type === 'output' ? 'bg-red-600' :
                layer.type === 'pool' ? 'bg-orange-600' :
                layer.type === 'norm' ? 'bg-cyan-600' :
                'bg-gray-600'
              }`}
              style={{ width: `${Math.max(120, layer.neurons / 5)}px` }}
            >
              <div className="text-center">{layer.name}</div>
              <div className="text-xs opacity-80 text-center">{layer.neurons} units</div>
            </div>
            {idx < layers.length - 1 && (
              <div className="h-4 w-0.5 bg-gray-600 my-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MetricsChart: React.FC<{ data: TrainingMetrics[]; metric: keyof TrainingMetrics }> = ({ data, metric }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = 400;
  const height = 200;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    const values = data.map(d => d[metric] as number);
    const min = Math.min(...values) * 0.9;
    const max = Math.max(...values) * 1.1;

    // Draw line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    values.forEach((val, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((val - min) / (max - min)) * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#60a5fa';
    values.forEach((val, i) => {
      if (i % 5 === 0) {
        const x = (i / (values.length - 1)) * width;
        const y = height - ((val - min) / (max - min)) * height;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [data, metric, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className="w-full rounded" />;
};

const FeatureImportanceRadar: React.FC<{ features: ECGFeature[] }> = ({ features }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = 300;
  const height = 300;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 120;

    // Draw grid circles
    for (let i = 1; i <= 5; i++) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw axes and labels
    const topFeatures = features.slice(0, 6);
    topFeatures.forEach((feature, i) => {
      const angle = (i / topFeatures.length) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.strokeStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Label
      const labelX = centerX + Math.cos(angle) * (radius + 20);
      const labelY = centerY + Math.sin(angle) * (radius + 20);
      ctx.fillStyle = '#475569';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(feature.name.substring(0, 10), labelX, labelY);
    });

    // Draw data polygon
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    topFeatures.forEach((feature, i) => {
      const angle = (i / topFeatures.length) * Math.PI * 2 - Math.PI / 2;
      const value = feature.importance;
      const x = centerX + Math.cos(angle) * radius * value;
      const y = centerY + Math.sin(angle) * radius * value;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }, [features, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className="mx-auto" />;
};

// ============================================
// MAIN COMPONENT
// ============================================

const ECGLVSDProjectGenerator: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [downloading, setDownloading] = useState(false);
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(MODEL_CONFIGS[0]);
  const [selectedPatient, setSelectedPatient] = useState<PatientCase>(PATIENT_CASES[0]);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const [predictionResult, setPredictionResult] = useState<{ lvef: number; confidence: number } | null>(null);
  const [augmentations, setAugmentations] = useState<AugmentationTechnique[]>([
    { name: 'Gaussian Noise', description: 'Add random noise to signal', intensity: 0.1, enabled: true },
    { name: 'Time Warping', description: 'Stretch or compress time axis', intensity: 0.15, enabled: true },
    { name: 'Amplitude Scaling', description: 'Scale signal amplitude', intensity: 0.2, enabled: false },
    { name: 'Baseline Wander', description: 'Simulate breathing artifact', intensity: 0.1, enabled: true },
    { name: 'Powerline Noise', description: 'Add 50/60Hz interference', intensity: 0.05, enabled: false },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [codeEditorContent, setCodeEditorContent] = useState('');
  const [compareModels, setCompareModels] = useState<string[]>([]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [featureCategoryFilter, setFeatureCategoryFilter] = useState<'All' | ComprehensiveFeature['category']>('All');
  const [featureMaturityFilter, setFeatureMaturityFilter] = useState<'All' | ComprehensiveFeature['maturity']>('All');
  const [enabledComprehensiveFeatures, setEnabledComprehensiveFeatures] = useLocalStorage<string[]>('enabledComprehensiveFeatures', []);

  const trainingHistory = useMemo(() => generateTrainingHistory(), []);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Notification helper
  const showNotificationMsg = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  // Generate zip handler
  const generateZip = async () => {
    setDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    showNotificationMsg('Project structure exported successfully!');
    setDownloading(false);
  };

  // Simulate training
  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          showNotificationMsg('Training completed successfully!');
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  // Real-time prediction simulation
  useInterval(() => {
    if (isRealTimeEnabled) {
      setPredictionResult({
        lvef: Math.floor(Math.random() * 40) + 20,
        confidence: 0.85 + Math.random() * 0.14
      });
    }
  }, isRealTimeEnabled ? 2000 : null);

  // Project structure
  const projectStructure = useMemo(() => [
    { name: 'README.md', icon: FileText, color: 'text-blue-500', category: 'Documentation' },
    { name: 'requirements.txt', icon: FileCode, color: 'text-green-500', category: 'Config' },
    { name: 'config.yaml', icon: Settings, color: 'text-orange-500', category: 'Config' },
    { name: 'src/preprocessing.py', icon: Code, color: 'text-purple-500', category: 'Source' },
    { name: 'src/models.py', icon: Brain, color: 'text-red-500', category: 'Source' },
    { name: 'src/train.py', icon: Play, color: 'text-yellow-500', category: 'Source' },
    { name: 'src/evaluate.py', icon: BarChart3, color: 'text-indigo-500', category: 'Source' },
    { name: 'src/utils.py', icon: Code, color: 'text-pink-500', category: 'Source' },
    { name: 'src/visualization.py', icon: Eye, color: 'text-cyan-500', category: 'Source' },
    { name: 'src/augmentation.py', icon: RefreshCw, color: 'text-teal-500', category: 'Source' },
    { name: 'src/inference.py', icon: Zap, color: 'text-amber-500', category: 'Source' },
    { name: 'data/dataset_loader.py', icon: Database, color: 'text-orange-500', category: 'Data' },
    { name: 'data/preprocessor.py', icon: Activity, color: 'text-lime-500', category: 'Data' },
    { name: 'notebooks/EDA.ipynb', icon: FileText, color: 'text-teal-500', category: 'Notebook' },
    { name: 'notebooks/Model_Training.ipynb', icon: BookOpen, color: 'text-violet-500', category: 'Notebook' },
    { name: 'tests/test_models.py', icon: Bug, color: 'text-rose-500', category: 'Test' },
    { name: 'tests/test_preprocessing.py', icon: CheckCircle, color: 'text-emerald-500', category: 'Test' },
    { name: 'api/main.py', icon: Server, color: 'text-sky-500', category: 'API' },
    { name: 'docker/Dockerfile', icon: Globe, color: 'text-blue-400', category: 'Deploy' },
    { name: 'scripts/deploy.sh', icon: Terminal, color: 'text-gray-500', category: 'Deploy' },
  ], []);

  // Filtered structure
  const filteredStructure = useMemo(() => {
    if (!debouncedSearch) return projectStructure;
    return projectStructure.filter(item => 
      item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [projectStructure, debouncedSearch]);

  const filteredComprehensiveFeatures = useMemo(() => {
    return COMPREHENSIVE_FEATURES.filter((feature) => {
      const categoryMatch = featureCategoryFilter === 'All' || feature.category === featureCategoryFilter;
      const maturityMatch = featureMaturityFilter === 'All' || feature.maturity === featureMaturityFilter;
      return categoryMatch && maturityMatch;
    });
  }, [featureCategoryFilter, featureMaturityFilter]);

  const comprehensiveInsights = useMemo(() => {
    const enabledCount = enabledComprehensiveFeatures.length;
    const avgImpact = COMPREHENSIVE_FEATURES.reduce((acc, feature) => acc + feature.impact, 0) / COMPREHENSIVE_FEATURES.length;
    const productionReady = COMPREHENSIVE_FEATURES.filter((feature) => feature.maturity !== 'Pilot').length;
    return { enabledCount, avgImpact, productionReady };
  }, [enabledComprehensiveFeatures]);

  const toggleComprehensiveFeature = (featureId: string) => {
    setEnabledComprehensiveFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const exportComprehensiveRoadmap = () => {
    const selectedFeatures = COMPREHENSIVE_FEATURES.filter((feature) => enabledComprehensiveFeatures.includes(feature.id));
    const payload = {
      generatedAt: new Date().toISOString(),
      totalSelected: selectedFeatures.length,
      selectedFeatures: selectedFeatures.map((feature) => ({
        name: feature.name,
        category: feature.category,
        maturity: feature.maturity,
        impact: feature.impact,
        integration: feature.integration
      }))
    };
    console.log('Comprehensive roadmap', payload);
    showNotificationMsg('Comprehensive roadmap generated. Check console output.');
  };

  // Code content previews
  const codePreviews = useMemo(() => ({
    preprocessing: `"""ECG Signal Preprocessing Module
Author: Lettu Kes dr. Muhammad Sobri Maulana, S.Kom, CEH, OSCP, OSCE
"""

import numpy as np
from scipy import signal
from scipy.signal import butter, filtfilt, iirnotch, resample
from typing import Tuple, Optional, List
import pywt

class ECGPreprocessor:
    def __init__(self, sampling_rate: int = 500, target_length: int = 5000):
        self.sampling_rate = sampling_rate
        self.target_length = target_length
        self.filter_order = 4
        
    def bandpass_filter(self, signal_data: np.ndarray, 
                       lowcut: float = 0.5, 
                       highcut: float = 45.0) -> np.ndarray:
        nyquist = 0.5 * self.sampling_rate
        low = lowcut / nyquist
        high = highcut / nyquist
        b, a = butter(self.filter_order, [low, high], btype='band')
        return filtfilt(b, a, signal_data)
    
    def remove_powerline_noise(self, signal_data: np.ndarray, 
                               freq: float = 50.0) -> np.ndarray:
        b, a = iirnotch(freq / (0.5 * self.sampling_rate), 30)
        return filtfilt(b, a, signal_data)
    
    def wavelet_denoising(self, signal_data: np.ndarray, 
                          wavelet: str = 'db4',
                          level: int = 4) -> np.ndarray:
        coeffs = pywt.wavedec(signal_data, wavelet, level=level)
        sigma = np.median(np.abs(coeffs[-1])) / 0.6745
        threshold = sigma * np.sqrt(2 * np.log(len(signal_data)))
        coeffs = [pywt.threshold(c, threshold, mode='soft') for c in coeffs]
        return pywt.waverec(coeffs, wavelet)[:len(signal_data)]
    
    def normalize(self, signal_data: np.ndarray, 
                  method: str = 'zscore') -> np.ndarray:
        if method == 'zscore':
            return (signal_data - np.mean(signal_data)) / (np.std(signal_data) + 1e-8)
        elif method == 'minmax':
            return (signal_data - np.min(signal_data)) / (np.max(signal_data) - np.min(signal_data) + 1e-8)
        return signal_data
    
    def preprocess(self, ecg_signal: np.ndarray) -> np.ndarray:
        ecg = self.bandpass_filter(ecg_signal)
        ecg = self.remove_powerline_noise(ecg)
        ecg = self.wavelet_denoising(ecg)
        ecg = self.normalize(ecg)
        return resample(ecg, self.target_length)`,

    model: `import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision.models import resnet50

class ECGResNet(nn.Module):
    def __init__(self, num_classes: int = 2, in_channels: int = 12):
        super(ECGResNet, self).__init__()
        self.conv1 = nn.Conv1d(in_channels, 64, kernel_size=7, stride=2, padding=3)
        self.bn1 = nn.BatchNorm1d(64)
        self.relu = nn.ReLU(inplace=True)
        self.maxpool = nn.MaxPool1d(kernel_size=3, stride=2, padding=1)
        
        self.layer1 = self._make_layer(64, 64, 3)
        self.layer2 = self._make_layer(64, 128, 4, stride=2)
        self.layer3 = self._make_layer(128, 256, 6, stride=2)
        self.layer4 = self._make_layer(256, 512, 3, stride=2)
        
        self.avgpool = nn.AdaptiveAvgPool1d(1)
        self.fc = nn.Linear(512, num_classes)
        self.dropout = nn.Dropout(0.5)
        
    def _make_layer(self, in_channels, out_channels, blocks, stride=1):
        layers = []
        layers.append(ResBlock(in_channels, out_channels, stride))
        for _ in range(1, blocks):
            layers.append(ResBlock(out_channels, out_channels))
        return nn.Sequential(*layers)
    
    def forward(self, x):
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.maxpool(x)
        
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)
        
        x = self.avgpool(x)
        x = x.flatten(1)
        x = self.dropout(x)
        x = self.fc(x)
        return x

class ResBlock(nn.Module):
    def __init__(self, in_ch, out_ch, stride=1):
        super().__init__()
        self.conv1 = nn.Conv1d(in_ch, out_ch, 3, stride, 1, bias=False)
        self.bn1 = nn.BatchNorm1d(out_ch)
        self.conv2 = nn.Conv1d(out_ch, out_ch, 3, 1, 1, bias=False)
        self.bn2 = nn.BatchNorm1d(out_ch)
        self.shortcut = nn.Sequential()
        if stride != 1 or in_ch != out_ch:
            self.shortcut = nn.Sequential(
                nn.Conv1d(in_ch, out_ch, 1, stride, bias=False),
                nn.BatchNorm1d(out_ch)
            )
    
    def forward(self, x):
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += self.shortcut(x)
        return F.relu(out)`,

    config: `# ECG LVSD Detection Configuration
model:
  architecture: "ResNet-ECG-50"
  input_channels: 12
  sequence_length: 5000
  num_classes: 2
  dropout: 0.5
  
training:
  batch_size: 32
  epochs: 100
  learning_rate: 0.001
  weight_decay: 0.0001
  scheduler: "cosine"
  warmup_epochs: 10
  
data:
  train_split: 0.7
  val_split: 0.15
  test_split: 0.15
  sampling_rate: 500
  augmentation: true
  normalize: "zscore"
  
augmentation:
  gaussian_noise: 0.1
  time_warp: 0.15
  amplitude_scale: 0.2
  baseline_wander: 0.1
  
paths:
  data_dir: "./data"
  output_dir: "./outputs"
  checkpoint_dir: "./checkpoints"
  log_dir: "./logs"`,
  }), []);

  // Tab content components
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Patients</p>
              <p className="text-2xl font-bold">12,458</p>
            </div>
            <Users className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-xs mt-2 text-blue-100">+234 this week</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Model Accuracy</p>
              <p className="text-2xl font-bold">93.8%</p>
            </div>
            <Award className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-xs mt-2 text-green-100">+2.3% improvement</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg Inference</p>
              <p className="text-2xl font-bold">12ms</p>
            </div>
            <Zap className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-xs mt-2 text-purple-100">GPU accelerated</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">LVSD Detected</p>
              <p className="text-2xl font-bold">3,247</p>
            </div>
            <Activity className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-xs mt-2 text-orange-100">26.1% of total</p>
        </div>
      </div>

      {/* Project Structure with Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Project Structure</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredStructure.map((file, index) => {
            const IconComponent = file.icon;
            return (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition cursor-pointer">
                <IconComponent className={`w-5 h-5 ${file.color}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-gray-700 dark:text-gray-200 font-mono text-sm truncate block">{file.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{file.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderECGTab = () => (
    <div className="space-y-6">
      {/* Patient Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Patient Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PATIENT_CASES.map((patient) => (
            <button
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className={`p-4 rounded-lg border-2 transition text-left ${
                selectedPatient.id === patient.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800 dark:text-white">{patient.id}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  patient.riskScore > 70 ? 'bg-red-100 text-red-700' : 
                  patient.riskScore > 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  Risk: {patient.riskScore}%
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{patient.age} {patient.gender === 'M' ? '♂' : '♀'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{patient.diagnosis}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ECG Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Original ECG Signal</h3>
            <div className="flex items-center gap-2">
              <ActivitySquare className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Lead II</span>
            </div>
          </div>
          <ECGVisualizer data={selectedPatient.ecgPattern} title="500 Hz Sampling" />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Patient Details</h3>
            <Stethoscope className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">LVEF</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{selectedPatient.lvef}%</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Risk Score</p>
                <p className={`text-2xl font-bold ${
                  selectedPatient.riskScore > 70 ? 'text-red-600' : 
                  selectedPatient.riskScore > 40 ? 'text-yellow-600' : 'text-green-600'
                }`}>{selectedPatient.riskScore}%</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {selectedPatient.symptoms.map((symptom, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Prediction */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Real-time Prediction</h3>
          <button
            onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isRealTimeEnabled 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isRealTimeEnabled ? <Pause size={18} /> : <Play size={18} />}
            {isRealTimeEnabled ? 'Stop' : 'Start'}
          </button>
        </div>
        {predictionResult && (
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">Predicted LVEF</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{predictionResult.lvef}%</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">Confidence</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{(predictionResult.confidence * 100).toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderModelsTab = () => (
    <div className="space-y-6">
      {/* Model Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Model Performance Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Model</th>
                <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">Accuracy</th>
                <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">Precision</th>
                <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">Recall</th>
                <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">F1-Score</th>
                <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">Inference</th>
                <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {MODEL_CONFIGS.map((model) => (
                <tr key={model.name} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{model.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{model.architecture} • {model.params} params</p>
                    </div>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`font-semibold ${model.accuracy > 0.93 ? 'text-green-600' : 'text-blue-600'}`}>
                      {(model.accuracy * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">{(model.precision * 100).toFixed(1)}%</td>
                  <td className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">{(model.recall * 100).toFixed(1)}%</td>
                  <td className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">{(model.f1Score * 100).toFixed(1)}%</td>
                  <td className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">{model.inferenceTime}ms</td>
                  <td className="text-center py-3 px-4">
                    <button
                      onClick={() => setSelectedModel(model)}
                      className={`px-3 py-1 rounded text-sm transition ${
                        selectedModel.name === model.name
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                      }`}
                    >
                      {selectedModel.name === model.name ? 'Selected' : 'Select'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Model Architecture: {selectedModel.name}</h3>
        <ModelArchitectureDiagram config={selectedModel} />
      </div>

      {/* Feature Importance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Feature Importance Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureImportanceRadar features={ECG_FEATURES} />
          <div className="space-y-3">
            {ECG_FEATURES.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-32 text-sm text-gray-600 dark:text-gray-300 truncate">{feature.name}</div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${feature.importance * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-12 text-right">
                  {(feature.importance * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrainingTab = () => (
    <div className="space-y-6">
      {/* Training Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Training Control</h3>
          <button
            onClick={startTraining}
            disabled={isTraining}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            <Play size={18} />
            {isTraining ? 'Training...' : 'Start Training'}
          </button>
        </div>
        {isTraining && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Training Progress</span>
              <span>{trainingProgress}%</span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                style={{ width: `${trainingProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Training Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Loss Curves</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Training Loss</p>
              <MetricsChart data={trainingHistory} metric="loss" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Validation Loss</p>
              <MetricsChart data={trainingHistory} metric="valLoss" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Accuracy Metrics</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Training Accuracy</p>
              <MetricsChart data={trainingHistory} metric="accuracy" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Validation Accuracy</p>
              <MetricsChart data={trainingHistory} metric="valAccuracy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAugmentationTab = () => (
    <div className="space-y-6">
      {/* Augmentation Techniques */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Data Augmentation Techniques</h3>
        <div className="space-y-4">
          {augmentations.map((aug, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={aug.enabled}
                  onChange={(e) => {
                    const newAugmentations = [...augmentations];
                    newAugmentations[idx].enabled = e.target.checked;
                    setAugmentations(newAugmentations);
                  }}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{aug.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{aug.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">Intensity: {(aug.intensity * 100).toFixed(0)}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={aug.intensity * 100}
                  onChange={(e) => {
                    const newAugmentations = [...augmentations];
                    newAugmentations[idx].intensity = parseInt(e.target.value) / 100;
                    setAugmentations(newAugmentations);
                  }}
                  className="w-24"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Original Signal</h3>
          <ECGVisualizer data={generateECGData()} color="#3b82f6" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Augmented Signal</h3>
          <ECGVisualizer data={generateECGData().map(v => v + (Math.random() - 0.5) * 0.2)} color="#10b981" />
        </div>
      </div>
    </div>
  );

  const renderCodeTab = () => (
    <div className="space-y-6">
      {/* Code Preview Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Code Preview</h3>
        <div className="flex gap-2 mb-4">
          {Object.entries(codePreviews).map(([key]) => (
            <button
              key={key}
              onClick={() => setCodeEditorContent(codePreviews[key as keyof typeof codePreviews])}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition capitalize"
            >
              {key}.py
            </button>
          ))}
        </div>
        {codeEditorContent && (
          <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm font-mono">
            {codeEditorContent}
          </pre>
        )}
      </div>
    </div>
  );

  const renderComprehensiveTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">10 Fitur Baru - Comprehensive Intelligence Suite</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Pilih modul prioritas untuk roadmap implementasi klinis, operasional, dan compliance.</p>
          </div>
          <button
            onClick={exportComprehensiveRoadmap}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Generate Roadmap
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Enabled Modules</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{comprehensiveInsights.enabledCount}/10</p>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Average Impact Score</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{comprehensiveInsights.avgImpact.toFixed(1)}</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Production/Validated</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{comprehensiveInsights.productionReady}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <select
            value={featureCategoryFilter}
            onChange={(e) => setFeatureCategoryFilter(e.target.value as 'All' | ComprehensiveFeature['category'])}
            className="px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="All">All Categories</option>
            <option value="Clinical AI">Clinical AI</option>
            <option value="Operations">Operations</option>
            <option value="Compliance">Compliance</option>
            <option value="Integration">Integration</option>
          </select>
          <select
            value={featureMaturityFilter}
            onChange={(e) => setFeatureMaturityFilter(e.target.value as 'All' | ComprehensiveFeature['maturity'])}
            className="px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="All">All Maturity</option>
            <option value="Pilot">Pilot</option>
            <option value="Production">Production</option>
            <option value="Validated">Validated</option>
          </select>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredComprehensiveFeatures.map((feature) => {
            const isEnabled = enabledComprehensiveFeatures.includes(feature.id);
            return (
              <div key={feature.id} className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">{feature.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{feature.category} • {feature.maturity} • {feature.complexity}</p>
                  </div>
                  <button
                    onClick={() => toggleComprehensiveFeature(feature.id)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      isEnabled ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {isEnabled ? 'Enabled' : 'Enable'}
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{feature.description}</p>
                <div className="space-y-2 mb-3">
                  {feature.capabilities.map((capability) => (
                    <div key={capability} className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500" />
                      <span>{capability}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Integration: {feature.integration}</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Impact {feature.impact}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'ecg', label: 'ECG Analysis', icon: Heart },
    { id: 'models', label: 'Models', icon: Brain },
    { id: 'training', label: 'Training', icon: TrendingUp },
    { id: 'augmentation', label: 'Augmentation', icon: RefreshCw },
    { id: 'code', label: 'Code', icon: Code },
    { id: 'comprehensive', label: 'Comprehensive+', icon: Shield },
  ];

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <CheckCircle size={20} />
          {notificationMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  ECG LVSD Detection Project
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Advanced Deep Learning Platform for Left Ventricular Systolic Dysfunction Detection
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={generateZip}
                disabled={downloading}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Exporting...' : 'Export Project'}
              </button>
            </div>
          </div>

          {/* Author Info */}
          <div className="mt-4 pt-4 border-t dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">Lettu Kes dr. Muhammad Sobri Maulana, S.Kom, CEH, OSCP, OSCE</span>
              </div>
              <a href="mailto:muhammadsobrimaulana31@gmail.com" className="flex items-center gap-2 text-blue-600 hover:underline">
                <Globe className="w-4 h-4" />
                muhammadsobrimaulana31@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'ecg' && renderECGTab()}
          {activeTab === 'models' && renderModelsTab()}
          {activeTab === 'training' && renderTrainingTab()}
          {activeTab === 'augmentation' && renderAugmentationTab()}
          {activeTab === 'code' && renderCodeTab()}
          {activeTab === 'comprehensive' && renderComprehensiveTab()}
        </div>

        {/* Footer */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">🔗 Connect & Support</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <a href="https://github.com/sobri3195" target="_blank" rel="noopener noreferrer" 
               className="flex items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition">
              <Code className="w-4 h-4" />
              <span className="text-sm">GitHub</span>
            </a>
            <a href="https://lynk.id/muhsobrimaulana" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Donate</span>
            </a>
            <a href="https://www.youtube.com/@muhammadsobrimaulana6013" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition">
              <Play className="w-4 h-4" />
              <span className="text-sm">YouTube</span>
            </a>
            <a href="https://t.me/winlin_exploit" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition">
              <Send className="w-4 h-4" />
              <span className="text-sm">Telegram</span>
            </a>
            <a href="https://www.tiktok.com/@dr.sobri" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition">
              <Music className="w-4 h-4" />
              <span className="text-sm">TikTok</span>
            </a>
            <a href="https://chat.whatsapp.com/B8nwRZOBMo64GjTwdXV8Bl" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Missing icon imports
const Send = ({ size, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const Music = ({ size, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

const MessageCircle = ({ size, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export default ECGLVSDProjectGenerator;
