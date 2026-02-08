"""
ECG Signal Preprocessing Pipeline
Author: Lettu Kes dr. Muhammad Sobri Maulana, S.Kom, CEH, OSCP, OSCE
Email: muhammadsobrimaulana31@gmail.com

Module untuk preprocessing sinyal EKG dengan berbagai teknik:
- Filtering (Bandpass, Notch)
- Denoising (Wavelet, Savitzky-Golay)
- Normalization (Z-score, MinMax)
- Segmentation
"""

import numpy as np
from scipy import signal
from scipy.signal import butter, filtfilt, iirnotch, resample, savgol_filter
from typing import Tuple, Optional, List, Union
import pywt
from dataclasses import dataclass
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class PreprocessingConfig:
    """Konfigurasi untuk preprocessing pipeline."""
    sampling_rate: int = 500
    target_length: int = 5000
    lowcut: float = 0.5
    highcut: float = 45.0
    filter_order: int = 4
    wavelet: str = 'db4'
    wavelet_level: int = 4
    notch_freq: float = 50.0
    notch_quality: float = 30.0
    normalization: str = 'zscore'


class ECGPreprocessor:
    """
    Advanced ECG Signal Preprocessor dengan multiple denoising techniques.
    
    Features:
        - Bandpass filtering (0.5-45 Hz)
        - Powerline noise removal (50/60 Hz notch filter)
        - Wavelet denoising menggunakan Discrete Wavelet Transform
        - Savitzky-Golay smoothing
        - Multiple normalization methods
        - Signal quality assessment
    """
    
    def __init__(self, config: Optional[PreprocessingConfig] = None):
        """
        Initialize preprocessor dengan configuration.
        
        Args:
            config: PreprocessingConfig object atau None untuk default
        """
        self.config = config or PreprocessingConfig()
        self._validate_config()
        logger.info(f"Initialized ECGPreprocessor dengan config: {self.config}")
    
    def _validate_config(self):
        """Validasi konfigurasi preprocessing."""
        assert self.config.sampling_rate > 0, "Sampling rate harus positif"
        assert self.config.target_length > 0, "Target length harus positif"
        assert 0 < self.config.lowcut < self.config.highcut, "Invalid filter cutoff frequencies"
        assert self.config.filter_order > 0, "Filter order harus positif"
    
    def bandpass_filter(self, signal_data: np.ndarray) -> np.ndarray:
        """
        Apply Butterworth bandpass filter.
        
        Args:
            signal_data: Input signal (1D array)
            
        Returns:
            Filtered signal
        """
        nyquist = 0.5 * self.config.sampling_rate
        low = self.config.lowcut / nyquist
        high = self.config.highcut / nyquist
        
        b, a = butter(self.config.filter_order, [low, high], btype='band')
        filtered = filtfilt(b, a, signal_data)
        
        logger.debug(f"Applied bandpass filter: {self.config.lowcut}-{self.config.highcut} Hz")
        return filtered
    
    def remove_powerline_noise(self, signal_data: np.ndarray) -> np.ndarray:
        """
        Remove powerline interference menggunakan notch filter.
        
        Args:
            signal_data: Input signal
            
        Returns:
            Signal dengan powerline noise removed
        """
        b, a = iirnotch(
            self.config.notch_freq / (0.5 * self.config.sampling_rate),
            self.config.notch_quality
        )
        filtered = filtfilt(b, a, signal_data)
        
        logger.debug(f"Removed {self.config.notch_freq} Hz powerline noise")
        return filtered
    
    def wavelet_denoising(self, signal_data: np.ndarray) -> np.ndarray:
        """
        Apply wavelet denoising dengan universal threshold.
        
        Menggunakan Donoho-Johnstone universal threshold:
        threshold = sigma * sqrt(2 * log(N))
        
        Args:
            signal_data: Input signal
            
        Returns:
            Denoised signal
        """
        coeffs = pywt.wavedec(
            signal_data, 
            self.config.wavelet, 
            level=self.config.wavelet_level
        )
        
        # Estimate noise standard deviation dari detail coefficients terakhir
        sigma = np.median(np.abs(coeffs[-1])) / 0.6745
        threshold = sigma * np.sqrt(2 * np.log(len(signal_data)))
        
        # Soft thresholding pada detail coefficients
        denoised_coeffs = [coeffs[0]]  # Approximation coefficients (tidak di-threshold)
        for detail_coeff in coeffs[1:]:
            denoised_coeffs.append(
                pywt.threshold(detail_coeff, threshold, mode='soft')
            )
        
        # Reconstruct signal
        denoised = pywt.waverec(denoised_coeffs, self.config.wavelet)
        
        logger.debug(f"Applied {self.config.wavelet} wavelet denoising (level {self.config.wavelet_level})")
        return denoised[:len(signal_data)]
    
    def savgol_smooth(self, signal_data: np.ndarray, window: int = 51, polyorder: int = 3) -> np.ndarray:
        """
        Apply Savitzky-Golay filter untuk smoothing.
        
        Args:
            signal_data: Input signal
            window: Window length (harus ganjil)
            polyorder: Polynomial order
            
        Returns:
            Smoothed signal
        """
        if window % 2 == 0:
            window += 1
        
        smoothed = savgol_filter(signal_data, window, polyorder)
        logger.debug(f"Applied Savitzky-Golay filter (window={window}, order={polyorder})")
        return smoothed
    
    def normalize(self, signal_data: np.ndarray) -> np.ndarray:
        """
        Normalize signal menggunakan metode yang dikonfigurasi.
        
        Methods:
            - 'zscore': Zero mean, unit variance
            - 'minmax': Scale ke [0, 1]
            - 'robust': Robust scaling menggunakan median dan IQR
            
        Args:
            signal_data: Input signal
            
        Returns:
            Normalized signal
        """
        if self.config.normalization == 'zscore':
            mean = np.mean(signal_data)
            std = np.std(signal_data)
            normalized = (signal_data - mean) / (std + 1e-8)
            
        elif self.config.normalization == 'minmax':
            min_val = np.min(signal_data)
            max_val = np.max(signal_data)
            normalized = (signal_data - min_val) / (max_val - min_val + 1e-8)
            
        elif self.config.normalization == 'robust':
            median = np.median(signal_data)
            iqr = np.percentile(signal_data, 75) - np.percentile(signal_data, 25)
            normalized = (signal_data - median) / (iqr + 1e-8)
            
        else:
            raise ValueError(f"Unknown normalization: {self.config.normalization}")
        
        logger.debug(f"Applied {self.config.normalization} normalization")
        return normalized
    
    def resample_signal(self, signal_data: np.ndarray) -> np.ndarray:
        """
        Resample signal ke target length.
        
        Args:
            signal_data: Input signal
            
        Returns:
            Resampled signal
        """
        if len(signal_data) != self.config.target_length:
            resampled = resample(signal_data, self.config.target_length)
            logger.debug(f"Resampled signal dari {len(signal_data)} ke {self.config.target_length} samples")
            return resampled
        return signal_data
    
    def assess_quality(self, signal_data: np.ndarray) -> dict:
        """
        Assess signal quality metrics.
        
        Metrics:
            - SNR (Signal-to-Noise Ratio)
            - Baseline wander
            - High frequency noise
            - Signal power
            
        Args:
            signal_data: Input signal
            
        Returns:
            Dictionary dengan quality metrics
        """
        # Estimate SNR
        signal_power = np.var(signal_data)
        
        # High frequency noise estimate (above 40 Hz)
        nyquist = 0.5 * self.config.sampling_rate
        b, a = butter(4, 40 / nyquist, btype='high')
        high_freq = filtfilt(b, a, signal_data)
        noise_power = np.var(high_freq)
        
        snr_db = 10 * np.log10(signal_power / (noise_power + 1e-10))
        
        # Baseline wander estimate (below 0.5 Hz)
        b, a = butter(4, 0.5 / nyquist, btype='low')
        baseline = filtfilt(b, a, signal_data)
        baseline_wander = np.max(np.abs(baseline - np.mean(baseline)))
        
        quality_metrics = {
            'snr_db': snr_db,
            'signal_power': signal_power,
            'noise_power': noise_power,
            'baseline_wander': baseline_wander,
            'max_amplitude': np.max(np.abs(signal_data)),
            'quality_score': 'good' if snr_db > 20 else 'poor'
        }
        
        return quality_metrics
    
    def preprocess(self, ecg_signal: np.ndarray, assess_quality: bool = False) -> Union[np.ndarray, Tuple[np.ndarray, dict]]:
        """
        Complete preprocessing pipeline.
        
        Pipeline:
            1. Bandpass filter
            2. Powerline noise removal
            3. Wavelet denoising
            4. Normalization
            5. Resampling
            
        Args:
            ecg_signal: Raw ECG signal
            assess_quality: Jika True, return juga quality metrics
            
        Returns:
            Preprocessed signal atau tuple (signal, quality_metrics)
        """
        logger.info("Starting preprocessing pipeline...")
        
        # Step 1: Bandpass filter
        ecg = self.bandpass_filter(ecg_signal)
        
        # Step 2: Remove powerline noise
        ecg = self.remove_powerline_noise(ecg)
        
        # Step 3: Wavelet denoising
        ecg = self.wavelet_denoising(ecg)
        
        # Step 4: Normalization
        ecg = self.normalize(ecg)
        
        # Step 5: Resampling
        ecg = self.resample_signal(ecg)
        
        logger.info("Preprocessing pipeline completed")
        
        if assess_quality:
            quality = self.assess_quality(ecg)
            return ecg, quality
        
        return ecg
    
    def preprocess_batch(self, signals: List[np.ndarray], n_jobs: int = -1) -> List[np.ndarray]:
        """
        Preprocess batch of signals.
        
        Args:
            signals: List of ECG signals
            n_jobs: Number of parallel jobs (-1 untuk menggunakan semua cores)
            
        Returns:
            List of preprocessed signals
        """
        from multiprocessing import Pool, cpu_count
        
        if n_jobs == -1:
            n_jobs = cpu_count()
        
        logger.info(f"Preprocessing batch of {len(signals)} signals dengan {n_jobs} workers")
        
        with Pool(processes=n_jobs) as pool:
            results = pool.map(self.preprocess, signals)
        
        return results


# Example usage
if __name__ == "__main__":
    # Buat config custom
    config = PreprocessingConfig(
        sampling_rate=500,
        target_length=5000,
        wavelet='sym8',
        normalization='zscore'
    )
    
    # Initialize preprocessor
    preprocessor = ECGPreprocessor(config)
    
    # Generate sample signal
    t = np.linspace(0, 10, 5000)
    sample_ecg = np.sin(2 * np.pi * 1.2 * t) + 0.5 * np.sin(2 * np.pi * 5 * t)
    sample_ecg += 0.1 * np.random.randn(5000)  # Add noise
    
    # Preprocess
    processed, quality = preprocessor.preprocess(sample_ecg, assess_quality=True)
    
    print(f"Original shape: {sample_ecg.shape}")
    print(f"Processed shape: {processed.shape}")
    print(f"Quality metrics: {quality}")
