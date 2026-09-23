import os
from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

# Define the State
class InvestigationState(TypedDict):
    case_id: str
    trigger_type: str
    flagged_txn_id: str
    customer_id: str
    evidence: Dict[str, Any]
    uncertainty_level: str # HIGH, MEDIUM, LOW
    pending_requests: List[str]
    actions: List[str]
    verdict: str
    fraud_prob: float
    pattern: str

# Nodes
def start_investigation(state: InvestigationState) -> InvestigationState:
    print(f"Starting investigation for {state['case_id']}")
    state["evidence"] = {}
    return state

def gather_evidence(state: InvestigationState) -> InvestigationState:
    print(f"Gathering graph evidence for {state['customer_id']}")
    # TODO: Connect to TigerGraph MCP here to pull context
    # For now, placeholder
    state["evidence"]["graph_data"] = "Mock graph context"
    return state

def analyze_pattern(state: InvestigationState) -> InvestigationState:
    print("Analyzing pattern...")
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    # Placeholder logic
    state["pattern"] = "UNKNOWN"
    state["uncertainty_level"] = "MEDIUM"
    return state

def evaluate_uncertainty(state: InvestigationState) -> InvestigationState:
    print("Evaluating uncertainty...")
    if state["uncertainty_level"] == "HIGH":
        state["pending_requests"].append("request_customer_validation")
    return state

def determine_actions(state: InvestigationState) -> InvestigationState:
    print("Determining actions...")
    # Will call Policy Engine
    state["actions"] = ["MONITOR_ACCOUNT"]
    state["verdict"] = "UNDECIDED"
    return state

# Build the Graph
workflow = StateGraph(InvestigationState)

workflow.add_node("start", start_investigation)
workflow.add_node("gather_evidence", gather_evidence)
workflow.add_node("analyze_pattern", analyze_pattern)
workflow.add_node("evaluate_uncertainty", evaluate_uncertainty)
workflow.add_node("determine_actions", determine_actions)

workflow.set_entry_point("start")
workflow.add_edge("start", "gather_evidence")
workflow.add_edge("gather_evidence", "analyze_pattern")
workflow.add_edge("analyze_pattern", "evaluate_uncertainty")
workflow.add_edge("evaluate_uncertainty", "determine_actions")
workflow.add_edge("determine_actions", END)

agent_app = workflow.compile()
