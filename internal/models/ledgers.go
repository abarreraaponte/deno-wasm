package models

import (
	"encoding/json"

	"kitledger/internal/models/enums"

	"github.com/google/uuid"
)

type Ledger struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	RefID       string     `json:"ref_id" db:"ref_id"`
	AltID       *string    `json:"alt_id" db:"alt_id"`
	Name        string     `json:"name" db:"name"`
	Description *string    `json:"description" db:"description"`
	UnitTypeID  *uuid.UUID `json:"unit_type_id" db:"unit_type_id"`
	Active      *bool      `json:"active" db:"active"`
}

type Account struct {
	ID          uuid.UUID          `json:"id" db:"id"`
	RefID       string             `json:"ref_id" db:"ref_id"`
	AltID       *string            `json:"alt_id" db:"alt_id"`
	BalanceType *enums.BalanceType `json:"balance_type" db:"balance_type"`
	LedgerID    uuid.UUID          `json:"ledger_id" db:"ledger_id"`
	ParentID    *uuid.UUID         `json:"parent_id" db:"parent_id"`
	Name        string             `json:"name" db:"name"`
	Meta        *json.RawMessage   `json:"meta" db:"meta"`
	Active      *bool              `json:"active" db:"active"`
}

type Dimension struct {
	ID            uuid.UUID  `json:"id" db:"id"`
	EntryID       uuid.UUID  `json:"entry_id" db:"entry_id"`
	EntityModelID *uuid.UUID `json:"entity_model_id" db:"entity_model_id"`
	EntityID      uuid.UUID  `json:"entity_id" db:"entity_id"`
}
