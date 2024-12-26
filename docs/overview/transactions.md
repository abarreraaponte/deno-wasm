# Transactions

## Transaction Model
* Base archetype for a transaction. Defines fields, properties and configuration options. 
* Invoices, Inventory Adjustments, for instance are examples of different transaction models as their purpose and details are different by definition.

## Transaction
* Represents a single operation that can generate multiple entries.
* All entries from the transaction must be balanced

## Entries
* It's the fundamental block for the whole system.
* Represents an accounting movement.

The following two options were presented as the base way to store entries into the system.

### Entries Table Structure (Simplified)

| Debit Account | Credit Account | Amount |
|---|---|---|
| AR | REVENUE | 90 |
| AR | VAT | 10 |
| COGS | INVENTORY | 40 |