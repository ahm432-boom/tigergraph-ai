# TigerGraph Schema Design

## Vertices

1. **Customer**
   - Primary ID: `customer_id` (STRING)

2. **Card**
   - Primary ID: `card_id` (STRING)
   - Attributes: `card_network` (STRING), `card_type` (STRING)

3. **Transaction**
   - Primary ID: `txn_id` (STRING)
   - Attributes: `ts` (DATETIME), `amount` (DOUBLE), `channel` (STRING), `risk_score` (DOUBLE), `product_cd` (STRING)

4. **DeviceProfile**
   - Primary ID: `device_id` (STRING) - Generated hash of DeviceInfo + OS + Browser + Screen
   - Attributes: `device_type` (STRING), `os` (STRING), `browser` (STRING), `screen` (STRING)

5. **BillingRegion**
   - Primary ID: `region_id` (STRING)

6. **EmailDomain**
   - Primary ID: `email` (STRING)

7. **ClosedCase**
   - Primary ID: `case_id` (STRING)
   - Attributes: `outcome` (STRING), `pattern` (STRING), `exposure_usd` (DOUBLE), `narrative` (STRING)

## Edges

1. `Customer` - ( `OWNS` ) -> `Card`
2. `Card` - ( `MADE` ) -> `Transaction` (Attributes: `ts` DATETIME)
3. `Transaction` - ( `FROM_DEVICE` ) -> `DeviceProfile`
4. `Transaction` - ( `BILLED_IN` ) -> `BillingRegion`
5. `Transaction` - ( `PURCHASER_EMAIL` ) -> `EmailDomain`
6. `Transaction` - ( `NEXT_TXN` ) -> `Transaction` (Links chronological transactions for a single card)
7. `ClosedCase` - ( `INVOLVES_TXN` ) -> `Transaction`
8. `ClosedCase` - ( `CONNECTED_TO_CARD` ) -> `Card`

## Loading Strategy
Due to the dataset size (~675 MB of transactions):
1. Use TigerGraph GSQL Loading Jobs.
2. Read `transactions.csv` to create `Customer`, `Card`, `Transaction`, `BillingRegion`, `EmailDomain`, and their edges.
3. Read `identity.csv` and join it locally or via GSQL with transactions to create `DeviceProfile` and `FROM_DEVICE` edges.
4. Read `closed_cases_history.csv` to populate historical memory in the graph.

## Graph Investigation Queries (GSQL)
To support MCP tools:
1. `txn_context`: Given `txn_id`, traverse to Card -> Customer, and to DeviceProfile/BillingRegion.
2. `customer_history`: Given `customer_id`, traverse to all Cards -> Transactions, ordered by `ts`.
3. `device_neighborhood`: Given `device_id`, traverse to Transactions -> Cards -> Customers to find shared compromised accounts.
4. `pattern_card_testing`: Given a `card_id`, traverse `NEXT_TXN` chains to find 3+ txns < $5 within 1 hour followed by a txn > $50.
