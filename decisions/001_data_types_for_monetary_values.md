# ADR-001: Data Types for Monetary Values

* **Statu**: Accepted
* **Date**: 2025-07-06
* **By**: Alejandro Barrera Aponte <alebarrera76@gmail.com>

## Context
The ledger must handle a wide range of assets, including all world currencies, high-precision physical UOMs, and cryptocurrencies. A crucial decision is how to store these values to ensure precision, prevent rounding errors, and provide a sufficient range for all use cases, including hyperinflation. The primary options are storing values as integers (e.g., representing cents) or using a dedicated fixed-point decimal type.

## Decision
We will use the DECIMAL(38, 18) data type for all monetary and inventory amounts. The scale of 18 is adopted from the de facto standard set by Ethereum (ETH) and its tokens, ensuring broad crypto compatibility. The precision of 38 provides 20 digits for the integer part, offering a massive range capable of handling any conceivable economic scale.

## Consequences
Pros:

Exactness: DECIMAL is an exact numeric type, completely eliminating the floating-point rounding errors that make FLOAT/REAL types unsuitable for financial data.

Safety: The data's scale is handled by the database, removing the risk of application-level bugs where developers might forget to convert from an integer representation (e.g., cents to dollars).

Flexibility: This type natively supports the precision requirements for the vast majority of assets, from fiat currencies to crypto, without modification.

Cons:

Minor Overhead: DECIMAL(38, 18) uses slightly more storage and may be marginally slower for calculations than a simple BIGINT. This trade-off is considered negligible in the context of modern hardware and the massive benefit of guaranteed accuracy and safety.