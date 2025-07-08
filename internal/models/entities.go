package models

import (
	"encoding/json"

	"github.com/google/uuid"
)

type EntityModel struct {
	ID     uuid.UUID `json:"id" db:"id"`
	RefID  string    `json:"ref_id" db:"ref_id"`
	AltID  *string   `json:"alt_id" db:"alt_id"`
	Name   string    `json:"name" db:"name"`
	Active *bool     `json:"active" db:"active"`
}

type Entity struct {
	ID            uuid.UUID        `json:"id" db:"id"`
	EntityModelID uuid.UUID        `json:"entity_model_id" db:"entity_model_id"`
	ParentID      *uuid.UUID       `json:"parent_id" db:"parent_id"`
	RefID         string           `json:"ref_id" db:"ref_id"`
	AltID         *string          `json:"alt_id" db:"alt_id"`
	Name          string           `json:"name" db:"name"`
	Meta          *json.RawMessage `json:"meta" db:"meta"`
}
