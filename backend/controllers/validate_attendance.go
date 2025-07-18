package controllers

import (
	"encoding/json"
	"math"
	"net/http"
	"time"
)

// AttendancePayload represents the incoming payload
type AttendancePayload struct {
	CheckType         string    `json:"check_type"` // "checkin" or "checkout"
	ScheduledCheckIn  time.Time `json:"scheduled_check_in"`
	ScheduledCheckOut time.Time `json:"scheduled_check_out"`
	ActualCheckIn     time.Time `json:"actual_check_in"`
	ActualCheckOut    time.Time `json:"actual_check_out"`
}

// AttendanceValidationResponse represents the response
type AttendanceValidationResponse struct {
	MinutesDifference int `json:"minutes_difference"`
}

// GetTimeDifferenceInMinutes calculates the difference in minutes between scheduled and actual time
func GetTimeDifferenceInMinutes(payload AttendancePayload) int {
	var scheduled, actual time.Time

	if payload.CheckType == "checkin" {
		scheduled = payload.ScheduledCheckIn
		actual = payload.ActualCheckIn
	} else if payload.CheckType == "checkout" {
		scheduled = payload.ScheduledCheckOut
		actual = payload.ActualCheckOut
	} else {
		return 0 // or handle error
	}

	diff := actual.Sub(scheduled).Minutes()
	return int(math.Round(diff))
}

// ValidateAttendanceHandler handles the /validate-attendance endpoint
func ValidateAttendanceHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		studentID := r.Header.Get("student-id")
		if studentID == "" {
			http.Error(w, "student-id header is required", http.StatusBadRequest)
			return
		}

		var payload AttendancePayload
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, "Invalid payload", http.StatusBadRequest)
			return
		}

		// You can use studentID here for logging, validation, or DB operations if needed

		minutesDiff := GetTimeDifferenceInMinutes(payload)
		resp := AttendanceValidationResponse{
			MinutesDifference: minutesDiff,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}
