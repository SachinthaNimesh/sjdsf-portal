package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"server/database"
	"server/models"
)

func GetSupervisors(w http.ResponseWriter, r *http.Request) {
	var supervisors []models.Supervisor
	rows, err := database.DB.Query("SELECT supervisor_id, first_name, last_name, email_address, contact_number FROM supervisor")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var s models.Supervisor
		if err := rows.Scan(&s.SupervisorID, &s.FirstName, &s.LastName, &s.EmailAddress, &s.ContactNumber); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		supervisors = append(supervisors, s)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(supervisors)
}

func GetSupervisor(w http.ResponseWriter, r *http.Request) {
	supervisorIDStr := r.Header.Get("supervisor-id")
	id, err := strconv.Atoi(supervisorIDStr)
	if err != nil {
		http.Error(w, "Invalid supervisor ID", http.StatusBadRequest)
		return
	}
	var s models.Supervisor
	err = database.DB.QueryRow("SELECT supervisor_id, first_name, last_name, email_address, contact_number FROM supervisor WHERE supervisor_id = $1", id).Scan(&s.SupervisorID, &s.FirstName, &s.LastName, &s.EmailAddress, &s.ContactNumber)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s)
}

func CreateSupervisor(w http.ResponseWriter, r *http.Request) {
	var s models.Supervisor
	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	query := `INSERT INTO supervisor (first_name, last_name, email_address, contact_number) VALUES ($1, $2, $3, $4) RETURNING supervisor_id`
	err := database.DB.QueryRow(query, s.FirstName, s.LastName, s.EmailAddress, s.ContactNumber).Scan(&s.SupervisorID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s)
}

func UpdateSupervisor(w http.ResponseWriter, r *http.Request) {
	supervisorIDStr := r.Header.Get("supervisor-id")
	id, err := strconv.Atoi(supervisorIDStr)
	if err != nil {
		http.Error(w, "Invalid supervisor ID", http.StatusBadRequest)
		return
	}
	var s models.Supervisor
	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	query := `UPDATE supervisor SET first_name=$1, last_name=$2, email_address=$3, contact_number=$4 WHERE supervisor_id=$5`
	_, err = database.DB.Exec(query, s.FirstName, s.LastName, s.EmailAddress, s.ContactNumber, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	s.SupervisorID = id
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s)
}

func DeleteSupervisor(w http.ResponseWriter, r *http.Request) {
	supervisorIDStr := r.Header.Get("supervisor-id")
	id, err := strconv.Atoi(supervisorIDStr)
	if err != nil {
		http.Error(w, "Invalid supervisor ID", http.StatusBadRequest)
		return
	}
	_, err = database.DB.Exec("DELETE FROM supervisor WHERE supervisor_id = $1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func GetAllSupervisorIDsAndNames(w http.ResponseWriter, r *http.Request) {
	type SupervisorIDName struct {
		SupervisorID uint64 `json:"supervisor_id"`
		FirstName    string `json:"first_name"`
		LastName     string `json:"last_name"`
	}
	rows, err := database.DB.Query("SELECT supervisor_id, first_name, last_name FROM supervisor")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	var supervisors []SupervisorIDName
	for rows.Next() {
		var s SupervisorIDName
		if err := rows.Scan(&s.SupervisorID, &s.FirstName, &s.LastName); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		supervisors = append(supervisors, s)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(supervisors)
}
