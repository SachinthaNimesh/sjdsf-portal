package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"server/database"
	"server/models"

	"github.com/gorilla/mux"
)

// CreateEmployer godoc
// @Summary Create a new employer
// @Description Create a new employer with the input payload
// @Tags employers
// @Accept json
// @Produce json
//
//	@Param employer body struct {
//		Name          string  `json:"name"`
//		ContactNumber string  `json:"contact_number"`
//		AddressLine1  string  `json:"address_line_1"`
//		AddressLine2  string  `json:"address_line_2"`
//		AddressLine3  string  `json:"address_line_3"`
//		Longitude     float64 `json:"addr_long"`
//		Latitude      float64 `json:"addr_lat"`
//	} true "Employer input"
//
// @Success 200 {object} models.Employer
// @Failure 400 {string} string "Bad Request"
// @Failure 500 {string} string "Internal Server Error"
// @Router /employers [post]
func CreateEmployer(w http.ResponseWriter, r *http.Request) {
	var employerInput struct {
		Name          string  `json:"name"`
		ContactNumber string  `json:"contact_number"`
		AddressLine1  string  `json:"address_line_1"`
		AddressLine2  string  `json:"address_line_2"`
		AddressLine3  string  `json:"address_line_3"`
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

// GetEmployer godoc
// @Summary Get an employer by ID
// @Description Get details of an employer by ID
// @Tags employers
// @Produce json
// @Param id path int true "Employer ID"
// @Success 200 {object} models.Employer
// @Failure 400 {string} string "Invalid ID"
// @Failure 404 {string} string "Employer not found"
// @Failure 500 {string} string "Internal Server Error"
// @Router /employers/{id} [get]
func GetEmployer(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
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

// UpdateEmployer godoc
// @Summary Update an employer by ID
// @Description Update details of an employer by ID
// @Tags employers
// @Accept json
// @Produce json
// @Param id path int true "Employer ID"
//
//	@Param employer body struct {
//		Name          string  `json:"name"`
//		ContactNumber string  `json:"contact_number"`
//		AddressLine1  string  `json:"address_line1"`
//		AddressLine2  string  `json:"address_line2"`
//		AddressLine3  string  `json:"address_line3"`
//		Longitude     float64 `json:"addr_long"`
//		Latitude      float64 `json:"addr_lat"`
//	} true "Employer input"
//
// @Success 200 {object} models.Employer
// @Failure 400 {string} string "Invalid ID"
// @Failure 404 {string} string "Employer not found"
// @Failure 500 {string} string "Internal Server Error"
// @Router /employers/{id} [put]
func UpdateEmployer(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}
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

// DeleteEmployer godoc
// @Summary Delete an employer by ID
// @Description Delete an employer by ID
// @Tags employers
// @Param id path int true "Employer ID"
// @Success 204 {string} string "No Content"
// @Failure 400 {string} string "Invalid ID"
// @Failure 500 {string} string "Internal Server Error"
// @Router /employers/{id} [delete]
func DeleteEmployer(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
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

// GetAllEmployerIDsAndNames godoc
// @Summary Get all employer IDs and names
// @Description Returns a list of all employer IDs and their names
// @Tags employers
// @Produce json
// @Success 200 {array} object
// @Router /employers/ids-names [get]
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
