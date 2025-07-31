package routes

import (
	"server/controllers"

	"github.com/gorilla/mux"
)

func RegisterStudentRoutes(router *mux.Router) {
	router.HandleFunc("/get-students", controllers.GetStudents).Methods("GET")

	router.HandleFunc("/create-employee", controllers.CreateStudent).Methods("POST")
	router.HandleFunc("/update-employee", controllers.UpdateStudent).Methods("PUT")
	router.HandleFunc("/delete-employee", controllers.DeleteStudent).Methods("DELETE")

	router.HandleFunc("/get-student", controllers.GetStudent).Methods("GET")

	//supervisor routes
	router.HandleFunc("/get-supervisors", controllers.GetSupervisors).Methods("GET")
	router.HandleFunc("/get-supervisor", controllers.GetSupervisor).Methods("GET")
	router.HandleFunc("/create-supervisor", controllers.CreateSupervisor).Methods("POST")
	router.HandleFunc("/update-supervisor", controllers.UpdateSupervisor).Methods("PUT")
	router.HandleFunc("/delete-supervisor", controllers.DeleteSupervisor).Methods("DELETE")

	// employer routes
	router.HandleFunc("/get-employers", controllers.GetAllEmployerIDsAndNames).Methods("GET")
	router.HandleFunc("/create-employer", controllers.CreateEmployer).Methods("POST")
	router.HandleFunc("/get-employer", controllers.GetEmployer).Methods("GET")
	router.HandleFunc("/update-employer", controllers.UpdateEmployer).Methods("PUT")
	router.HandleFunc("/delete-employer", controllers.DeleteEmployer).Methods("DELETE")
	router.HandleFunc("/get-employer-ids", controllers.GetAllEmployerIDsAndNames).Methods("GET")

	// Add attendance routes
	router.HandleFunc("/attendance", controllers.PostAttendance).Methods("POST")

	// Add mood routes
	router.HandleFunc("/post-mood", controllers.CreateMood).Methods("POST")
	router.HandleFunc("/get-mood", controllers.GetMoods).Methods("GET")

	// Add card routes
	router.HandleFunc("/dashboard", controllers.GetStudentDetails).Methods("GET")

	router.HandleFunc("/employees", controllers.GetEmployeeData).Methods("GET")
	router.HandleFunc("/management", controllers.GetManagementTable).Methods("GET")
	router.HandleFunc("/trainee-profile", controllers.GetTraineeProfile).Methods("GET")

	router.HandleFunc("/get-supervisor-ids", controllers.GetAllSupervisorIDsAndNames).Methods("GET")
	// router.HandleFunc("/get-employer-ids", controllers.GetAllEmployerIDsAndNames).Methods("GET")

	// Manager feedback route
	router.HandleFunc("/manager-feedback", controllers.FetchManagerFeedback).Methods("GET")

	// Emergency contact routes
	router.HandleFunc("/get-emergency-contact", controllers.GetEmergencyContact).Methods("GET")
	router.HandleFunc("/update-emergency-contact", controllers.UpdateEmergencyContact).Methods("POST")
}
