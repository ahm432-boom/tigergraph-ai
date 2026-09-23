# TigerGraph Agentic Fraud Investigation

An AI-powered agentic fraud investigation system built with TigerGraph for graph-based transaction analysis, suspicious pattern detection, and evidence-driven case investigation.

## Overview

This project combines graph analytics, AI agents, and transaction data to help investigators identify suspicious financial activity and understand relationships between entities involved in potentially fraudulent transactions.

## Key Features

- Graph-based fraud investigation using TigerGraph
- Agentic investigation workflow
- Transaction and identity relationship analysis
- Suspicious activity and fraud pattern detection
- Case-based investigation
- Policy and evaluation engine
- Interactive investigation dashboard
- Historical closed-case analysis

## Technology Stack

- Python
- TigerGraph
- React
- Vite
- Tailwind CSS
- Docker
- Agentic AI

## Project Structure

    agent/                 AI investigation agents
    cases/                 Investigation case data
    docs/                  Technical documentation
    tg_backend/            TigerGraph schema and queries
    ui/                    Frontend application
    case_pack.csv          Case dataset
    identity.csv           Identity dataset
    closed_cases_history.csv
    docker-compose.yml

## TigerGraph

TigerGraph schema, queries, and data-loading scripts are available in:

    tg_backend/
    +-- schema.gsql
    +-- queries.gsql
    +-- load_data.gsql

## Frontend Setup

    cd ui
    npm install
    npm run dev

## Dataset

The original transactions dataset is approximately 675 MB and is excluded from this GitHub repository because GitHub's standard file-size limit is 100 MB.

## Documentation

- docs/ARCHITECTURE.md
- docs/CHALLENGE_ANALYSIS.md
- docs/DATASET_ANALYSIS.md
- docs/TIGERGRAPH_SCHEMA.md

## Hackathon Project

Developed as part of a hackathon challenge focused on applying graph technology and agentic AI to financial fraud investigation.
