package models

import (
	"encoding/json"

	"github.com/google/uuid"
)

type TransactionModel struct {
	ID     uuid.UUID `json:"id" db:"id"`
	RefID  string    `json:"ref_id" db:"ref_id"`
	AltID  *string   `json:"alt_id" db:"alt_id"`
	Name   string    `json:"name" db:"name"`
	Active *bool     `json:"active" db:"active"`
}

type Transaction struct {
	ID                 uuid.UUID        `json:"id" db:"id"`
	EventID            uuid.UUID        `json:"event_id" db:"event_id"`
	TransactionModelID uuid.UUID        `json:"transaction_model_id" db:"transaction_model_id"`
	RefID              string           `json:"ref_id" db:"ref_id"`
	AltID              *string          `json:"alt_id" db:"alt_id"`
	Meta               *json.RawMessage `json:"meta" db:"meta"`
}
