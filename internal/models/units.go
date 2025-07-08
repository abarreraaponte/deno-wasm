package models

import (
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type UnitType struct {
	ID         uuid.UUID  `json:"id" db:"id"`
	RefID      string     `json:"ref_id" db:"ref_id"`
	AltID      *string    `json:"alt_id" db:"alt_id"`
	Name       string     `json:"name" db:"name"`
	BaseUnitID *uuid.UUID `json:"base_unit_id" db:"base_unit_id"`
}

type Unit struct {
	ID                 uuid.UUID `json:"id" db:"id"`
	RefID              string    `json:"ref_id" db:"ref_id"`
	AltID              *string   `json:"alt_id" db:"alt_id"`
	UnitTypeID         uuid.UUID `json:"unit_type_id" db:"unit_type_id"`
	Name               string    `json:"name" db:"name"`
	Symbol             *string   `json:"symbol" db:"symbol"`
	Precision          *int32    `json:"precision" db:"precision"`
	DecimalSeparator   string    `json:"decimal_separator" db:"decimal_separator"`
	ThousandsSeparator string    `json:"thousands_separator" db:"thousands_separator"`
	Active             *bool     `json:"active" db:"active"`
}

type ConversionRate struct {
	ID         uuid.UUID       `json:"id" db:"id"`
	FromUnitID uuid.UUID       `json:"from_unit_id" db:"from_unit_id"`
	ToUnitID   uuid.UUID       `json:"to_unit_id" db:"to_unit_id"`
	Rate       decimal.Decimal `json:"rate" db:"rate"`
}
