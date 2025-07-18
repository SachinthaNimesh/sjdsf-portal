package models

type Supervisor struct {
	SupervisorID  int    `json:"supervisor_id"`
	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	EmailAddress  string `json:"email_address"`
	ContactNumber string `json:"contact_number"`
}
