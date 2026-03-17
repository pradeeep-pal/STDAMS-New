"""
AI Anomaly Detection using Isolation Forest for STDAMS.
Detects abnormal telemetry patterns.
"""
from sklearn.ensemble import IsolationForest
import numpy as np

class AnomalyDetector:
    def __init__(self):
        # Train on normal data distribution
        self.model = IsolationForest(contamination=0.1, random_state=42)
        normal_data = np.random.normal(loc=[30, 80, 70, 30], scale=[5, 10, 10, 10], size=(200, 4))
        self.model.fit(normal_data)

    def detect(self, X):
        # X: list of [temperature, battery, signal, cpu]
        pred = self.model.predict(X)
        score = self.model.decision_function(X)[0]
        is_anomaly = pred[0] == -1
        return is_anomaly, score
