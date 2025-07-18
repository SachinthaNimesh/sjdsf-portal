package models

import "time"

// EmployeeTable represents the model for the query result
type EmployeeModel struct {
	StudentID       int        `json:"student_id"`
	StudentName     string     `json:"student_name"`
	StudentContact  string     `json:"student_contact"`
	EmployerID      *int       `json:"employer_id,omitempty"`
	EmployerName    *string    `json:"employer_name,omitempty"`
	EmployerContact *string    `json:"employer_contact,omitempty"`
	EmployerAddress *string    `json:"employer_address,omitempty"`
	SupervisorID    *int       `json:"supervisor_id,omitempty"`
	SupervisorName  *string    `json:"supervisor_name,omitempty"`
	LatestOTPCode   *string    `json:"latest_otp_code,omitempty"`
	ExpiresAt       *time.Time `json:"expires_at,omitempty"`
}
