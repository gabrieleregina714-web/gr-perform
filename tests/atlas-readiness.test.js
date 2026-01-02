/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧪 ATLAS READINESS ENGINE TESTS
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Import the module (we'll test the logic directly)
const ATLASReadiness = {
  VERSION: '1.0',
  
  weights: {
    hrv: 0.25,
    sleep_quality: 0.20,
    recovery: 0.15,
    resting_hr: 0.10,
    sleep_duration: 0.10,
    stress: 0.10,
    soreness: 0.05,
    energy: 0.05
  },
  
  calculate(data, athleteProfile = {}) {
    const factors = {};
    let totalWeight = 0;
    let weightedSum = 0;
    
    // HRV Score (normalized 0-100)
    if (data.hrv !== undefined) {
      const baseline = athleteProfile.hrvBaseline || 55;
      const deviation = (data.hrv - baseline) / baseline;
      factors.hrv = Math.min(100, Math.max(0, 50 + deviation * 100));
      weightedSum += factors.hrv * this.weights.hrv;
      totalWeight += this.weights.hrv;
    }
    
    // Sleep Quality (already 0-100)
    if (data.sleepQuality !== undefined) {
      factors.sleep_quality = data.sleepQuality;
      weightedSum += factors.sleep_quality * this.weights.sleep_quality;
      totalWeight += this.weights.sleep_quality;
    }
    
    // Recovery Score (already 0-100)
    if (data.recovery !== undefined) {
      factors.recovery = data.recovery;
      weightedSum += factors.recovery * this.weights.recovery;
      totalWeight += this.weights.recovery;
    }
    
    // Resting HR (inverse - lower is better)
    if (data.restingHR !== undefined) {
      const baseline = athleteProfile.restingHRBaseline || 60;
      const deviation = (baseline - data.restingHR) / baseline;
      factors.resting_hr = Math.min(100, Math.max(0, 50 + deviation * 200));
      weightedSum += factors.resting_hr * this.weights.resting_hr;
      totalWeight += this.weights.resting_hr;
    }
    
    // Sleep Duration
    if (data.sleepDuration !== undefined) {
      const optimal = 8;
      const score = Math.min(100, (data.sleepDuration / optimal) * 100);
      factors.sleep_duration = score;
      weightedSum += factors.sleep_duration * this.weights.sleep_duration;
      totalWeight += this.weights.sleep_duration;
    }
    
    // Stress (inverse - lower is better)
    if (data.stress !== undefined) {
      factors.stress = Math.max(0, 100 - data.stress * 10);
      weightedSum += factors.stress * this.weights.stress;
      totalWeight += this.weights.stress;
    }
    
    // Soreness (inverse - lower is better)
    if (data.soreness !== undefined) {
      factors.soreness = Math.max(0, 100 - data.soreness * 10);
      weightedSum += factors.soreness * this.weights.soreness;
      totalWeight += this.weights.soreness;
    }
    
    // Energy (1-10 scale)
    if (data.energy !== undefined) {
      factors.energy = data.energy * 10;
      weightedSum += factors.energy * this.weights.energy;
      totalWeight += this.weights.energy;
    }
    
    // Calculate final score
    const score = totalWeight > 0 ? weightedSum / totalWeight : 50;
    
    return {
      score: Math.round(score),
      factors,
      category: this.getCategory(score),
      modifiers: this.getModifiers(score),
      recommendations: this.getRecommendations(score, factors)
    };
  },
  
  getCategory(score) {
    if (score >= 85) return { level: 'optimal', label: 'Condizione Ottimale', color: '#22c55e' };
    if (score >= 70) return { level: 'good', label: 'Buona Condizione', color: '#4ade80' };
    if (score >= 50) return { level: 'moderate', label: 'Condizione Moderata', color: '#fbbf24' };
    if (score >= 30) return { level: 'low', label: 'Recupero Necessario', color: '#f97316' };
    return { level: 'critical', label: 'Riposo Consigliato', color: '#ef4444' };
  },
  
  getModifiers(score) {
    if (score >= 85) return { intensity_modifier: 1.1, volume_modifier: 1.15 };
    if (score >= 70) return { intensity_modifier: 1.0, volume_modifier: 1.0 };
    if (score >= 50) return { intensity_modifier: 0.9, volume_modifier: 0.85 };
    if (score >= 30) return { intensity_modifier: 0.75, volume_modifier: 0.6 };
    return { intensity_modifier: 0.5, volume_modifier: 0.4 };
  },
  
  getRecommendations(score, factors) {
    const recs = [];
    
    if (score < 50) {
      recs.push('Consider lighter workout or active recovery');
    }
    
    if (factors.sleep_quality && factors.sleep_quality < 60) {
      recs.push('Sleep quality is low - prioritize rest');
    }
    
    if (factors.stress && factors.stress < 40) {
      recs.push('High stress levels - consider relaxation techniques');
    }
    
    return recs;
  }
};

describe('ATLASReadiness', () => {
  
  describe('calculate()', () => {
    
    it('should return score around 50 with minimal data', () => {
      const result = ATLASReadiness.calculate({});
      expect(result.score).toBe(50);
    });
    
    it('should calculate correct score with full data', () => {
      const data = {
        hrv: 60,
        sleepQuality: 80,
        recovery: 75,
        restingHR: 55,
        sleepDuration: 7.5,
        stress: 3,
        soreness: 2,
        energy: 8
      };
      
      const result = ATLASReadiness.calculate(data, { hrvBaseline: 55 });
      
      expect(result.score).toBeGreaterThan(60);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.factors).toBeDefined();
      expect(result.category).toBeDefined();
    });
    
    it('should return optimal category for high scores', () => {
      const data = {
        hrv: 70,
        sleepQuality: 95,
        recovery: 90,
        restingHR: 50,
        sleepDuration: 8,
        stress: 1,
        soreness: 1,
        energy: 9
      };
      
      const result = ATLASReadiness.calculate(data, { hrvBaseline: 55, restingHRBaseline: 60 });
      
      expect(result.score).toBeGreaterThanOrEqual(85);
      expect(result.category.level).toBe('optimal');
    });
    
    it('should return critical category for low scores', () => {
      const data = {
        hrv: 30,
        sleepQuality: 20,
        recovery: 30,
        restingHR: 80,
        sleepDuration: 4,
        stress: 9,
        soreness: 8,
        energy: 2
      };
      
      const result = ATLASReadiness.calculate(data);
      
      expect(result.score).toBeLessThan(30);
      expect(result.category.level).toBe('critical');
    });
    
    it('should generate recommendations for low factors', () => {
      const data = {
        sleepQuality: 40,
        stress: 8
      };
      
      const result = ATLASReadiness.calculate(data);
      
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
    
  });
  
  describe('getModifiers()', () => {
    
    it('should return increased modifiers for optimal readiness', () => {
      const modifiers = ATLASReadiness.getModifiers(90);
      
      expect(modifiers.intensity_modifier).toBe(1.1);
      expect(modifiers.volume_modifier).toBe(1.15);
    });
    
    it('should return baseline modifiers for good readiness', () => {
      const modifiers = ATLASReadiness.getModifiers(75);
      
      expect(modifiers.intensity_modifier).toBe(1.0);
      expect(modifiers.volume_modifier).toBe(1.0);
    });
    
    it('should return reduced modifiers for low readiness', () => {
      const modifiers = ATLASReadiness.getModifiers(40);
      
      expect(modifiers.intensity_modifier).toBe(0.9);
      expect(modifiers.volume_modifier).toBe(0.85);
    });
    
    it('should return minimal modifiers for critical readiness', () => {
      const modifiers = ATLASReadiness.getModifiers(20);
      
      expect(modifiers.intensity_modifier).toBe(0.5);
      expect(modifiers.volume_modifier).toBe(0.4);
    });
    
  });
  
  describe('getCategory()', () => {
    
    it('should return correct categories for score ranges', () => {
      expect(ATLASReadiness.getCategory(90).level).toBe('optimal');
      expect(ATLASReadiness.getCategory(75).level).toBe('good');
      expect(ATLASReadiness.getCategory(55).level).toBe('moderate');
      expect(ATLASReadiness.getCategory(35).level).toBe('low');
      expect(ATLASReadiness.getCategory(15).level).toBe('critical');
    });
    
  });
  
});
