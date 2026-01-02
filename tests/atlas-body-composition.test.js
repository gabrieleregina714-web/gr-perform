/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧪 ATLAS BODY COMPOSITION TESTS
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Import the formulas directly for testing
const formulas = {
  
  bmi(weightKg, heightCm) {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  },
  
  ffmi(weightKg, heightCm, bodyFatPercentage) {
    const fatMassKg = weightKg * (bodyFatPercentage / 100);
    const leanMassKg = weightKg - fatMassKg;
    const heightM = heightCm / 100;
    
    const ffmi = leanMassKg / (heightM * heightM);
    const adjustedFFMI = ffmi + 6.1 * (1.80 - heightM);
    
    return {
      ffmi: ffmi,
      adjustedFFMI: adjustedFFMI,
      interpretation: this.interpretFFMI(adjustedFFMI)
    };
  },
  
  interpretFFMI(ffmi) {
    if (ffmi < 18) return { level: 'below_average', label: 'Sotto la media' };
    if (ffmi < 20) return { level: 'average', label: 'Nella media' };
    if (ffmi < 22) return { level: 'above_average', label: 'Sopra la media' };
    if (ffmi < 23) return { level: 'excellent', label: 'Eccellente' };
    if (ffmi < 25) return { level: 'elite', label: 'Elite naturale' };
    return { level: 'suspect', label: 'Genetica eccezionale o uso PEDs' };
  },
  
  bodyFatNavy(waistCm, neckCm, heightCm, hipsCm = null, isMale = true) {
    if (isMale) {
      return 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
    } else {
      if (!hipsCm) throw new Error('Hips measurement required for females');
      return 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipsCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
    }
  },
  
  tdee(weightKg, heightCm, age, isMale = true, activityLevel = 1.55) {
    let bmr;
    if (isMale) {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
      athlete: 2.0
    };
    
    const multiplier = typeof activityLevel === 'string' 
      ? activityMultipliers[activityLevel] 
      : activityLevel;
    
    return {
      bmr: Math.round(bmr),
      tdee: Math.round(bmr * multiplier),
      activityMultiplier: multiplier
    };
  }
};

describe('Body Composition Formulas', () => {
  
  describe('BMI', () => {
    
    it('should calculate BMI correctly', () => {
      // 75kg, 180cm = 23.15 BMI
      const bmi = formulas.bmi(75, 180);
      expect(bmi).toBeCloseTo(23.15, 1);
    });
    
    it('should handle edge cases', () => {
      const bmi = formulas.bmi(100, 160);
      expect(bmi).toBeCloseTo(39.06, 1); // Obese
    });
    
  });
  
  describe('FFMI', () => {
    
    it('should calculate FFMI correctly for average male', () => {
      // 80kg, 180cm, 15% BF
      const result = formulas.ffmi(80, 180, 15);
      
      expect(result.ffmi).toBeCloseTo(20.99, 1);
      expect(result.adjustedFFMI).toBeDefined();
      expect(result.interpretation.level).toBe('above_average');
    });
    
    it('should calculate FFMI for lean athlete', () => {
      // 85kg, 175cm, 10% BF
      const result = formulas.ffmi(85, 175, 10);
      
      expect(result.ffmi).toBeGreaterThan(24);
      expect(result.interpretation.level).toBe('elite');
    });
    
    it('should adjust FFMI for shorter athletes', () => {
      // Short person should have higher adjusted FFMI
      const short = formulas.ffmi(70, 165, 12);
      const tall = formulas.ffmi(70, 185, 12);
      
      expect(short.adjustedFFMI).toBeGreaterThan(short.ffmi);
      expect(tall.adjustedFFMI).toBeLessThan(tall.ffmi);
    });
    
    it('should interpret FFMI correctly', () => {
      expect(formulas.interpretFFMI(17).level).toBe('below_average');
      expect(formulas.interpretFFMI(19).level).toBe('average');
      expect(formulas.interpretFFMI(21).level).toBe('above_average');
      expect(formulas.interpretFFMI(22.5).level).toBe('excellent');
      expect(formulas.interpretFFMI(24).level).toBe('elite');
      expect(formulas.interpretFFMI(26).level).toBe('suspect');
    });
    
  });
  
  describe('Navy Body Fat Formula', () => {
    
    it('should calculate body fat for males', () => {
      // Male: waist 85cm, neck 38cm, height 180cm
      const bf = formulas.bodyFatNavy(85, 38, 180);
      
      expect(bf).toBeGreaterThan(10);
      expect(bf).toBeLessThan(25);
    });
    
    it('should calculate body fat for females', () => {
      // Female: waist 75cm, neck 32cm, height 165cm, hips 95cm
      const bf = formulas.bodyFatNavy(75, 32, 165, 95, false);
      
      expect(bf).toBeGreaterThan(15);
      expect(bf).toBeLessThan(35);
    });
    
    it('should throw error for females without hips', () => {
      expect(() => formulas.bodyFatNavy(75, 32, 165, null, false))
        .toThrow('Hips measurement required');
    });
    
  });
  
  describe('TDEE Calculation', () => {
    
    it('should calculate BMR for male', () => {
      // 30yo male, 80kg, 180cm
      const result = formulas.tdee(80, 180, 30, true, 'moderate');
      
      expect(result.bmr).toBeGreaterThan(1700);
      expect(result.bmr).toBeLessThan(1900);
    });
    
    it('should calculate BMR for female', () => {
      // 25yo female, 60kg, 165cm
      const result = formulas.tdee(60, 165, 25, false, 'moderate');
      
      expect(result.bmr).toBeGreaterThan(1300);
      expect(result.bmr).toBeLessThan(1500);
    });
    
    it('should apply activity multipliers correctly', () => {
      const sedentary = formulas.tdee(75, 175, 30, true, 'sedentary');
      const athlete = formulas.tdee(75, 175, 30, true, 'athlete');
      
      expect(athlete.tdee).toBeGreaterThan(sedentary.tdee * 1.5);
    });
    
    it('should accept numeric activity multipliers', () => {
      const result = formulas.tdee(75, 175, 30, true, 1.75);
      
      expect(result.activityMultiplier).toBe(1.75);
      expect(result.tdee).toBeGreaterThan(result.bmr);
    });
    
  });
  
});

describe('Goal Analysis', () => {
  
  const analyzeGoal = (current, target, timeline = 12) => {
    const analysis = {
      current: {
        weight: current.weight,
        bodyFat: current.bodyFatPercentage,
        leanMass: current.weight * (1 - current.bodyFatPercentage / 100),
        fatMass: current.weight * (current.bodyFatPercentage / 100)
      },
      changes: {}
    };
    
    if (target.weight && target.bodyFatPercentage) {
      analysis.target = {
        weight: target.weight,
        bodyFat: target.bodyFatPercentage,
        leanMass: target.weight * (1 - target.bodyFatPercentage / 100),
        fatMass: target.weight * (target.bodyFatPercentage / 100)
      };
    } else if (target.bodyFatPercentage) {
      analysis.target = {
        leanMass: analysis.current.leanMass,
        bodyFat: target.bodyFatPercentage,
        fatMass: analysis.current.leanMass * target.bodyFatPercentage / (100 - target.bodyFatPercentage),
        weight: analysis.current.leanMass / (1 - target.bodyFatPercentage / 100)
      };
    }
    
    if (analysis.target) {
      analysis.changes = {
        totalWeight: analysis.target.weight - analysis.current.weight,
        fatMass: analysis.target.fatMass - analysis.current.fatMass,
        leanMass: analysis.target.leanMass - analysis.current.leanMass,
        weeklyChange: (analysis.target.weight - analysis.current.weight) / timeline
      };
    }
    
    return analysis;
  };
  
  it('should analyze cutting goal correctly', () => {
    const current = { weight: 85, bodyFatPercentage: 20 };
    const target = { bodyFatPercentage: 12 };
    
    const analysis = analyzeGoal(current, target, 16);
    
    expect(analysis.current.leanMass).toBeCloseTo(68, 0);
    expect(analysis.target.weight).toBeLessThan(current.weight);
    expect(analysis.changes.fatMass).toBeLessThan(0);
    expect(analysis.changes.leanMass).toBeCloseTo(0, 1); // Preserve lean mass
  });
  
  it('should analyze bulking goal correctly', () => {
    const current = { weight: 70, bodyFatPercentage: 12 };
    const target = { weight: 80, bodyFatPercentage: 15 };
    
    const analysis = analyzeGoal(current, target, 24);
    
    expect(analysis.changes.totalWeight).toBe(10);
    expect(analysis.changes.leanMass).toBeGreaterThan(0);
    expect(analysis.changes.weeklyChange).toBeCloseTo(0.42, 1);
  });
  
});
