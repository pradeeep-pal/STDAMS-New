"""
Alert management for STDAMS.
Generates alert objects with risk and score.
"""
import time

class AlertManager:
    def __init__(self):
        self.counter = 0

    def create_alert(self, telemetry, risk, risk_score):
        self.counter += 1
        return {
            'id': self.counter,
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'telemetry': telemetry,
            'risk': risk,
            'risk_score': risk_score
        }
