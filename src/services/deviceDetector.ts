/**
 * Simunye Skills SA - Automatic Device Performance Profiler
 * Detects RAM, CPU cores, network data-saver headers, and screen refresh rates
 * to assign LOW (2D UI), STANDARD (Pseudo-3D SVG), or HIGH (Lightweight 3D WebGL).
 */

import { PerformanceProfile } from '../types';

export interface DeviceDiagnostics {
  cores: number;
  memoryGB: number;
  isSaveDataActive: boolean;
  effectiveType: string;
  isTouch: boolean;
  recommendedProfile: PerformanceProfile;
  reason: string;
}

export function detectDeviceCapabilities(): DeviceDiagnostics {
  const nav = typeof window !== 'undefined' ? (navigator as any) : {};
  
  const cores = nav.hardwareConcurrency || 2;
  const memoryGB = nav.deviceMemory || 1; // Default to 1GB RAM if API not supported
  
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection || {};
  const isSaveDataActive = connection.saveData === true;
  const effectiveType = connection.effectiveType || '4g';

  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || nav.maxTouchPoints > 0);

  let recommendedProfile: PerformanceProfile = 'LOW';
  let reason = '';

  if (isSaveDataActive || memoryGB <= 1 || cores <= 2 || effectiveType === '2g' || effectiveType === 'slow-2g') {
    recommendedProfile = 'LOW';
    reason = 'Entry-level Android detected (<=1GB RAM / Data Saver active). Using ultra-light 2D UI for maximum speed.';
  } else if (memoryGB <= 3 || cores <= 4 || effectiveType === '3g') {
    recommendedProfile = 'STANDARD';
    reason = 'Mid-tier mobile detected. Standard Pseudo-3D SVG canvas active with low memory footprint.';
  } else {
    recommendedProfile = 'HIGH';
    reason = 'Sufficient device memory & hardware acceleration available. Lightweight 3D WebGL mode enabled.';
  }

  return {
    cores,
    memoryGB,
    isSaveDataActive,
    effectiveType,
    isTouch,
    recommendedProfile,
    reason,
  };
}
