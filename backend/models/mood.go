package models

import (
	"time"
)

type Mood struct {
	ID         int       `json:"id"`
	StudentID  int       `json:"student_id"`
	RecordedAt time.Time `json:"recorded_at"`
	Emotion    string    `json:"emotion"`
	IsDaily    bool      `json:"is_daily"`
}
