# ADR-002: Balance Calculation and Caching Strategy
* **Status**: Accepted
* **Date**: 2025-07-06
* **By**: Alejandro Barrera Aponte <alebarrera76@gmail.com>

## Context
Account balances must be available for reads, including both the current balance and historical "as of" balances. The entries table serves as the immutable ledger, containing all debit and credit movements. Calculating a balance by aggregating this table on every request can be slow and resource-intensive, especially for accounts with extensive histories.

## Decision
The single source of truth for all balances is the entries table. Balances will be calculated on-demand by aggregating credits and debits for a given account.

To solve the read-performance problem, the calculated balance will be cached in a high-performance, external key-value store (e.g., Redis). When a new entry is posted for an account, the application logic is responsible for invalidating the old cached balance and storing the newly calculated one. Historical "as of" queries will bypass the cache and run the aggregation directly against the database. The events table records system-level occurrences but is not used for financial transaction aggregation.

## Consequences
Pros:

Authoritative Ledger: The entries table remains the pure, auditable source of truth. It's impossible for a balance to be inconsistent with the transactions that comprise it.

Fast Reads: Current balance lookups are served from the cache, providing extremely high performance.

Flexible Reporting: The system natively supports "as of" balance reporting by running aggregations directly on the entries table.

Cons:

Increased Complexity: The application must manage cache invalidation logic. This introduces another moving part to the system.

Cache Inconsistency Risk: There's a potential for the cache to become stale if the invalidation logic fails, though this can be mitigated with Time-To-Live (TTL) policies and other recovery mechanisms.