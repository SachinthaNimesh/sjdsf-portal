package models

import "time"

type Profile struct {
	// Student details
	StudentID       int    `json:"student_id"`
	StudentName     string `json:"student_name"`
	GuardianContact string `json:"contact_number_guardian"`
	Remarks         string `json:"remarks"`
	Photo           string `json:"photo"`

	// Employer details
	EmployerName    string `json:"employer_name"`
	EmployerContact string `json:"employer_contact"`

	// Attendance records (last 5 days)
	AttendanceDate time.Time `json:"attendance_date"`
	CheckInTime    time.Time `json:"check_in_time"`
	CheckOutTime   time.Time `json:"check_out_time"`

	// Mood trend (last 5 days)
	Emotion  string    `json:"emotion"`
	MoodDate time.Time `json:"mood_date"`
}
