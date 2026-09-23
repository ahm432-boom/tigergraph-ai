from typing import List, Dict, Any

class PolicyEngine:
    """
    Deterministic module to enforce policies on actions recommended by the agent.
    """
    
    @staticmethod
    def evaluate_actions(recommended_actions: List[str], fraud_prob: float, exposure_usd: float) -> Dict[str, Any]:
        results = {}
        for action in recommended_actions:
            if action == "BLOCK_CARD":
                if exposure_usd > 2500:
                    results[action] = {"route": "L2_APPROVAL", "reason": "High exposure requires Manager approval."}
                else:
                    results[action] = {"route": "L1_APPROVAL", "reason": "Standard block route."}
            elif action == "FILE_REPORT":
                if fraud_prob > 0.8 and exposure_usd > 1000:
                    results[action] = {"route": "AUTO", "reason": "Meets SAR requirements."}
                else:
                    results[action] = {"route": "REJECTED", "reason": "Does not meet SAR threshold."}
            else:
                results[action] = {"route": "AUTO", "reason": "Low risk action."}
                
        return results
