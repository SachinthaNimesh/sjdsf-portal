package models

import "time"

type AuthorizedDevice struct {
	ID         uint      `json:"id"`
	StudentID  int       `json:"student_id"`
	SecretCode string    `json:"secret_code"`
	CreatedAt  time.Time `json:"created_at"`
}

func (AuthorizedDevice) TableName() string {
	return "authorized_devices"
}

type AuthRequest struct {
	StudentID  int    `json:"student_id"`
	SecretCode string `json:"secret_code"`
}
