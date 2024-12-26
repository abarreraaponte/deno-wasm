# Account
* Fundamental unit of accounting.
* Can represent a product, a service, an asset, a tax code
* Can be simple or complex, depending on the use case being resolved with each ledger.
* Can be flat or hierarchical.
* Must have a balance_type, which basically indicates if the balances for the account increases as a debit or credit. Useful for defining basic accounting categories.
* The balance type must be defined only at the first layer, as child accounts in the hierarchy absolutely must inherit the balance type from the top level.