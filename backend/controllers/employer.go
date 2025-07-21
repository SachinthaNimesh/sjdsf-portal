package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"server/database"
	"server/models"
)

func CreateEmployer(w http.ResponseWriter, r *http.Request) {
	var employerInput struct {
		Name          string  `json:"name"`
		ContactNumber string  `json:"contact_number"`
		AddressLine1  string  `json:"address_line1"`
		AddressLine2  string  `json:"address_line2"`
		AddressLine3  string  `json:"address_line3"`
		Longitude     float64 `json:"addr_long"`
		Latitude      float64 `json:"addr_lat"`
	}
	if err := json.NewDecoder(r.Body).Decode(&employerInput); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	var employer models.Employer
	err := database.DB.QueryRow(
		`INSERT INTO employer (name, contact_number, address_line1, address_line2, address_line3, addr_long, addr_lat)
		VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, contact_number, address_line1, address_line2, address_line3, addr_long, addr_lat`,
		employerInput.Name, employerInput.ContactNumber, employerInput.AddressLine1, employerInput.AddressLine2, employerInput.AddressLine3, employerInput.Longitude, employerInput.Latitude,
	).Scan(&employer.ID, &employer.Name, &employer.ContactNumber, &employer.AddressLine1, &employer.AddressLine2, &employer.AddressLine3, &employer.Longitude, &employer.Latitude)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(employer)
}

func GetEmployer(w http.ResponseWriter, r *http.Request) {
	idStr := r.Header.Get("employer-id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid employer-id header", http.StatusBadRequest)
		return
	}
	var employer models.Employer
	err = database.DB.QueryRow(
		`SELECT id, name, contact_number, address_line1, address_line2, address_line3, addr_long, addr_lat FROM employer WHERE id = $1`,
		id,
	).Scan(&employer.ID, &employer.Name, &employer.ContactNumber, &employer.AddressLine1, &employer.AddressLine2, &employer.AddressLine3, &employer.Longitude, &employer.Latitude)
	if err == sql.ErrNoRows {
		http.Error(w, "Employer not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(employer)
}

func UpdateEmployer(w http.ResponseWriter, r *http.Request) {
	idStr := r.Header.Get("employer-id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid employer-id header", http.StatusBadRequest)
		return
	}
	var employerInput struct {
		Name          string  `json:"name"`
		ContactNumber string  `json:"contact_number"`
		AddressLine1  string  `json:"address_line1"` // changed from address_line1 (already correct)
		AddressLine2  string  `json:"address_line2"` // changed from address_line2 (already correct)
		AddressLine3  string  `json:"address_line3"` // changed from address_line3 (already correct)
		Longitude     float64 `json:"addr_long"`
		Latitude      float64 `json:"addr_lat"`
	}
	if err := json.NewDecoder(r.Body).Decode(&employerInput); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	res, err := database.DB.Exec(
		`UPDATE employer SET name = $1, contact_number = $2, address_line1 = $3, address_line2 = $4, address_line3 = $5, addr_long = $6, addr_lat = $7 WHERE id = $8`,
		employerInput.Name, employerInput.ContactNumber, employerInput.AddressLine1, employerInput.AddressLine2, employerInput.AddressLine3, employerInput.Longitude, employerInput.Latitude, id,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		http.Error(w, "Employer not found", http.StatusNotFound)
		return
	}
	// Return the updated employer
	var employer models.Employer
	err = database.DB.QueryRow(
		`SELECT id, name, contact_number, address_line1, address_line2, address_line3, addr_long, addr_lat FROM employer WHERE id = $1`,
		id,
	).Scan(&employer.ID, &employer.Name, &employer.ContactNumber, &employer.AddressLine1, &employer.AddressLine2, &employer.AddressLine3, &employer.Longitude, &employer.Latitude)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(employer)
}

func DeleteEmployer(w http.ResponseWriter, r *http.Request) {
	idStr := r.Header.Get("employer-id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid employer-id header", http.StatusBadRequest)
		return
	}
	res, err := database.DB.Exec(`DELETE FROM employer WHERE id = $1`, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		http.Error(w, "Employer not found", http.StatusNotFound)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func GetAllEmployerIDsAndNames(w http.ResponseWriter, r *http.Request) {
	type EmployerIDName struct {
		ID   uint64 `json:"id"`
		Name string `json:"name"`
	}
	rows, err := database.DB.Query(`SELECT id, name FROM employer`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	var employers []EmployerIDName
	for rows.Next() {
		var e EmployerIDName
		if err := rows.Scan(&e.ID, &e.Name); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		employers = append(employers, e)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(employers)
}
