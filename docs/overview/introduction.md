# Framework for Transactional Software

## Overview

In a society that has become increasingly more transactional, we need systems that can process operations reliably at scale, while remaining highly auditable and flexible but without becoming incomprehensible giant monoliths that are had to maintain and evolve. 

Double entry accounting provides a solid structure on top of which a set of sophisticated software tools can be crafted that implement this ideas.

## Core Benefits

1. **Immutable Audit Trail**
   - Every transaction is permanent and traceable
   - Complete history of all system changes
   - Built-in support for compliance and auditing

2. **Guaranteed Consistency**
   - Double-entry principle ensures balanced transactions
   - Prevents data inconsistencies and reconciliation issues
   - Mathematical verification of system integrity

3. **Scalable Performance**
   - Optimized for high-throughput transaction processing
   - Efficient querying and reporting
   - Designed for horizontal scaling

4. **Linked Ledgers**
   - Support for multiple coordinated ledgers within an organization
   - Currency-specific ledgers for international operations
   - Parent-child entity relationship support
   - Cross-ledger transaction tracing and reconciliation

5. **Customizable Workflows and Automation**
   - Configurable approval workflows
   - Automated transaction routing and processing
   - Event-driven integrations
   - Customizable business rules and validations

6. **Flexible Integration**
   - Self-hostable solution
   - Comprehensive SDK support
   - RESTful API interface

## Use Cases

### 1. Loyalty Points System
Track customer reward points and their monetary value.

| Field | Value |
|-------|--------|
| ref_id | POINTS-EARN-001 |
| ledger_id | loyalty-program-main |
| debit_account_id | customer-123-points |
| credit_account_id | points-liability |
| amount | 50.00 |
| dimensions | `{"subsidiary": "retail-div", "region": "northeast", "channel": "online"}` |

### 2. International Sales (Linked Ledgers Example)
Store a sale transaction that affects both USD and EUR ledgers with automatic currency conversion.

EUR Ledger Entry:

| Field | Value |
|-------|--------|
| ref_id | SALE-2024-001-EUR |
| ledger_id | europe-sales-eur |
| debit_account_id | accounts-receivable-eur |
| credit_account_id | sales-revenue-eur |
| amount | 100000.00 |
| linked_ref | SALE-2024-001-USD |
| dimensions | `{"subsidiary": "acme-europe", "region": "eu", "business_unit": "enterprise"}` |

USD Ledger Entry:

| Field | Value |
|-------|--------|
| ref_id | SALE-2024-001-USD |
| ledger_id | global-consolidated-usd |
| debit_account_id | accounts-receivable-usd |
| credit_account_id | sales-revenue-usd |
| amount | 108500.00 |
| linked_ref | SALE-2024-001-EUR |
| dimensions | `{"subsidiary": "acme-europe", "region": "eu", "business_unit": "enterprise"}` |

### 3. Supply Chain Inventory
Track movement of materials and products through supply chain.

| Field | Value |
|-------|--------|
| ref_id | RECV-2024-001 |
| ledger_id | supply-chain-main |
| debit_account_id | warehouse-a-inventory |
| credit_account_id | in-transit-inventory |
| amount | 25000.00 |
| quantity | 1000 |
| product_id | widget-sku-123 |
| uom_id | units |
| dimensions | `{"subsidiary": "acme-logistics", "location": "warehouse-a", "business_unit": "electronics"}` |

### 4. Carbon Accounting
Track and manage carbon credits, emissions, and offsets across organizations.

| Field | Value |
|-------|--------|
| ref_id | EMISSION-2024-001 |
| ledger_id | carbon-accounting-main |
| debit_account_id | facility-a-emissions |
| credit_account_id | corporate-carbon-liability |
| amount | 2550.00 |
| quantity | 25.5 |
| product_id | ghg-co2 |
| uom_id | metric-tons |
| dimensions | `{"subsidiary": "acme-manufacturing", "location": "plant-a", "cost_center": "production", "business_unit": "polymers"}` |

### 5. Time Banking
Track exchange of services based on time with standard hourly rates.

| Field | Value |
|-------|--------|
| ref_id | TIME-XFER-001 |
| ledger_id | timebank-community-1 |
| debit_account_id | recipient-john-doe |
| credit_account_id | provider-jane-smith |
| amount | 75.00 |
| dimensions | `{"location": "portland", "region": "northwest", "project": "community-services"}` |

### 6. Document Version Control
Track document revisions and associated costs.

| Field | Value |
|-------|--------|
| ref_id | DOC-UPDATE-001 |
| ledger_id | document-management |
| debit_account_id | current-version |
| credit_account_id | version-history |
| amount | 250.00 |
| dimensions | `{"department": "legal", "cost_center": "compliance", "project": "contract-revision"}` |

### 7. Healthcare Resource Management
Track medical supplies and equipment usage.

| Field | Value |
|-------|--------|
| ref_id | MED-SUPPLY-001 |
| ledger_id | hospital-inventory |
| debit_account_id | ward-a-supplies |
| credit_account_id | central-storage |
| amount | 475.00 |
| quantity | 50 |
| product_id | surgical-masks-n95 |
| uom_id | units |
| dimensions | `{"subsidiary": "metro-healthcare", "location": "main-campus", "department": "surgery"}` |

### 8. Cloud Resource Usage
Track cloud computing costs.

| Field | Value |
|-------|--------|
| ref_id | CLOUD-USAGE-001 |
| ledger_id | cloud-resources |
| debit_account_id | project-a-consumption |
| credit_account_id | available-resources |
| amount | 96.00 |
| dimensions | `{"cost_center": "it-ops", "project": "data-analytics", "business_unit": "research"}` |

### 9. Water Rights Management
Track water allocation and associated costs.

| Field | Value |
|-------|--------|
| ref_id | WATER-ALLOC-001 |
| ledger_id | water-rights |
| debit_account_id | farm-a-allocation |
| credit_account_id | river-basin-available |
| amount | 5000.00 |
| dimensions | `{"region": "colorado-basin", "business_unit": "agriculture", "project": "irrigation"}` |

### 10. Software License Management
Track software license costs and allocations.

| Field | Value |
|-------|--------|
| ref_id | LICENSE-ASSIGN-001 |
| ledger_id | software-licenses |
| debit_account_id | engineering-dept |
| credit_account_id | license-pool |
| amount | 3000.00 |
| dimensions | `{"department": "engineering", "cost_center": "development", "location": "hq"}` |

### 11. Carbon Offset Trading
Track carbon offset credit trades and their monetary value.

| Field | Value |
|-------|--------|
| ref_id | OFFSET-TRADE-001 |
| ledger_id | carbon-market |
| debit_account_id | buyer-portfolio |
| credit_account_id | seller-portfolio |
| amount | 25000.00 |
| dimensions | `{"subsidiary": "green-investments", "region": "latam", "project": "reforestation"}` |

### 12. Employee Time Allocation
Track billable hours and project costs.

| Field | Value |
|-------|--------|
| ref_id | TIME-ALLOC-001 |
| ledger_id | time-tracking |
| debit_account_id | project-x-budget |
| credit_account_id | employee-time-pool |
| amount | 800.00 |
| dimensions | `{"department": "engineering", "cost_center": "development", "project": "client-portal"}` |

## Technical Features

1. **Multi-tenancy Architecture**
   - Designed for containerized deployment
   - Complete tenant isolation through separate instances
   - Self-hostable in AWS, GCP, OCI, and other cloud providers
   - Full data sovereignty for each organization

2. **Multiple Ledger Support**
   - Separate ledgers for different currencies
   - Parent-child organization structure support
   - Consolidated reporting across ledgers
   - Cross-ledger transaction tracking

3. **Workflow Engine**
   - Configurable approval chains
   - Conditional routing rules
   - Status tracking and notifications
   - Integration with external systems

4. **Flexible Dimensioning**
   - Standardized accounting segments
   - Consistent reporting structure

5. **Product Integration**
   - Optional product tracking
   - Support for multiple product types

6. **Units of Measurement**
   - Standardized unit tracking
   - Conversion support