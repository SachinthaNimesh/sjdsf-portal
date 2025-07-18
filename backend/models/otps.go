package models

import (
	"time"
)

// OTP represents an OTP code for authentication
type OTP struct {
	ID        uint      `json:"id"`
	StudentID int       `json:"student_id"`
	OTPCode   string    `json:"otp_code"`
	CreatedAt time.Time `json:"created_at"`
	ExpiresAt time.Time `json:"expires_at"`
	IsUsed    bool      `json:"is_used"`
}

// OTPRequest is used for OTP generation <@WEB DASHBOARD>
type OTPRequest struct {
	StudentID int `json:"student_id"`
}

// OTPResponse is returned after OTP generation <@WEB DASHBOARD>
type OTPResponse struct {
	StudentID int       `json:"student_id"`
	OTPCode   string    `json:"otp_code"`
	ExpiresAt time.Time `json:"expires_at"`
}

// OTPValidationRequest is used when validating OTP from a mobile app
type OTPValidationRequest struct {
	OTPCode string `json:"otp_code"`
}

// OTPValidationResponse is returned after successful OTP validation
type OTPValidationResponse struct {
	Success    bool   `json:"success"`
	StudentID  int    `json:"student_id"`
	SecretCode string `json:"secret_code,omitempty"`
	Message    string `json:"message,omitempty"`
}
