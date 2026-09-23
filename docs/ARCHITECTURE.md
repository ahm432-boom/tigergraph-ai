# Architecture: TigerGraph Agentic Fraud Investigation

## Overview
The system relies on a central State Machine (LangGraph) orchestrating the investigation of alerts. It queries a TigerGraph instance via MCP for hard evidence and a vector store for semantic matches (policies, past cases), evaluates rules deterministically, simulates information gathering, and outputs structured case files.

## Components

### 1. Agent Orchestrator (LangGraph + OpenAI GPT-4o)
A state machine maintaining the investigation state:
`TRIGGERED` -> `EVIDENCE_COLLECTION` (Graph Queries) -> `PATTERN_ANALYSIS` -> `RISK_ASSESSMENT` -> `UNCERTAINTY_CHECK`
-> If uncertain: `EVIDENCE_REQUESTED` -> (simulate response) -> `REASSESSMENT`
-> `ACTION_SELECTION` -> `POLICY_CHECK` -> `CASE_UPDATED` -> `CLOSED`

The agent is supplied with a Pydantic `InvestigationContext` to keep its memory strictly structured.

### 2. TigerGraph Backend (Data Source)
Houses `transactions`, `identities`, and `closed_cases`. Provides fast path traversals:
- Subgraph of a customer (All their cards, transactions, regions, devices).
- Shared infrastructure queries (What other cards used this Device Profile in the last 7 days?).
- Sequence queries (Did 3 small transactions happen right before a large one?).

### 3. TigerGraph MCP (Model Context Protocol)
Exposes Graph capabilities to the LLM via tool calls:
- `get_transaction_context(txn_id)`
- `get_customer_history(customer_id)`
- `find_shared_entities(device_id)`
- `find_related_cases(customer_id, device_id)`

### 4. GraphRAG & Vector Memory
- A vector index containing the `closed_cases` narratives, Fraud Policies, and Regulatory References.
- Used to match current transaction patterns with historical precedents.

### 5. Deterministic Policy Engine
A Python module independent of the LLM. It takes the LLM's suggested actions and the current evidence state, and outputs the permitted actions, approval routes (`auto`, `L1`, `L2`), and required evidence (e.g., cannot `BLOCK_CARD` on a single signal without `VERIFY_WITH_CUSTOMER`).

### 6. Action Simulator
Mocks the responses of external parties to allow the agent to progress in one run.
- `request_customer_validation(case)` -> Returns an assumed response based on whether the data patterns strongly suggest fraud or if the transaction is a known legitimate pattern.

### 7. UI Dashboard (React / Vite)
A visual representation of the case, showing the timeline of the LangGraph state machine, the gathered evidence, the graph neighborhood (via `vis-network`), and the final Next Best Actions.

## Data Flow for a Case
1. `run_benchmark.py` feeds a trigger from `case_pack.csv` to the Agent.
2. Agent calls `get_transaction_context`.
3. Agent analyzes the data and requests historical behavior (`get_customer_history`).
4. Agent recognizes a pattern (e.g. Card Testing).
5. Agent requests `verify_with_customer`.
6. Action Simulator returns "Customer denies transaction".
7. Agent runs `find_shared_entities` to see if the device was used elsewhere.
8. Agent determines final probability, sets actions to `BLOCK_CARD`, `CREATE_CASE`, `FILE_REPORT`.
9. Policy engine routes `BLOCK_CARD` to `L1` and `FILE_REPORT` to `L2`.
10. Agent generates the JSON output file.
