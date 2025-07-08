package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Event struct {
	ID        uuid.UUID        `json:"id" db:"id"`
	ParentID  *uuid.UUID       `json:"parent_id" db:"parent_id"`
	EventType string           `json:"event_type" db:"event_type"`
	Payload   *json.RawMessage `json:"payload" db:"payload"`
	CreatedAt *time.Time       `json:"created_at" db:"created_at"`
}

type Entry struct {
	ID              uuid.UUID       `json:"id" db:"id"`
	TransactionID   uuid.UUID       `json:"transaction_id" db:"transaction_id"`
	LedgerID        uuid.UUID       `json:"ledger_id" db:"ledger_id"`
	EventID         uuid.UUID       `json:"event_id" db:"event_id"`
	DebitAccountID  uuid.UUID       `json:"debit_account_id" db:"debit_account_id"`
	CreditAccountID uuid.UUID       `json:"credit_account_id" db:"credit_account_id"`
	UnitID          uuid.UUID       `json:"unit_id" db:"unit_id"`
	Value           decimal.Decimal `json:"value" db:"value"`
	Date            time.Time       `json:"date" db:"date"`
}
