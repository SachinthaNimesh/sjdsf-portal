package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

const (
	sheetID = "1LmvPIp-Ixdvur80OKFQ7Dm31QB1KpjOZDAstUWLkK-o"
	rangeA1 = "Sheet1!A1:Z100"
)

type FeedbackResponse map[string]string

type googleSheetResponse struct {
	Values [][]string `json:"values"`
}

func getEnv(key string) string {
	return os.Getenv(key)
}

func FetchManagerFeedback(w http.ResponseWriter, r *http.Request) {
	apiKey := getEnv("GOOGLE_SHEET_API_KEY")
	if apiKey == "" {
		http.Error(w, "Google Sheets API key not configured", http.StatusInternalServerError)
		return
	}

	url := fmt.Sprintf(
		"https://sheets.googleapis.com/v4/spreadsheets/%s/values/%s?key=%s",
		sheetID, rangeA1, apiKey,
	)

	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "Failed to fetch Google Sheet data", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		http.Error(w, fmt.Sprintf("Google Sheets API error: %s", resp.Status), resp.StatusCode)
		return
	}

	var sheet googleSheetResponse
	if err := json.NewDecoder(resp.Body).Decode(&sheet); err != nil {
		http.Error(w, "Failed to decode Google Sheet response", http.StatusInternalServerError)
		return
	}

	if len(sheet.Values) < 2 {
		json.NewEncoder(w).Encode([]FeedbackResponse{})
		return
	}

	headers := sheet.Values[0]
	rows := sheet.Values[1:]

	var responses []FeedbackResponse
	for _, row := range rows {
		respMap := FeedbackResponse{}
		for idx, header := range headers {
			if idx < len(row) {
				respMap[header] = row[idx]
			} else {
				respMap[header] = ""
			}
		}
		responses = append(responses, respMap)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(responses)
}
