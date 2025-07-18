package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func ConnectDB() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️ Could not load .env file, relying on system environment variables")
	}

	// Fetching database credentials from environment variables
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")
	sslrootcert := "./config/ca.pem"

	if host == "" || user == "" || password == "" || dbname == "" || port == "" {
		log.Fatal("❌ Database connection environment variables are not set properly")
	}

	// Define DSN connection string with SSL root certificate
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=verify-ca sslrootcert=%s",
		host,
		user,
		password,
		dbname,
		port,
		sslrootcert,
	)

	log.Println("ℹ️ Attempting to connect to the database...")

	// Open a new database connection
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		log.Fatalf("❌ Failed to ping database: %v", err)
	}

	log.Println("✅ Database connection established successfully!")

	DB = db
	log.Println("✅ Database connected successfully!")
}

// Initialize sets up the database connection
func Initialize(connectionString string) {
	var err error

	DB, err = sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database connection established")
}
