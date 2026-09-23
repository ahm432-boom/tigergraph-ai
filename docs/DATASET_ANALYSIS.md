# Dataset Analysis: HHGOA IEEE-CIS Fraud Detection

## Discovered Files
1. `transactions.csv` (675 MB) - 590,742 transactions. Contains the core activity, joined to customer IDs and risk scores.
2. `identity.csv` (25 MB) - 144,432 identity records for online transactions. Contains device details, OS, browser.
3. `closed_cases_history.csv` (2.5 MB) - 5,565 past investigations (July-Oct 2016). Ground truth for memory retrieval.
4. `case_pack.csv` (0.003 MB) - 20 exam cases (Nov-Dec 2016) with triggers to evaluate the agent.

## Schema / Columns
### Transactions (`transactions.csv`)
- **Core**: `TransactionID`, `TransactionDT` (seconds elapsed), `TransactionAmt` (USD), `ProductCD` (Channel type).
- **Cards**: `card1` - `card6`. `card4` is network, `card6` is type (credit/debit).
- **Geography**: `addr1` (Billing region), `addr2` (Country).
- **Additional**: `C1`-`C14` (Counts), `D1`-`D15` (Time deltas), `M1`-`M9` (Match flags), `V1`-`V339` (Vesta features).
- **Added by Hackathon**: `customer_id`, `ts` (real timestamp), `channel` (`online` or `in_person`), `risk_score` (0.0 - 1.0).

### Identity (`identity.csv`)
- **Keys**: `TransactionID`
- **Device Details**: `DeviceType` (mobile/desktop), `DeviceInfo` (e.g. SAMSUNG SM-G935F).
- **Attributes**: `id_30` (OS), `id_31` (Browser), `id_33` (Screen resolution).
- **Status Flags**: `id_15` (New / Found), `id_23` (Proxy status), `id_34` (Match status).

### Closed Cases (`closed_cases_history.csv`)
- `case_id`, `customer_id`, `card_id`, `opened_at`, `closed_at`, `outcome` (`confirmed_fraud` / `cleared`), `pattern`, `first_fraud_txn_id`, `txn_ids`, `n_txns`, `exposure_usd`, `connected_card_ids`, `actions_taken`, `report_filed`, `analyst_notes`.

### Case Pack (`case_pack.csv`)
- `case_id`, `opened_at`, `trigger_type` (`risk_score`, `customer_report`, `analyst_request`), `trigger_text`, `flagged_txn_id`, `card_id`, `customer_id`, `risk_score`.

## Candidate Graph Entities (Vertices)
1. `Customer` (ID: `customer_id`)
2. `Card` (ID: `card_id` constructed from customer + card identifiers e.g. `C12382-K1`)
3. `Transaction` (ID: `TransactionID`)
4. `DeviceProfile` (ID: Hash of DeviceInfo, OS, Browser, Screen)
5. `EmailDomain` (ID: `P_emaildomain`, `R_emaildomain`)
6. `BillingRegion` (ID: `addr1`)
7. `ClosedCase` (ID: `case_id`)
8. `InvestigationCase` (ID: `case_id` for newly generated cases)

## Candidate Graph Relationships (Edges)
- `Customer` - `OWNS` -> `Card`
- `Card` - `MADE` -> `Transaction`
- `Transaction` - `FROM_DEVICE` -> `DeviceProfile` (online only)
- `Transaction` - `PURCHASER_EMAIL` -> `EmailDomain`
- `Transaction` - `BILLED_IN` -> `BillingRegion`
- `Transaction` - `NEXT` -> `Transaction` (Ordered chronologically by card)
- `ClosedCase` - `INVOLVES` -> `Transaction`
- `ClosedCase` - `ON_CARD` -> `Card`
- `ClosedCase` - `CONNECTED_TO` -> `Card` (for related exposure)

## Fraud Patterns
1. **Card Testing**: 3+ small (<$5) online authorizations in 1 hour, followed by a larger purchase.
2. **Card-Not-Present Fraud**: Unusual online amounts/products in a burst (2-4 within 48h).
3. **CNP Fraud from New Device**: Same as #2, but device is marked `New` (id_15).
4. **Out-of-Region Use**: Card-present (`in_person`) transactions in a new billing region while normal activity continues at home.
5. **Account Takeover**: Mixed-channel, inconsistent behavior, device/match anomalies (compromised credentials).
6. **Undocumented**: Doesn't fit above, but shows coordinated abuse across customers.

## Policy Engine Basics
- **Trigger**: Risk score > 0 doesn't mean fraud; it means "look at it".
- **Evidence Gathering**: If probability < 0.70 on a weak signal, verify before blocking.
- **Routing**: Auto actions (Agent can execute), L1 actions (Team lead - small blocks), L2 actions (Manager - large blocks >$2500, SARs).
- **SAR Requirements**: File if exposure > $1000 OR shared device/region cluster OR coordinated abuse.
