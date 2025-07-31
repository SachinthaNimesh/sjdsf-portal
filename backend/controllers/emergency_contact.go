package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"server/database"
	"server/models"
	"strings"
)

// ErrorResponse for consistent error messages
type ErrorResponse struct {
	Error string `json:"error"`
}

// Get the current emergency contact
func GetEmergencyContact(w http.ResponseWriter, r *http.Request) {
	var contact models.EmergencyContact
	err := database.DB.QueryRow("SELECT id, phone_number, updated_at FROM emergency_contact ORDER BY id DESC LIMIT 1").Scan(&contact.ID, &contact.PhoneNumber, &contact.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(ErrorResponse{Error: "No emergency contact found"})
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(ErrorResponse{Error: "Database error"})
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"phone_number": contact.PhoneNumber,
	})
}

// Update emergency contact (replaces the existing one)
func UpdateEmergencyContact(w http.ResponseWriter, r *http.Request) {
	var request struct {
		PhoneNumber string `json:"phone_number"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Invalid request body"})
		return
	}

	// Validate phone number
	request.PhoneNumber = strings.TrimSpace(request.PhoneNumber)
	if request.PhoneNumber == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Phone number cannot be empty"})
		return
	}

	if len(request.PhoneNumber) < 10 || len(request.PhoneNumber) > 20 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Phone number must be between 10-20 characters"})
		return
	}

	tx, err := database.DB.Begin()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Database error"})
		return
	}
	defer tx.Rollback()

	// Clear existing contacts
	_, err = tx.Exec("DELETE FROM emergency_contact")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to clear existing contact"})
		return
	}

	// Insert new contact
	_, err = tx.Exec(
		"INSERT INTO emergency_contact (phone_number) VALUES ($1)",
		request.PhoneNumber,
	)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to insert new contact"})
		return
	}

	if err = tx.Commit(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to commit transaction"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message":      "Emergency contact replaced successfully",
		"phone_number": request.PhoneNumber,
	})
}
