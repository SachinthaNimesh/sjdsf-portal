package models

import "time"

type EmergencyContact struct {
	ID          int       `json:"id" db:"id"`
	PhoneNumber string    `json:"phone_number" db:"phone_number"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}
