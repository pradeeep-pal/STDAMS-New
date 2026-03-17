"""
Threat classification engine for STDAMS.
Classifies anomaly scores into risk levels.
"""
def classify_threat(score):
    # Lower score = more anomalous
    if score < -0.2:
        return 'High Risk', 90
    elif score < 0.0:
        return 'Medium Risk', 60
    else:
        return 'Low Risk', 30
