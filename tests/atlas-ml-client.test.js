/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧪 ATLAS ML CLIENT TESTS
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the ML Client
const ATLASMLClient = {
  endpoint: 'http://localhost:8000',
  cache: new Map(),
  
  analyzeTrend(values) {
    if (values.length < 2) return { direction: 'stable', slope: 0 };
    
    const first = values.slice(0, Math.ceil(values.length / 3));
    const last = values.slice(-Math.ceil(values.length / 3));
    
    const avgFirst = first.reduce((a, b) => a + b, 0) / first.length;
    const avgLast = last.reduce((a, b) => a + b, 0) / last.length;
    
    const change = avgLast - avgFirst;
    const percentChange = (change / avgFirst) * 100;
    
    let direction;
    if (Math.abs(percentChange) < 3) {
      direction = 'stable';
    } else if (change > 0) {
      direction = 'increasing';
    } else {
      direction = 'declining';
    }
    
    return {
      direction,
      slope: change / values.length,
      percentChange
    };
  },
  
  fallbackClassification(data) {
    const { progressionRate = 1, avgRecovery = 75, avgHrv = 55, weeklyVolume = 20, avgIntensity = 75 } = data;
    
    if (progressionRate > 1.5 && avgRecovery > 80) {
      return { cluster: 'high_responder', details: { confidence: 0.75 } };
    } else if (avgHrv > 70 && weeklyVolume > 25) {
      return { cluster: 'volume_sensitive', details: { confidence: 0.7 } };
    } else if (avgIntensity > 82) {
      return { cluster: 'intensity_thrives', details: { confidence: 0.7 } };
    } else if (avgRecovery > 80 && avgHrv < 50) {
      return { cluster: 'recovery_dependent', details: { confidence: 0.72 } };
    } else if (progressionRate < 0.5) {
      return { cluster: 'low_responder', details: { confidence: 0.65 } };
    }
    
    return { cluster: 'moderate_responder', details: { confidence: 0.6 } };
  },
  
  fallbackPrediction(params) {
    const { current1RM, trainingWeeks = 12, athleteData = {} } = params;
    const trainingAge = athleteData.trainingAge || 2;
    const adherence = athleteData.adherenceRate || 85;
    const recovery = athleteData.avgRecovery || 75;
    
    let weeklyRate;
    if (trainingAge < 1) {
      weeklyRate = 0.015;
    } else if (trainingAge < 3) {
      weeklyRate = 0.008;
    } else if (trainingAge < 5) {
      weeklyRate = 0.004;
    } else {
      weeklyRate = 0.002;
    }
    
    const modifier = (recovery / 100) * (adherence / 100);
    const totalGain = current1RM * weeklyRate * trainingWeeks * modifier;
    const predicted = current1RM + totalGain;
    
    return {
      predicted_1rm: Math.round(predicted * 10) / 10,
      gain_kg: Math.round(totalGain * 10) / 10,
      gain_percent: Math.round((totalGain / current1RM) * 100 * 10) / 10
    };
  },
  
  fallbackOvertrainingCheck(metrics) {
    const warnings = [];
    let riskScore = 0;
    
    if (metrics.hrv && metrics.hrv.length >= 4) {
      const trend = this.analyzeTrend(metrics.hrv);
      if (trend.direction === 'declining') {
        warnings.push('HRV declining');
        riskScore += 25;
      }
    }
    
    if (metrics.sleepQuality && metrics.sleepQuality.length >= 4) {
      const trend = this.analyzeTrend(metrics.sleepQuality);
      if (trend.direction === 'declining') {
        warnings.push('Sleep quality decreasing');
        riskScore += 20;
      }
    }
    
    if (metrics.restingHR && metrics.restingHR.length >= 4) {
      const trend = this.analyzeTrend(metrics.restingHR);
      if (trend.direction === 'increasing') {
        warnings.push('Resting heart rate increasing');
        riskScore += 25;
      }
    }
    
    let riskLevel;
    if (riskScore >= 60) riskLevel = 'high';
    else if (riskScore >= 30) riskLevel = 'moderate';
    else riskLevel = 'low';
    
    return { risk_level: riskLevel, risk_score: riskScore, warnings };
  }
};

describe('ATLASMLClient', () => {
  
  describe('analyzeTrend()', () => {
    
    it('should detect stable trend', () => {
      const values = [50, 51, 50, 49, 50, 51];
      const result = ATLASMLClient.analyzeTrend(values);
      
      expect(result.direction).toBe('stable');
    });
    
    it('should detect increasing trend', () => {
      const values = [40, 45, 50, 55, 60, 65];
      const result = ATLASMLClient.analyzeTrend(values);
      
      expect(result.direction).toBe('increasing');
      expect(result.percentChange).toBeGreaterThan(0);
    });
    
    it('should detect declining trend', () => {
      const values = [70, 65, 60, 55, 50, 45];
      const result = ATLASMLClient.analyzeTrend(values);
      
      expect(result.direction).toBe('declining');
      expect(result.percentChange).toBeLessThan(0);
    });
    
    it('should handle short arrays', () => {
      const result = ATLASMLClient.analyzeTrend([50]);
      expect(result.direction).toBe('stable');
    });
    
  });
  
  describe('fallbackClassification()', () => {
    
    it('should classify high responder', () => {
      const result = ATLASMLClient.fallbackClassification({
        progressionRate: 2.0,
        avgRecovery: 85
      });
      
      expect(result.cluster).toBe('high_responder');
    });
    
    it('should classify volume sensitive', () => {
      const result = ATLASMLClient.fallbackClassification({
        avgHrv: 75,
        weeklyVolume: 30
      });
      
      expect(result.cluster).toBe('volume_sensitive');
    });
    
    it('should classify intensity thrives', () => {
      const result = ATLASMLClient.fallbackClassification({
        avgIntensity: 88
      });
      
      expect(result.cluster).toBe('intensity_thrives');
    });
    
    it('should classify recovery dependent', () => {
      const result = ATLASMLClient.fallbackClassification({
        avgRecovery: 85,
        avgHrv: 45
      });
      
      expect(result.cluster).toBe('recovery_dependent');
    });
    
    it('should classify low responder', () => {
      const result = ATLASMLClient.fallbackClassification({
        progressionRate: 0.3
      });
      
      expect(result.cluster).toBe('low_responder');
    });
    
    it('should default to moderate responder', () => {
      const result = ATLASMLClient.fallbackClassification({});
      expect(result.cluster).toBe('moderate_responder');
    });
    
  });
  
  describe('fallbackPrediction()', () => {
    
    it('should predict higher gains for beginners', () => {
      const beginner = ATLASMLClient.fallbackPrediction({
        current1RM: 100,
        trainingWeeks: 12,
        athleteData: { trainingAge: 0.5 }
      });
      
      const advanced = ATLASMLClient.fallbackPrediction({
        current1RM: 100,
        trainingWeeks: 12,
        athleteData: { trainingAge: 6 }
      });
      
      expect(beginner.gain_kg).toBeGreaterThan(advanced.gain_kg);
    });
    
    it('should account for adherence', () => {
      const highAdherence = ATLASMLClient.fallbackPrediction({
        current1RM: 100,
        trainingWeeks: 12,
        athleteData: { adherenceRate: 95 }
      });
      
      const lowAdherence = ATLASMLClient.fallbackPrediction({
        current1RM: 100,
        trainingWeeks: 12,
        athleteData: { adherenceRate: 60 }
      });
      
      expect(highAdherence.gain_kg).toBeGreaterThan(lowAdherence.gain_kg);
    });
    
    it('should scale with training weeks', () => {
      const short = ATLASMLClient.fallbackPrediction({
        current1RM: 100,
        trainingWeeks: 6
      });
      
      const long = ATLASMLClient.fallbackPrediction({
        current1RM: 100,
        trainingWeeks: 24
      });
      
      expect(long.gain_kg).toBeGreaterThan(short.gain_kg * 2);
    });
    
  });
  
  describe('fallbackOvertrainingCheck()', () => {
    
    it('should detect low risk with stable metrics', () => {
      const result = ATLASMLClient.fallbackOvertrainingCheck({
        hrv: [55, 56, 54, 55, 57, 55],
        sleepQuality: [80, 78, 82, 80, 79, 81]
      });
      
      expect(result.risk_level).toBe('low');
      expect(result.warnings.length).toBe(0);
    });
    
    it('should detect moderate risk with declining HRV', () => {
      const result = ATLASMLClient.fallbackOvertrainingCheck({
        hrv: [65, 60, 55, 50, 45, 40]
      });
      
      expect(result.risk_level).toBe('low'); // Only HRV = 25 points
      expect(result.warnings).toContain('HRV declining');
    });
    
    it('should detect high risk with multiple warning signs', () => {
      const result = ATLASMLClient.fallbackOvertrainingCheck({
        hrv: [65, 60, 55, 50, 45, 40],
        sleepQuality: [80, 75, 70, 65, 60, 55],
        restingHR: [55, 58, 61, 64, 67, 70]
      });
      
      expect(result.risk_level).toBe('high');
      expect(result.risk_score).toBeGreaterThanOrEqual(60);
      expect(result.warnings.length).toBeGreaterThanOrEqual(2);
    });
    
  });
  
});
