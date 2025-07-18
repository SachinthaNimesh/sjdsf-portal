package models

import (
	"time"
)

type Student struct {
	ID                    uint64    `json:"id"`
	FirstName             string    `json:"first_name"`
	LastName              string    `json:"last_name"`
	DOB                   time.Time `json:"dob"`
	Gender                string    `json:"gender"`
	AddressLine1          string    `json:"address_line1"`
	AddressLine2          string    `json:"address_line2"`
	City                  string    `json:"city"`
	ContactNumber         string    `json:"contact_number"`
	ContactNumberGuardian string    `json:"contact_number_guardian"`
	SupervisorID          *uint     `json:"supervisor_id"`
	Remarks               string    `json:"remarks"`
	HomeLong              float64   `json:"home_long"`
	HomeLat               float64   `json:"home_lat"`
	EmployerID            *uint     `json:"employer_id"`
	CheckInTime           string    `json:"check_in_time"`
	CheckOutTime          string    `json:"check_out_time"`
}
