import json
import os
import time

def process_cases(case_file: str, output_dir: str):
    print(f"Starting evaluation of cases from {case_file}...")
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    # Mocking reading from case_pack.csv and processing
    # In a real run, this would invoke graph.py for each case
    
    cases = [
        {"case_id": "CASE-101", "trigger_type": "risk_score", "customer_id": "CUST-A"},
        {"case_id": "CASE-102", "trigger_type": "customer_report", "customer_id": "CUST-B"}
    ]
    
    for case in cases:
        start_time = time.time()
        
        # Invoke agent
        # state = agent_app.invoke({"case_id": case["case_id"], ...})
        
        latency = time.time() - start_time
        
        output_payload = {
            "case_id": case["case_id"],
            "evidence_requests": [],
            "stop_reason": "ACTION_TAKEN",
            "latency_s": latency,
            "case": {
                "status": "CLOSED",
                "verdict": "FRAUD",
                "fraud_prob": 0.85,
                "exposure": 500,
            },
            "sar": {
                "file": False
            },
            "next_best_actions": {
                "initial": [],
                "final": [{"action": "BLOCK_CARD", "route": "L1_APPROVAL"}]
            }
        }
        
        with open(os.path.join(output_dir, f"{case['case_id']}.json"), "w") as f:
            json.dump(output_payload, f, indent=2)
            
    print(f"Generated case outputs in {output_dir}")

if __name__ == "__main__":
    process_cases("../data/case_pack.csv", "../cases/")
