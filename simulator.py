"""
Simulates satellite telemetry data for STDAMS.
Generates random values for temperature, battery, signal, and CPU load.
"""
import random

class TelemetrySimulator:
    def __init__(self):
        self.ranges = {
            'temperature': (10, 50),
            'battery': (20, 100),
            'signal': (30, 100),
            'cpu': (5, 95)
        }

    def generate(self):
        return {
            'temperature': round(random.uniform(*self.ranges['temperature']), 2),
            'battery': round(random.uniform(*self.ranges['battery']), 2),
            'signal': round(random.uniform(*self.ranges['signal']), 2),
            'cpu': round(random.uniform(*self.ranges['cpu']), 2)
        }
