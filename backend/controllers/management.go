package controllers

import (
	"encoding/json"
	"net/http"
	"server/database"
)

// Response struct for the joined data
type StudentEmployerSupervisor struct {
	StudentID               uint    `json:"student_id"`
	StudentFirstName        string  `json:"student_first_name"`
	StudentLastName         *string `json:"student_last_name"`
	EmployerName            *string `json:"employer_name"`
	EmployerContactNumber   *string `json:"employer_contact_number"`
	SupervisorFirstName     *string `json:"supervisor_first_name"`
	SupervisorLastName      *string `json:"supervisor_last_name"`
	SupervisorContactNumber *string `json:"supervisor_contact_number"`
}

// Handler to get the joined data
func GetManagementTable(w http.ResponseWriter, r *http.Request) {
	var results []StudentEmployerSupervisor

	// Raw SQL for the LEFT JOINs
	query := `
		SELECT
			s.id AS student_id,
			s.first_name AS student_first_name,
			s.last_name AS student_last_name,
			e.name AS employer_name,
			e.contact_number AS employer_contact_number,
			sup.first_name AS supervisor_first_name,
			sup.last_name AS supervisor_last_name,
			sup.contact_number AS supervisor_contact_number
		FROM student AS s
		LEFT JOIN employer AS e ON s.employer_id = e.id
		LEFT JOIN supervisor AS sup ON s.supervisor_id = sup.supervisor_id
	`

	rows, err := database.DB.Query(query)
	if err != nil {
		http.Error(w, "Failed to fetch data", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var res StudentEmployerSupervisor
		if err := rows.Scan(
			&res.StudentID,
			&res.StudentFirstName,
			&res.StudentLastName,
			&res.EmployerName,
			&res.EmployerContactNumber,
			&res.SupervisorFirstName,
			&res.SupervisorLastName,
			&res.SupervisorContactNumber,
		); err != nil {
			http.Error(w, "Failed to scan data", http.StatusInternalServerError)
			return
		}
		results = append(results, res)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}
