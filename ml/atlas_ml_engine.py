"""
═══════════════════════════════════════════════════════════════════════════════
🧠 ATLAS ML ENGINE v1.0
═══════════════════════════════════════════════════════════════════════════════

Machine Learning Backend per ATLAS Training System

Features:
- Athlete Clustering (K-Means, Hierarchical)
- Response Prediction (Gradient Boosting)
- Plateau Detection (Anomaly Detection)
- Overtraining Risk Assessment
- Personalized Recommendations

Requires: Python 3.9+, scikit-learn, pandas, numpy
"""

import os
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from enum import Enum

# ML Libraries
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.ensemble import GradientBoostingRegressor, IsolationForest
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import cross_val_score
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# API
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# ═══════════════════════════════════════════════════════════════════════════════
# DATA MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class AthleteCluster(Enum):
    HIGH_RESPONDER = "high_responder"
    MODERATE_RESPONDER = "moderate_responder"
    LOW_RESPONDER = "low_responder"
    RECOVERY_DEPENDENT = "recovery_dependent"
    VOLUME_SENSITIVE = "volume_sensitive"
    INTENSITY_THRIVES = "intensity_thrives"

@dataclass
class AthleteFeatures:
    """Features extracted from athlete data for ML models"""
    age: float
    training_age: float
    body_weight: float
    height: float
    body_fat_percentage: float
    avg_hrv: float
    avg_sleep_quality: float
    avg_recovery_score: float
    weekly_training_volume: float  # Total sets
    avg_intensity: float  # % of 1RM
    strength_ratio: float  # Total / BW
    progression_rate: float  # % improvement per month
    adherence_rate: float  # % sessions completed
    injury_history: int  # Count
    stress_level: float  # 1-10

@dataclass 
class PredictionInput:
    athlete_id: str
    current_1rm: float
    exercise: str
    training_weeks: int
    weekly_volume: int
    avg_intensity: float
    features: AthleteFeatures

@dataclass
class PredictionOutput:
    predicted_1rm: float
    confidence_interval: Tuple[float, float]
    risk_factors: List[str]
    recommendations: List[str]

# ═══════════════════════════════════════════════════════════════════════════════
# ATHLETE CLUSTERING ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

class AthleteClusteringEngine:
    """
    Clusters athletes based on their response patterns to training.
    Uses K-Means with optimal cluster selection via silhouette score.
    """
    
    def __init__(self, n_clusters: int = 6):
        self.n_clusters = n_clusters
        self.kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        self.scaler = StandardScaler()
        self.cluster_labels = list(AthleteCluster)
        self.is_fitted = False
        
    def prepare_features(self, athletes: List[AthleteFeatures]) -> np.ndarray:
        """Convert athlete features to numpy array for clustering"""
        feature_matrix = []
        
        for athlete in athletes:
            features = [
                athlete.avg_hrv,
                athlete.avg_sleep_quality,
                athlete.avg_recovery_score,
                athlete.weekly_training_volume,
                athlete.avg_intensity,
                athlete.progression_rate,
                athlete.adherence_rate,
                athlete.training_age,
                athlete.strength_ratio,
                athlete.stress_level
            ]
            feature_matrix.append(features)
            
        return np.array(feature_matrix)
    
    def fit(self, athletes: List[AthleteFeatures]) -> Dict[str, Any]:
        """Fit clustering model on athlete data"""
        X = self.prepare_features(athletes)
        X_scaled = self.scaler.fit_transform(X)
        
        # Find optimal number of clusters
        best_score = -1
        best_k = self.n_clusters
        
        from sklearn.metrics import silhouette_score
        
        for k in range(2, min(len(athletes), 8)):
            kmeans_temp = KMeans(n_clusters=k, random_state=42, n_init=10)
            labels = kmeans_temp.fit_predict(X_scaled)
            score = silhouette_score(X_scaled, labels)
            
            if score > best_score:
                best_score = score
                best_k = k
        
        # Fit with optimal k
        self.n_clusters = best_k
        self.kmeans = KMeans(n_clusters=best_k, random_state=42, n_init=10)
        self.kmeans.fit(X_scaled)
        self.is_fitted = True
        
        return {
            "optimal_clusters": best_k,
            "silhouette_score": best_score,
            "cluster_centers": self.kmeans.cluster_centers_.tolist()
        }
    
    def predict(self, athlete: AthleteFeatures) -> Tuple[str, Dict]:
        """Predict cluster for a single athlete"""
        if not self.is_fitted:
            raise ValueError("Model not fitted. Call fit() first.")
            
        X = self.prepare_features([athlete])
        X_scaled = self.scaler.transform(X)
        
        cluster_id = self.kmeans.predict(X_scaled)[0]
        distances = self.kmeans.transform(X_scaled)[0]
        
        # Map cluster to meaningful label based on centroid characteristics
        cluster_type = self._interpret_cluster(cluster_id)
        
        return cluster_type, {
            "cluster_id": int(cluster_id),
            "confidence": 1 - (distances[cluster_id] / distances.sum()),
            "distances_to_clusters": distances.tolist()
        }
    
    def _interpret_cluster(self, cluster_id: int) -> str:
        """Interpret cluster based on centroid features"""
        if not self.is_fitted:
            return AthleteCluster.MODERATE_RESPONDER.value
            
        centroid = self.kmeans.cluster_centers_[cluster_id]
        
        # Feature indices: hrv, sleep, recovery, volume, intensity, progression, adherence, training_age, strength, stress
        hrv, sleep, recovery, volume, intensity, progression, adherence, training_age, strength, stress = centroid
        
        # High HRV + High Recovery + High Progression = High Responder
        if progression > 0.5 and recovery > 0.5 and adherence > 0.5:
            return AthleteCluster.HIGH_RESPONDER.value
        
        # Low HRV + Sleep dependent on recovery
        if recovery > 0.6 and hrv < 0:
            return AthleteCluster.RECOVERY_DEPENDENT.value
        
        # High volume preference
        if volume > 0.5 and intensity < 0:
            return AthleteCluster.VOLUME_SENSITIVE.value
        
        # High intensity preference
        if intensity > 0.5 and volume < 0:
            return AthleteCluster.INTENSITY_THRIVES.value
        
        # Low progression
        if progression < -0.3:
            return AthleteCluster.LOW_RESPONDER.value
        
        return AthleteCluster.MODERATE_RESPONDER.value
    
    def save(self, path: str):
        """Save model to disk"""
        joblib.dump({
            'kmeans': self.kmeans,
            'scaler': self.scaler,
            'n_clusters': self.n_clusters,
            'is_fitted': self.is_fitted
        }, path)
    
    def load(self, path: str):
        """Load model from disk"""
        data = joblib.load(path)
        self.kmeans = data['kmeans']
        self.scaler = data['scaler']
        self.n_clusters = data['n_clusters']
        self.is_fitted = data['is_fitted']

# ═══════════════════════════════════════════════════════════════════════════════
# STRENGTH PROGRESSION PREDICTOR
# ═══════════════════════════════════════════════════════════════════════════════

class StrengthProgressionPredictor:
    """
    Predicts future 1RM based on athlete characteristics and training parameters.
    Uses Gradient Boosting with confidence intervals.
    """
    
    def __init__(self):
        self.model = GradientBoostingRegressor(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.is_fitted = False
        
    def prepare_features(self, data: List[PredictionInput]) -> np.ndarray:
        """Prepare features for prediction"""
        features = []
        
        for d in data:
            row = [
                d.current_1rm,
                d.training_weeks,
                d.weekly_volume,
                d.avg_intensity,
                d.features.training_age,
                d.features.body_weight,
                d.features.avg_hrv,
                d.features.avg_recovery_score,
                d.features.progression_rate,
                d.features.adherence_rate,
                d.features.stress_level
            ]
            features.append(row)
            
        return np.array(features)
    
    def fit(self, data: List[PredictionInput], targets: List[float]) -> Dict:
        """Train the model on historical data"""
        X = self.prepare_features(data)
        X_scaled = self.scaler.fit_transform(X)
        y = np.array(targets)
        
        # Cross-validation
        cv_scores = cross_val_score(self.model, X_scaled, y, cv=5, scoring='r2')
        
        # Final fit
        self.model.fit(X_scaled, y)
        self.is_fitted = True
        
        return {
            "cv_r2_mean": cv_scores.mean(),
            "cv_r2_std": cv_scores.std(),
            "feature_importances": dict(zip(
                ['current_1rm', 'weeks', 'volume', 'intensity', 'training_age', 
                 'weight', 'hrv', 'recovery', 'progression', 'adherence', 'stress'],
                self.model.feature_importances_.tolist()
            ))
        }
    
    def predict(self, input_data: PredictionInput) -> PredictionOutput:
        """Predict future 1RM with confidence interval"""
        if not self.is_fitted:
            # Return heuristic prediction if not fitted
            return self._heuristic_prediction(input_data)
        
        X = self.prepare_features([input_data])
        X_scaled = self.scaler.transform(X)
        
        # Point prediction
        predicted = self.model.predict(X_scaled)[0]
        
        # Confidence interval using tree variance
        predictions = []
        for tree in self.model.estimators_:
            pred = tree[0].predict(X_scaled)[0]
            predictions.append(pred)
        
        std = np.std(predictions)
        ci_lower = predicted - 1.96 * std
        ci_upper = predicted + 1.96 * std
        
        # Generate risk factors and recommendations
        risk_factors = self._assess_risks(input_data)
        recommendations = self._generate_recommendations(input_data, predicted)
        
        return PredictionOutput(
            predicted_1rm=round(predicted, 1),
            confidence_interval=(round(ci_lower, 1), round(ci_upper, 1)),
            risk_factors=risk_factors,
            recommendations=recommendations
        )
    
    def _heuristic_prediction(self, input_data: PredictionInput) -> PredictionOutput:
        """Fallback prediction using domain knowledge"""
        current = input_data.current_1rm
        weeks = input_data.training_weeks
        training_age = input_data.features.training_age
        
        # Progression rate decreases with training age
        if training_age < 1:
            weekly_gain = 0.015  # 1.5% per week for beginners
        elif training_age < 3:
            weekly_gain = 0.008  # 0.8% per week for intermediate
        else:
            weekly_gain = 0.003  # 0.3% per week for advanced
        
        # Adjust for recovery and adherence
        modifier = (input_data.features.avg_recovery_score / 100) * (input_data.features.adherence_rate / 100)
        
        predicted = current * (1 + weekly_gain * weeks * modifier)
        
        return PredictionOutput(
            predicted_1rm=round(predicted, 1),
            confidence_interval=(round(predicted * 0.95, 1), round(predicted * 1.05, 1)),
            risk_factors=self._assess_risks(input_data),
            recommendations=self._generate_recommendations(input_data, predicted)
        )
    
    def _assess_risks(self, data: PredictionInput) -> List[str]:
        """Identify potential risk factors"""
        risks = []
        
        if data.features.avg_hrv < 40:
            risks.append("Low HRV indicates poor recovery capacity")
        
        if data.features.avg_sleep_quality < 60:
            risks.append("Sleep quality below optimal for adaptation")
        
        if data.features.stress_level > 7:
            risks.append("High stress may impair recovery")
        
        if data.weekly_volume > 25:
            risks.append("High training volume may lead to overreaching")
        
        if data.avg_intensity > 85:
            risks.append("Sustained high intensity increases injury risk")
        
        if data.features.adherence_rate < 70:
            risks.append("Low adherence will reduce expected gains")
        
        return risks
    
    def _generate_recommendations(self, data: PredictionInput, predicted: float) -> List[str]:
        """Generate actionable recommendations"""
        recs = []
        
        gain = (predicted - data.current_1rm) / data.current_1rm * 100
        
        if gain < 5:
            recs.append("Consider deload week to enhance recovery")
            recs.append("Evaluate if volume needs adjustment")
        
        if data.features.avg_hrv < 50:
            recs.append("Prioritize recovery: sleep, nutrition, stress management")
        
        if data.features.progression_rate < 0.5:
            recs.append("Try periodization variation (DUP, block, conjugate)")
        
        if data.avg_intensity > 80:
            recs.append("Include more submaximal volume work")
        
        if data.features.training_age > 5:
            recs.append("Focus on technique refinement and weak points")
        
        return recs

# ═══════════════════════════════════════════════════════════════════════════════
# PLATEAU & OVERTRAINING DETECTOR
# ═══════════════════════════════════════════════════════════════════════════════

class PlateauDetector:
    """
    Detects training plateaus and overtraining risk using:
    - Isolation Forest for anomaly detection
    - Trend analysis on key metrics
    """
    
    def __init__(self, contamination: float = 0.1):
        self.isolation_forest = IsolationForest(
            contamination=contamination,
            random_state=42
        )
        self.is_fitted = False
        
    def analyze_trend(self, values: List[float], window: int = 4) -> Dict:
        """Analyze trend in a time series"""
        if len(values) < window:
            return {"trend": "insufficient_data", "slope": 0}
        
        # Simple linear regression
        x = np.arange(len(values))
        y = np.array(values)
        
        slope = np.polyfit(x, y, 1)[0]
        
        if abs(slope) < 0.01:
            trend = "plateau"
        elif slope > 0:
            trend = "improving"
        else:
            trend = "declining"
        
        return {
            "trend": trend,
            "slope": slope,
            "last_value": values[-1],
            "change_percent": ((values[-1] - values[0]) / values[0] * 100) if values[0] != 0 else 0
        }
    
    def detect_overtraining(self, metrics: Dict[str, List[float]]) -> Dict:
        """
        Detect overtraining based on multiple metrics:
        - HRV trend (declining = bad)
        - Sleep quality trend
        - Performance trend
        - Resting HR trend (increasing = bad)
        """
        warnings = []
        risk_score = 0
        
        # HRV analysis
        if "hrv" in metrics and len(metrics["hrv"]) >= 4:
            hrv_trend = self.analyze_trend(metrics["hrv"])
            if hrv_trend["trend"] == "declining":
                warnings.append("HRV declining - possible overreaching")
                risk_score += 25
            elif hrv_trend["trend"] == "plateau" and metrics["hrv"][-1] < 50:
                warnings.append("HRV consistently low")
                risk_score += 15
        
        # Sleep quality
        if "sleep_quality" in metrics and len(metrics["sleep_quality"]) >= 4:
            sleep_trend = self.analyze_trend(metrics["sleep_quality"])
            if sleep_trend["trend"] == "declining":
                warnings.append("Sleep quality decreasing")
                risk_score += 20
        
        # Resting HR (should stay stable or decrease)
        if "resting_hr" in metrics and len(metrics["resting_hr"]) >= 4:
            hr_trend = self.analyze_trend(metrics["resting_hr"])
            if hr_trend["trend"] == "improving":  # Improving = increasing = bad
                warnings.append("Resting heart rate increasing")
                risk_score += 25
        
        # Performance
        if "performance" in metrics and len(metrics["performance"]) >= 4:
            perf_trend = self.analyze_trend(metrics["performance"])
            if perf_trend["trend"] == "declining":
                warnings.append("Performance declining despite training")
                risk_score += 30
            elif perf_trend["trend"] == "plateau":
                warnings.append("Performance plateaued - consider variation")
                risk_score += 10
        
        # Determine overall risk level
        if risk_score >= 60:
            risk_level = "high"
            recommendation = "Recommend deload week or active recovery"
        elif risk_score >= 30:
            risk_level = "moderate"
            recommendation = "Monitor closely, consider reducing volume"
        else:
            risk_level = "low"
            recommendation = "Continue current program"
        
        return {
            "risk_level": risk_level,
            "risk_score": risk_score,
            "warnings": warnings,
            "recommendation": recommendation,
            "trends": {
                metric: self.analyze_trend(values) 
                for metric, values in metrics.items() 
                if len(values) >= 4
            }
        }

# ═══════════════════════════════════════════════════════════════════════════════
# FASTAPI APPLICATION
# ═══════════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="ATLAS ML Engine",
    description="Machine Learning Backend for ATLAS Training System",
    version="1.0.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models
clustering_engine = AthleteClusteringEngine()
progression_predictor = StrengthProgressionPredictor()
plateau_detector = PlateauDetector()

# ═══════════════════════════════════════════════════════════════════════════════
# API MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class AthleteData(BaseModel):
    age: float
    training_age: float
    body_weight: float
    height: float
    body_fat_percentage: float = 15.0
    avg_hrv: float = 60.0
    avg_sleep_quality: float = 75.0
    avg_recovery_score: float = 75.0
    weekly_training_volume: float = 20.0
    avg_intensity: float = 75.0
    strength_ratio: float = 1.5
    progression_rate: float = 1.0
    adherence_rate: float = 85.0
    injury_history: int = 0
    stress_level: float = 5.0

class PredictionRequest(BaseModel):
    athlete_id: str
    current_1rm: float
    exercise: str
    training_weeks: int = 12
    weekly_volume: int = 15
    avg_intensity: float = 75.0
    athlete: AthleteData

class OvertrainingRequest(BaseModel):
    hrv: List[float] = []
    sleep_quality: List[float] = []
    resting_hr: List[float] = []
    performance: List[float] = []

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/")
async def root():
    return {
        "name": "ATLAS ML Engine",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": [
            "/cluster",
            "/predict",
            "/overtraining",
            "/health"
        ]
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "clustering_fitted": clustering_engine.is_fitted,
        "predictor_fitted": progression_predictor.is_fitted
    }

@app.post("/cluster")
async def cluster_athlete(athlete: AthleteData):
    """Classify an athlete into a response cluster"""
    try:
        features = AthleteFeatures(**athlete.dict())
        
        if clustering_engine.is_fitted:
            cluster_type, details = clustering_engine.predict(features)
        else:
            # Return heuristic classification
            cluster_type = _heuristic_cluster(features)
            details = {"note": "Model not trained, using heuristics"}
        
        return {
            "cluster": cluster_type,
            "details": details,
            "description": _get_cluster_description(cluster_type)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
async def predict_progression(request: PredictionRequest):
    """Predict strength progression"""
    try:
        features = AthleteFeatures(**request.athlete.dict())
        
        input_data = PredictionInput(
            athlete_id=request.athlete_id,
            current_1rm=request.current_1rm,
            exercise=request.exercise,
            training_weeks=request.training_weeks,
            weekly_volume=request.weekly_volume,
            avg_intensity=request.avg_intensity,
            features=features
        )
        
        result = progression_predictor.predict(input_data)
        
        return {
            "exercise": request.exercise,
            "current_1rm": request.current_1rm,
            "predicted_1rm": result.predicted_1rm,
            "gain_kg": round(result.predicted_1rm - request.current_1rm, 1),
            "gain_percent": round((result.predicted_1rm - request.current_1rm) / request.current_1rm * 100, 1),
            "confidence_interval": result.confidence_interval,
            "risk_factors": result.risk_factors,
            "recommendations": result.recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/overtraining")
async def check_overtraining(request: OvertrainingRequest):
    """Detect overtraining risk"""
    try:
        metrics = {
            "hrv": request.hrv,
            "sleep_quality": request.sleep_quality,
            "resting_hr": request.resting_hr,
            "performance": request.performance
        }
        
        # Filter empty lists
        metrics = {k: v for k, v in metrics.items() if v}
        
        if not metrics:
            return {"error": "No metrics provided"}
        
        result = plateau_detector.detect_overtraining(metrics)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ═══════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

def _heuristic_cluster(features: AthleteFeatures) -> str:
    """Heuristic classification without ML model"""
    if features.progression_rate > 1.5 and features.avg_recovery_score > 80:
        return AthleteCluster.HIGH_RESPONDER.value
    elif features.avg_hrv > 70 and features.weekly_training_volume > 25:
        return AthleteCluster.VOLUME_SENSITIVE.value
    elif features.avg_intensity > 80:
        return AthleteCluster.INTENSITY_THRIVES.value
    elif features.avg_recovery_score > 80 and features.avg_hrv < 50:
        return AthleteCluster.RECOVERY_DEPENDENT.value
    elif features.progression_rate < 0.5:
        return AthleteCluster.LOW_RESPONDER.value
    else:
        return AthleteCluster.MODERATE_RESPONDER.value

def _get_cluster_description(cluster: str) -> Dict:
    """Get description and recommendations for cluster"""
    descriptions = {
        AthleteCluster.HIGH_RESPONDER.value: {
            "title": "High Responder",
            "description": "You adapt quickly to training stimulus and recover efficiently.",
            "training_focus": "Can handle higher volume and frequency",
            "recommendations": [
                "Push training volume when recovery allows",
                "Experiment with advanced techniques",
                "Track metrics to avoid overreaching"
            ]
        },
        AthleteCluster.MODERATE_RESPONDER.value: {
            "title": "Moderate Responder",
            "description": "Average response to training with balanced recovery.",
            "training_focus": "Standard periodization works well",
            "recommendations": [
                "Follow proven programming principles",
                "Focus on progressive overload",
                "Prioritize consistency"
            ]
        },
        AthleteCluster.LOW_RESPONDER.value: {
            "title": "Low Responder",
            "description": "Slower adaptation rate, may need more recovery or different approach.",
            "training_focus": "Quality over quantity",
            "recommendations": [
                "Focus on sleep and nutrition optimization",
                "Consider lower volume, higher intensity",
                "Patience is key - track long-term trends"
            ]
        },
        AthleteCluster.RECOVERY_DEPENDENT.value: {
            "title": "Recovery Dependent",
            "description": "Progress heavily influenced by recovery quality.",
            "training_focus": "Optimize recovery between sessions",
            "recommendations": [
                "Prioritize 7-9 hours of sleep",
                "Use readiness-based training adjustments",
                "Consider HRV-guided training"
            ]
        },
        AthleteCluster.VOLUME_SENSITIVE.value: {
            "title": "Volume Sensitive",
            "description": "Responds best to higher training volume.",
            "training_focus": "More sets and reps, moderate intensity",
            "recommendations": [
                "Higher set counts per muscle group",
                "Moderate intensity (65-80% 1RM)",
                "DUP or high-frequency programs"
            ]
        },
        AthleteCluster.INTENSITY_THRIVES.value: {
            "title": "Intensity Thrives",
            "description": "Responds best to heavy lifting with lower volume.",
            "training_focus": "Heavier loads, fewer sets",
            "recommendations": [
                "Lower rep ranges (1-5)",
                "Higher intensity (80-95% 1RM)",
                "Longer rest periods"
            ]
        }
    }
    
    return descriptions.get(cluster, descriptions[AthleteCluster.MODERATE_RESPONDER.value])

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import sys
    
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    
    print(f"""
╔═══════════════════════════════════════════════════════════════════════════╗
║  🧠 ATLAS ML ENGINE v1.0                                                  ║
║  Machine Learning Backend for ATLAS Training System                       ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Starting server on port {port}...                                          ║
║                                                                           ║
║  Endpoints:                                                               ║
║    POST /cluster     - Classify athlete into response cluster             ║
║    POST /predict     - Predict strength progression                       ║
║    POST /overtraining - Detect overtraining risk                          ║
║    GET  /health      - Check service health                               ║
╚═══════════════════════════════════════════════════════════════════════════╝
    """)
    
    uvicorn.run(app, host="0.0.0.0", port=port)
