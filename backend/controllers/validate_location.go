//TODO
// employer and the other models are updated

package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"net/http"
	"os"
	"server/database"
)

type LocationResponse struct {
	EmployerLong    float64 `json:"employer_long"`
	EmployerLat     float64 `json:"employer_lat"`
	StudentLong     float64 `json:"student_long"`
	StudentLat      float64 `json:"student_lat"`
	InRange         bool    `json:"in_range"`
	DrivingDistance int     `json:"driving_distance_meters,omitempty"`
	Displacement    int     `json:"displacement_meters,omitempty"`
}

// Google Distance Matrix API response struct (partial)
type googleDistanceMatrixResponse struct {
	Rows []struct {
		Elements []struct {
			Distance struct {
				Value int `json:"value"`
			} `json:"distance"`
			Status string `json:"status"`
		} `json:"elements"`
	} `json:"rows"`
	Status string `json:"status"`
}

func getGoogleDistance(lat1, lon1, lat2, lon2 float64) (int, error) {
	apiKey := os.Getenv("GOOGLE_MAPS_API_KEY")
	if apiKey == "" {
		return 0, fmt.Errorf("google Maps API key not set")
	}
	url := fmt.Sprintf(
		"https://maps.googleapis.com/maps/api/distancematrix/json?origins=%f,%f&destinations=%f,%f&key=%s",
		lat1, lon1, lat2, lon2, apiKey,
	)
	resp, err := http.Get(url)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}
	var apiResp googleDistanceMatrixResponse
	if err := json.Unmarshal(body, &apiResp); err != nil {
		return 0, err
	}
	if apiResp.Status != "OK" ||
		len(apiResp.Rows) == 0 ||
		len(apiResp.Rows[0].Elements) == 0 ||
		apiResp.Rows[0].Elements[0].Status != "OK" {
		return 0, fmt.Errorf("google API error or no route found")
	}
	return apiResp.Rows[0].Elements[0].Distance.Value, nil
}

// Haversine formula to calculate straight-line distance in meters
func haversine(lat1, lon1, lat2, lon2 float64) int {
	const R = 6371000 // Earth radius in meters
	toRad := func(deg float64) float64 { return deg * (3.141592653589793 / 180) }
	dLat := toRad(lat2 - lat1)
	dLon := toRad(lon2 - lon1)
	lat1Rad := toRad(lat1)
	lat2Rad := toRad(lat2)

	a := (sin(dLat/2) * sin(dLat/2)) +
		(cos(lat1Rad) * cos(lat2Rad) * sin(dLon/2) * sin(dLon/2))
	c := 2 * atan2(sqrt(a), sqrt(1-a))
	return int(R * c)
}

func sin(x float64) float64      { return math.Sin(x) }
func cos(x float64) float64      { return math.Cos(x) }
func atan2(y, x float64) float64 { return math.Atan2(y, x) }
func sqrt(x float64) float64     { return math.Sqrt(x) }

func ValidateLocationHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		studentID := r.Header.Get("student-id")
		if studentID == "" {
			http.Error(w, "student_id is required", http.StatusBadRequest)
			return
		}

		query := `
			SELECT 
				e.addr_long AS employer_long,
				e.addr_lat AS employer_lat,
				s.home_long AS student_long,
				s.home_lat AS student_lat
			FROM 
				employer AS e
			INNER JOIN 
				student AS s 
			ON 
				e.id = s.employer_id
			WHERE s.id = $1
			LIMIT 1
		`

		var resp LocationResponse
		err := database.DB.QueryRow(query, studentID).Scan(
			&resp.EmployerLong,
			&resp.EmployerLat,
			&resp.StudentLong,
			&resp.StudentLat,
		)
		if err == sql.ErrNoRows {
			http.Error(w, "No data found", http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}

		// Use Google Distance Matrix API for driving distance
		drivingDistance, err := getGoogleDistance(resp.EmployerLat, resp.EmployerLong, resp.StudentLat, resp.StudentLong)
		if err != nil {
			http.Error(w, "Failed to get distance from Google API: "+err.Error(), http.StatusInternalServerError)
			return
		}
		resp.DrivingDistance = drivingDistance

		// Calculate displacement (straight-line distance)
		resp.Displacement = haversine(resp.EmployerLat, resp.EmployerLong, resp.StudentLat, resp.StudentLong)

		resp.InRange = drivingDistance <= 500

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	}
}
