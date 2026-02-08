"""
ECG Data Augmentation Techniques
Author: Lettu Kes dr. Muhammad Sobri Maulana, S.Kom, CEH, OSCP, OSCE

Module untuk augmentasi data EKG dengan berbagai teknik:
- Time-domain augmentations
- Frequency-domain augmentations
- Noise injection
- Morphological transformations
"""

import numpy as np
from scipy import signal
from scipy.interpolate import interp1d
from typing import List, Callable, Optional, Tuple
import random


class ECGAugmenter:
    """
    ECG Data Augmenter dengan multiple augmentation strategies.
    
    Augmentation Categories:
        1. Noise Injection: Gaussian, powerline, baseline wander
        2. Time Domain: Time warping, time masking
        3. Amplitude: Scaling, magnitude warping
        4. Morphological: Cropping, padding
    """
    
    def __init__(self, sampling_rate: int = 500, seed: Optional[int] = None):
        """
        Initialize augmenter.
        
        Args:
            sampling_rate: Sampling rate dalam Hz
            seed: Random seed untuk reproducibility
        """
        self.sampling_rate = sampling_rate
        self.rng = np.random.RandomState(seed)
    
    def add_gaussian_noise(self, signal_data: np.ndarray, snr_db: float = 20) -> np.ndarray:
        """
        Add Gaussian noise dengan specified SNR.
        
        Args:
            signal_data: Input ECG signal
            snr_db: Signal-to-noise ratio dalam dB
            
        Returns:
            Noisy signal
        """
        signal_power = np.mean(signal_data ** 2)
        noise_power = signal_power / (10 ** (snr_db / 10))
        noise = self.rng.randn(len(signal_data)) * np.sqrt(noise_power)
        return signal_data + noise
    
    def add_powerline_noise(self, signal_data: np.ndarray, 
                           freq: float = 50.0, 
                           amplitude: float = 0.1) -> np.ndarray:
        """
        Add powerline interference (50/60 Hz).
        
        Args:
            signal_data: Input signal
            freq: Powerline frequency (50 atau 60 Hz)
            amplitude: Noise amplitude relative ke signal max
            
        Returns:
            Signal dengan powerline noise
        """
        t = np.arange(len(signal_data)) / self.sampling_rate
        noise = amplitude * np.max(np.abs(signal_data)) * np.sin(2 * np.pi * freq * t)
        phase = self.rng.uniform(0, 2 * np.pi)
        return signal_data + noise * np.sin(phase)
    
    def add_baseline_wander(self, signal_data: np.ndarray,
                           freq_range: Tuple[float, float] = (0.1, 0.5),
                           amplitude: float = 0.05) -> np.ndarray:
        """
        Add baseline wander artifact (simulasi pernapasan).
        
        Args:
            signal_data: Input signal
            freq_range: Range frekuensi pernapasan
            amplitude: Amplitudo wander sebagai ratio dari signal max
            
        Returns:
            Signal dengan baseline wander
        """
        t = np.arange(len(signal_data)) / self.sampling_rate
        freq = self.rng.uniform(*freq_range)
        phase = self.rng.uniform(0, 2 * np.pi)
        wander = amplitude * np.max(np.abs(signal_data)) * np.sin(2 * np.pi * freq * t + phase)
        return signal_data + wander
    
    def time_warp(self, signal_data: np.ndarray, sigma: float = 0.2) -> np.ndarray:
        """
        Apply time warping menggunakan smooth random distortion.
        
        Berdasarkan paper: "Time Warping Invariant Echo State Networks"
        
        Args:
            signal_data: Input signal
            sigma: Warping intensity
            
        Returns:
            Time-warped signal
        """
        n = len(signal_data)
        
        # Generate random knots
        num_knots = max(3, int(n / self.sampling_rate))
        knot_points = np.linspace(0, n - 1, num=num_knots)
        knot_values = knot_points + self.rng.randn(num_knots) * sigma * n / num_knots
        knot_values = np.clip(knot_values, 0, n - 1)
        
        # Create interpolation function
        f = interp1d(knot_points, knot_values, kind='cubic', fill_value='extrapolate')
        
        # Apply warping
        warped_indices = f(np.arange(n))
        warped_indices = np.clip(warped_indices, 0, n - 1)
        
        return np.interp(np.arange(n), warped_indices, signal_data)
    
    def magnitude_warp(self, signal_data: np.ndarray, sigma: float = 0.2) -> np.ndarray:
        """
        Apply magnitude warping dengan smooth random scaling.
        
        Args:
            signal_data: Input signal
            sigma: Warping intensity
            
        Returns:
            Magnitude-warped signal
        """
        n = len(signal_data)
        num_knots = max(3, int(n / self.sampling_rate))
        knot_points = np.linspace(0, n - 1, num=num_knots)
        knot_values = 1 + self.rng.randn(num_knots) * sigma
        
        f = interp1d(knot_points, knot_values, kind='cubic', fill_value='extrapolate')
        scaling_factors = f(np.arange(n))
        
        return signal_data * scaling_factors
    
    def amplitude_scale(self, signal_data: np.ndarray, 
                       scale_range: Tuple[float, float] = (0.8, 1.2)) -> np.ndarray:
        """
        Random amplitude scaling.
        
        Args:
            signal_data: Input signal
            scale_range: Range scaling factor
            
        Returns:
            Scaled signal
        """
        scale = self.rng.uniform(*scale_range)
        return signal_data * scale
    
    def time_shift(self, signal_data: np.ndarray, 
                   max_shift: Optional[int] = None) -> np.ndarray:
        """
        Circular time shift.
        
        Args:
            signal_data: Input signal
            max_shift: Maximum shift dalam samples
            
        Returns:
            Time-shifted signal
        """
        if max_shift is None:
            max_shift = len(signal_data) // 10
        
        shift = self.rng.randint(-max_shift, max_shift)
        return np.roll(signal_data, shift)
    
    def time_mask(self, signal_data: np.ndarray,
                  max_mask_ratio: float = 0.1) -> np.ndarray:
        """
        Random time masking (zero out random segments).
        
        Args:
            signal_data: Input signal
            max_mask_ratio: Maximum ratio dari signal length yang di-mask
            
        Returns:
            Masked signal
        """
        n = len(signal_data)
        mask_length = int(n * max_mask_ratio * self.rng.uniform(0.5, 1.0))
        mask_start = self.rng.randint(0, n - mask_length)
        
        masked = signal_data.copy()
        masked[mask_start:mask_start + mask_length] = 0
        
        return masked
    
    def frequency_shift(self, signal_data: np.ndarray,
                       max_shift_hz: float = 2.0) -> np.ndarray:
        """
        Frequency shifting menggunakan Hilbert transform.
        
        Args:
            signal_data: Input signal
            max_shift_hz: Maximum frequency shift dalam Hz
            
        Returns:
            Frequency-shifted signal
        """
        from scipy.signal import hilbert
        
        analytic = hilbert(signal_data)
        instantaneous_phase = np.unwrap(np.angle(analytic))
        
        shift = self.rng.uniform(-max_shift_hz, max_shift_hz)
        t = np.arange(len(signal_data)) / self.sampling_rate
        phase_shift = 2 * np.pi * shift * t
        
        shifted_analytic = np.abs(analytic) * np.exp(1j * (instantaneous_phase + phase_shift))
        return np.real(shifted_analytic)
    
    def random_crop(self, signal_data: np.ndarray,
                   crop_ratio: float = 0.9) -> np.ndarray:
        """
        Random cropping dengan padding untuk maintain length.
        
        Args:
            signal_data: Input signal
            crop_ratio: Ratio dari length yang di-keep
            
        Returns:
            Cropped dan padded signal
        """
        n = len(signal_data)
        crop_length = int(n * crop_ratio)
        start = self.rng.randint(0, n - crop_length)
        
        cropped = signal_data[start:start + crop_length]
        
        # Pad ke original length
        pad_left = (n - crop_length) // 2
        pad_right = n - crop_length - pad_left
        
        return np.pad(cropped, (pad_left, pad_right), mode='edge')
    
    def compose(self, signal_data: np.ndarray, 
                augmentations: List[Tuple[Callable, dict]]) -> np.ndarray:
        """
        Compose multiple augmentations.
        
        Args:
            signal_data: Input signal
            augmentations: List of (augmentation_function, kwargs) tuples
            
        Returns:
            Augmented signal
        """
        result = signal_data.copy()
        for aug_func, kwargs in augmentations:
            if self.rng.rand() > 0.5:  # 50% chance apply setiap augmentation
                result = aug_func(result, **kwargs)
        return result
    
    def get_default_pipeline(self) -> List[Tuple[Callable, dict]]:
        """
        Get default augmentation pipeline.
        
        Returns:
            List of (function, kwargs) tuples
        """
        return [
            (self.add_gaussian_noise, {'snr_db': 25}),
            (self.time_warp, {'sigma': 0.1}),
            (self.amplitude_scale, {'scale_range': (0.9, 1.1)}),
            (self.time_shift, {}),
        ]


class AugmentationPipeline:
    """
    High-level augmentation pipeline dengan batch processing.
    """
    
    def __init__(self, augmenter: ECGAugmenter, 
                 augmentation_factor: int = 2):
        """
        Initialize pipeline.
        
        Args:
            augmenter: ECGAugmenter instance
            augmentation_factor: Berapa kali lipat augmentasi (2 = 2x data)
        """
        self.augmenter = augmenter
        self.augmentation_factor = augmentation_factor
    
    def augment_dataset(self, signals: List[np.ndarray], 
                       labels: List[int]) -> Tuple[List[np.ndarray], List[int]]:
        """
        Augment entire dataset.
        
        Args:
            signals: List of ECG signals
            labels: List of labels
            
        Returns:
            Tuple of (augmented_signals, augmented_labels)
        """
        augmented_signals = []
        augmented_labels = []
        
        pipeline = self.augmenter.get_default_pipeline()
        
        for signal, label in zip(signals, labels):
            # Original data
            augmented_signals.append(signal)
            augmented_labels.append(label)
            
            # Augmented versions
            for _ in range(self.augmentation_factor - 1):
                aug_signal = self.augmenter.compose(signal, pipeline)
                augmented_signals.append(aug_signal)
                augmented_labels.append(label)
        
        return augmented_signals, augmented_labels


# Example usage
if __name__ == "__main__":
    # Initialize
    augmenter = ECGAugmenter(sampling_rate=500, seed=42)
    
    # Generate sample ECG-like signal
    t = np.linspace(0, 10, 5000)
    sample_ecg = np.sin(2 * np.pi * 1.2 * t)  # Heart rate ~72 bpm
    sample_ecg += 0.3 * np.sin(2 * np.pi * 5 * t)  # Higher frequency component
    
    # Apply individual augmentations
    noisy = augmenter.add_gaussian_noise(sample_ecg, snr_db=20)
    warped = augmenter.time_warp(sample_ecg, sigma=0.15)
    scaled = augmenter.amplitude_scale(sample_ecg, scale_range=(0.8, 1.2))
    
    print(f"Original shape: {sample_ecg.shape}")
    print(f"Augmented shapes: {noisy.shape}, {warped.shape}, {scaled.shape}")
    
    # Apply pipeline
    pipeline = augmenter.get_default_pipeline()
    composed = augmenter.compose(sample_ecg, pipeline)
    print(f"Composed augmentation result: {composed.shape}")
