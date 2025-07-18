package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"server/database"
	"server/models"
	"strconv"
)

// GetTraineeProfile handles the request to get a trainee's profile information
func GetTraineeProfile(w http.ResponseWriter, r *http.Request) {
	log.Println("Received trainee profile request")

	// Get student ID from header
	studentIDHeader := r.Header.Get("student-id")
	if studentIDHeader == "" {
		log.Println("Missing student-id header")
		http.Error(w, "Missing student-id header", http.StatusBadRequest)
		return
	}

	studentID, err := strconv.Atoi(studentIDHeader)
	if err != nil {
		log.Printf("Invalid student-id header: %v", err)
		http.Error(w, "Invalid student-id header", http.StatusBadRequest)
		return
	}

	log.Printf("Processing trainee profile for student ID: %d", studentID)

	// Fetch student info
	var student models.Student
	err = database.DB.QueryRow("SELECT id, first_name, last_name, dob, gender, address_line1, address_line2, city, contact_number, contact_number_guardian, supervisor_id, remarks, home_long, home_lat, employer_id, check_in_time, check_out_time FROM student WHERE id = $1", studentID).Scan(&student.ID, &student.FirstName, &student.LastName, &student.DOB, &student.Gender, &student.AddressLine1, &student.AddressLine2, &student.City, &student.ContactNumber, &student.ContactNumberGuardian, &student.SupervisorID, &student.Remarks, &student.HomeLong, &student.HomeLat, &student.EmployerID, &student.CheckInTime, &student.CheckOutTime)
	if err != nil {
		log.Printf("Failed to find student: %v", err)
		http.Error(w, "Student not found", http.StatusNotFound)
		return
	}

	// Fetch employer name
	var employerName string
	if student.EmployerID != nil && *student.EmployerID > 0 {
		var employer models.Employer
		err = database.DB.QueryRow("SELECT name FROM employer WHERE id = $1", *student.EmployerID).Scan(&employer.Name)
		if err != nil {
			log.Printf("Error fetching employer data: %v", err)
			// Continue execution even if employer data can't be fetched
		} else {
			employerName = employer.Name
		}
	}

	// Fetch recent moods
	var recentMoods []models.Mood
	rows, err := database.DB.Query("SELECT id, student_id, recorded_at, emotion, is_daily FROM mood WHERE student_id = $1 AND is_daily = true ORDER BY recorded_at DESC LIMIT 5", studentID)
	if err != nil {
		log.Printf("Error fetching mood data: %v", err)
		// Continue execution even if mood data can't be fetched
	} else {
		defer rows.Close()
		for rows.Next() {
			var m models.Mood
			if err := rows.Scan(&m.ID, &m.StudentID, &m.RecordedAt, &m.Emotion, &m.IsDaily); err != nil {
				log.Printf("Error scanning mood row: %v", err)
				continue
			}
			recentMoods = append(recentMoods, m)
		}
	}

	// Fetch recent attendance
	var recentAttendanceRecords []struct {
		ScheduledCheckIn  string `json:"scheduled_check_in"`
		ScheduledCheckOut string `json:"scheduled_check_out"`
		ActualCheckIn     string `json:"actual_check_in"`
		ActualCheckOut    string `json:"actual_check_out"`
	}

	query := `
		SELECT 
			s.check_in_time AS scheduled_check_in,
			s.check_out_time AS scheduled_check_out,
			a.check_in_date_time AS actual_check_in,
			a.check_out_date_time AS actual_check_out
		FROM student s
		JOIN attendance a ON s.id = a.student_id
		WHERE s.id = $1
		ORDER BY a.check_in_date_time DESC
		LIMIT 5`

	rows, err = database.DB.Query(query, studentID)
	if err != nil {
		log.Printf("Error fetching attendance data: %v", err)
		// Continue execution even if attendance data can't be fetched
	} else {
		defer rows.Close()
		for rows.Next() {
			var rec struct {
				ScheduledCheckIn  string `json:"scheduled_check_in"`
				ScheduledCheckOut string `json:"scheduled_check_out"`
				ActualCheckIn     string `json:"actual_check_in"`
				ActualCheckOut    string `json:"actual_check_out"`
			}
			if err := rows.Scan(&rec.ScheduledCheckIn, &rec.ScheduledCheckOut, &rec.ActualCheckIn, &rec.ActualCheckOut); err != nil {
				log.Printf("Error scanning attendance row: %v", err)
				continue
			}
			recentAttendanceRecords = append(recentAttendanceRecords, rec)
		}
	}

	// Prepare response
	studentInfo := struct {
		FirstName             string `json:"first_name"`
		LastName              string `json:"last_name"`
		Gender                string `json:"gender"`
		ContactNumber         string `json:"contact_number"`
		ContactNumberGuardian string `json:"contact_number_guardian"`
		Remarks               string `json:"remarks"`
		EmployerName          string `json:"employer_name,omitempty"`
	}{
		FirstName:             student.FirstName,
		LastName:              student.LastName,
		Gender:                student.Gender,
		ContactNumber:         student.ContactNumber,
		ContactNumberGuardian: student.ContactNumberGuardian,
		Remarks:               student.Remarks,
		EmployerName:          employerName,
	}

	response := struct {
		StudentInfo      interface{} `json:"student_info"`
		RecentMoods      interface{} `json:"recent_moods"`
		RecentAttendance interface{} `json:"recent_attendance"`
	}{
		StudentInfo:      studentInfo,
		RecentMoods:      recentMoods,
		RecentAttendance: recentAttendanceRecords,
	}

	log.Println("Successfully processed request, sending response")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
