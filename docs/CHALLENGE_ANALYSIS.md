# Challenge Analysis: TigerGraph Agentic Fraud Investigation

## Challenge Objective
Build an Agentic Fraud Investigation System using TigerGraph. The system must autonomously investigate fraud alerts, navigate through evidence (transactions, device identities, closed cases), recognize known patterns, determine when to ask for more information (evidence gathering loop), decide the next best action constrained by policies, and summarize its findings in clear case logs and Suspicious Activity Reports (SAR). 

## Mandatory Requirements
1. **TigerGraph Integration**: Use Savanna or Community Edition for graph and vector storage/retrieval.
2. **GSQL & Graph Algorithms**: Must use graph traversal, pattern detection, and relationship analysis.
3. **TigerGraph MCP**: Must expose graph capabilities to the agent via MCP.
4. **GraphRAG**: Retrieve connected evidence from the graph and unstructured text (policies, closed cases) for LLM context.
5. **User Interface**: Must provide a dashboard demonstrating investigation, case progression, uncertainty, and recommendations.
6. **Agentic Workflow**:
   - Handle Triggers (Risk Score, Customer Report, Analyst Request).
   - Gather Evidence & Assess Uncertainty.
   - Request additional evidence when uncertain (simulated).
   - Evolve actions based on new evidence.
7. **Explainability**: Output clear reasons for every decision, using defined policy rules.
8. **Case Persistence**: Save cases (verdicts, evidence, next best actions) back to the graph/memory.
9. **SAR Generation**: Generate regulatory Suspicious Activity Reports only when specific policy conditions are met.
10. **Benchmark Submission**: Must run 20 cases from `case_pack.csv` and generate specific JSON output files for each.

## Judging Criteria
- **25% Investigation Accuracy**: Accurate pattern identification and evidence gathering.
- **25% Next Best Action**: Handling ambiguity, requesting evidence, and updating recommendations.
- **15% Agentic Design**: Architecture, tool use, workflow orchestration, state machine.
- **15% Innovation**: Originality, use of GraphRAG, AI.
- **10% Case Summary & Explainability**: Clarity of case summary, evidence, and actions.
- **10% Demo Quality**: 3-5 minute end-to-end video demonstration.

## Required Output Format
20 JSON files named `<case_id>.json` in a `cases/` directory. Each file contains:
- `case_id`, `evidence_requests`, `stop_reason`, `tool_calls`, `tokens`, `latency_s`
- `case` object: Internal investigation record (status, verdict, fraud_prob, pattern, exposure, affected_txns, connected devices, etc.)
- `sar` object: Regulatory report (file boolean, narrative, total amount, subjects, dates)
- `next_best_actions` object: Initial and Final recommended actions, with their policy routes and reasons.

## Risks & Assumptions
- **Risk**: TigerGraph setup might take time or cloud instances might auto-pause.
- **Assumption**: We can simulate the `evidence_request` responses (e.g., customer denies transaction) deterministically for the benchmark cases based on what proves the patterns.
- **Risk**: Over-reliance on LLM for counting/aggregation instead of GSQL. We must constrain the LLM to use MCP tools for graph facts.

## Implementation Priorities (P0 to P2)
1. **P0 (Must Work)**: TigerGraph schema, data loading, Graph MCP tools, Agent Orchestrator (state machine), Evidence handling, NBA policy engine, Benchmark runner.
2. **P1 (High Value)**: GraphRAG for historical cases and policies, Dashboard UI (React/Vite).
3. **P2 (Polish)**: Advanced visualizations, deep analytics.

## Submission Checklist
- [ ] 20 output JSON files in `cases/` directory.
- [ ] GitHub Repository with complete source code.
- [ ] Working Agent / UI.
- [ ] 3-5 minute Demo Video.
- [ ] Technical Blog Post.
- [ ] Social Media Post.
