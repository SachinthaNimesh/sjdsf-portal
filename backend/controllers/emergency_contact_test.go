package controllers

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"server/database"
	"testing"
	"time"

	_ "modernc.org/sqlite"
)

func setupTestDB(t *testing.T) {
	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		t.Fatalf("failed to open test db: %v", err)
	}
	_, err = db.Exec(`CREATE TABLE emergency_contact (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		phone_number TEXT NOT NULL,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`)
	if err != nil {
		t.Fatalf("failed to create table: %v", err)
	}
	database.DB = db
}

func TestGetEmergencyContact_NotFound(t *testing.T) {
	setupTestDB(t)
	req := httptest.NewRequest(http.MethodGet, "/emergency-contact", nil)
	w := httptest.NewRecorder()

	GetEmergencyContact(w, req)

	resp := w.Result()
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusNotFound {
		t.Errorf("expected 404, got %d", resp.StatusCode)
	}
	var errResp ErrorResponse
	json.NewDecoder(resp.Body).Decode(&errResp)
	if errResp.Error == "" {
		t.Error("expected error message")
	}
}

func TestGetEmergencyContact_Found(t *testing.T) {
	setupTestDB(t)
	_, err := database.DB.Exec("INSERT INTO emergency_contact (phone_number) VALUES (?)", "1234567890")
	if err != nil {
		t.Fatalf("failed to insert: %v", err)
	}
	req := httptest.NewRequest(http.MethodGet, "/emergency-contact", nil)
	w := httptest.NewRecorder()

	GetEmergencyContact(w, req)

	resp := w.Result()
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
	var data map[string]string
	json.NewDecoder(resp.Body).Decode(&data)
	if data["phone_number"] != "1234567890" {
		t.Errorf("expected phone_number 1234567890, got %s", data["phone_number"])
	}
}

func TestUpdateEmergencyContact_Validation(t *testing.T) {
	setupTestDB(t)
	tests := []struct {
		body       string
		statusCode int
	}{
		{`{"phone_number":""}`, http.StatusBadRequest},
		{`{"phone_number":"123"}`, http.StatusBadRequest},
		{`{"phone_number":"123456789012345678901"}`, http.StatusBadRequest},
	}
	for _, tc := range tests {
		req := httptest.NewRequest(http.MethodPost, "/emergency-contact", bytes.NewBufferString(tc.body))
		w := httptest.NewRecorder()
		UpdateEmergencyContact(w, req)
		resp := w.Result()
		if resp.StatusCode != tc.statusCode {
			t.Errorf("expected %d, got %d for body %s", tc.statusCode, resp.StatusCode, tc.body)
		}
	}
}

func TestUpdateEmergencyContact_Success(t *testing.T) {
	setupTestDB(t)
	body := `{"phone_number":"0123456789"}`
	req := httptest.NewRequest(http.MethodPost, "/emergency-contact", bytes.NewBufferString(body))
	w := httptest.NewRecorder()
	UpdateEmergencyContact(w, req)
	resp := w.Result()
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
	var data map[string]string
	json.NewDecoder(resp.Body).Decode(&data)
	if data["phone_number"] != "0123456789" {
		t.Errorf("expected phone_number 0123456789, got %s", data["phone_number"])
	}
	// Check that only one record exists
	row := database.DB.QueryRow("SELECT phone_number, updated_at FROM emergency_contact")
	var phone string
	var updatedAt time.Time
	err := row.Scan(&phone, &updatedAt)
	if err != nil {
		t.Errorf("expected record in db, got error: %v", err)
	}
	if phone != "0123456789" {
		t.Errorf("expected phone_number 0123456789, got %s", phone)
	}
}
