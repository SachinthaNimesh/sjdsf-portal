package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"server/database"
)

type Attendance struct {
	CheckIn  time.Time  `json:"check_in_date_time"`
	CheckOut *time.Time `json:"check_out_date_time"`
}

type Mood struct {
	Emotion    string    `json:"emotion"`
	RecordedAt time.Time `json:"recorded_at"`
}

type EmployeeSummary struct {
	Attendances []Attendance `json:"attendances"`
	Remarks     string       `json:"remarks"`
	Moods       []Mood       `json:"moods"`
}

func GetEmployeeSummary(w http.ResponseWriter, r *http.Request) {
	idStr := r.Header.Get("student-id")
	if idStr == "" {
		http.Error(w, `{"error":"Missing student-id header"}`, http.StatusBadRequest)
		return
	}
	studentID, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, `{"error":"Invalid student-id header"}`, http.StatusBadRequest)
		return
	}

	summary := EmployeeSummary{}

	// 1. Last 5 attendance records (before today)
	rows, err := database.DB.Query(
		`SELECT check_in_date_time, check_out_date_time FROM attendance WHERE student_id = $1 AND DATE(check_in_date_time) < CURRENT_DATE ORDER BY check_in_date_time DESC LIMIT 5`,
		studentID,
	)
	if err != nil {
		http.Error(w, `{"error":"Failed to fetch attendance"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var att Attendance
		var checkOut sql.NullTime
		if err := rows.Scan(&att.CheckIn, &checkOut); err != nil {
			http.Error(w, `{"error":"Failed to scan attendance"}`, http.StatusInternalServerError)
			return
		}
		if checkOut.Valid {
			att.CheckOut = &checkOut.Time
		}
		summary.Attendances = append(summary.Attendances, att)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, `{"error":"Failed to fetch attendance"}`, http.StatusInternalServerError)
		return
	}

	// 2. Remarks
	var remarks sql.NullString
	err = database.DB.QueryRow(`SELECT remarks FROM student WHERE id = $1`, studentID).Scan(&remarks)
	if err != nil && err != sql.ErrNoRows {
		http.Error(w, `{"error":"Failed to fetch remarks"}`, http.StatusInternalServerError)
		return
	}
	if remarks.Valid {
		summary.Remarks = remarks.String
	}

	// 3. Last 5 daily mood entries
	rows, err = database.DB.Query(
		`SELECT emotion, recorded_at FROM mood WHERE student_id = $1 AND is_daily = true ORDER BY recorded_at ASC LIMIT 5`,
		studentID,
	)
	if err != nil {
		http.Error(w, `{"error":"Failed to fetch moods"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var m Mood
		if err := rows.Scan(&m.Emotion, &m.RecordedAt); err != nil {
			http.Error(w, `{"error":"Failed to scan moods"}`, http.StatusInternalServerError)
			return
		}
		summary.Moods = append(summary.Moods, m)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, `{"error":"Failed to fetch moods"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(summary)
}
