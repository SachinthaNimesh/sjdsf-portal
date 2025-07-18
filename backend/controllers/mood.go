package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"server/database"
	"server/models"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

// GetMoods godoc
// @Summary Get all moods
// @Description Get all moods
// @Tags moods
// @Produce json
// @Success 200 {array} models.Mood
// @Failure 500 {string} string "Internal Server Error"
// @Router /moods [get]
func GetMoods(w http.ResponseWriter, r *http.Request) {
	var moods []models.Mood
	rows, err := database.DB.Query("SELECT id, student_id, recorded_at, emotion, is_daily FROM mood")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var m models.Mood
		if err := rows.Scan(&m.ID, &m.StudentID, &m.RecordedAt, &m.Emotion, &m.IsDaily); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		moods = append(moods, m)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(moods)
}

// GetMood godoc
// @Summary Get a mood by ID
// @Description Get a mood by ID
// @Tags moods
// @Produce json
// @Param id path int true "Mood ID"
// @Success 200 {object} models.Mood
// @Failure 404 {string} string "Not Found"
// @Router /moods/{id} [get]
func GetMood(w http.ResponseWriter, r *http.Request) {
	StudentIDHeader := r.Header.Get("student-id")
	if StudentIDHeader == "" {
		log.Println("Missing student-id header")
		http.Error(w, "Missing student-id header", http.StatusBadRequest)
		return
	}
	studentID, err := strconv.Atoi(StudentIDHeader)
	if err != nil {
		log.Printf("Invalid student-id header: %v", err)
		http.Error(w, "Invalid student-id header", http.StatusBadRequest)
		return
	}
	vars := mux.Vars(r)
	id := vars["id"]
	var mood models.Mood
	err = database.DB.QueryRow("SELECT id, student_id, recorded_at, emotion, is_daily FROM mood WHERE id = $1 AND student_id = $2", id, studentID).Scan(&mood.ID, &mood.StudentID, &mood.RecordedAt, &mood.Emotion, &mood.IsDaily)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mood)
}

// CreateMood godoc
// @Summary Create a new mood
// @Description Create a new mood
// @Tags moods
// @Accept json
// @Produce json
// @Param mood body models.Mood true "Mood"
// @Success 201 {object} models.Mood
// @Failure 400 {string} string "Bad Request"
// @Failure 500 {string} string "Internal Server Error"
// @Router /moods [post]
func CreateMood(w http.ResponseWriter, r *http.Request) {
	StudentIDHeader := r.Header.Get("student-id")
	if StudentIDHeader == "" {
		log.Println("Missing student-id header")
		http.Error(w, "Missing student-id header", http.StatusBadRequest)
		return
	}
	studentID, err := strconv.Atoi(StudentIDHeader)
	if err != nil {
		log.Printf("Invalid student-id header: %v", err)
		http.Error(w, "Invalid student-id header", http.StatusBadRequest)
		return
	}
	var payload struct {
		Emotion string `json:"emotion"`
		IsDaily bool   `json:"is_daily"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	mood := models.Mood{
		StudentID:  studentID,
		Emotion:    payload.Emotion,
		IsDaily:    payload.IsDaily,
		RecordedAt: time.Now(),
	}
	query := "INSERT INTO mood (student_id, emotion, is_daily, recorded_at) VALUES ($1, $2, $3, $4) RETURNING id"
	err = database.DB.QueryRow(query, mood.StudentID, mood.Emotion, mood.IsDaily, mood.RecordedAt).Scan(&mood.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error creating mood: %v", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mood)
}
