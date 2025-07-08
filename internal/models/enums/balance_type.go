package enums

import (
	"database/sql/driver"
	"fmt"
)

type BalanceType string

const (
	BalanceTypeDebit  BalanceType = "debit"
	BalanceTypeCredit BalanceType = "credit"
)

func (bt *BalanceType) Scan(value interface{}) error {
	if value == nil {
		*bt = ""
		return nil
	}
	if bv, err := driver.String.ConvertValue(value); err == nil {
		if v, ok := bv.(string); ok {
			*bt = BalanceType(v)
			return nil
		}
	}
	return fmt.Errorf("cannot scan %T into BalanceType", value)
}

func (bt BalanceType) Value() (driver.Value, error) {
	return string(bt), nil
}
