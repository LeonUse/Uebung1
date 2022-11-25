package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func handleRequests() {
	r := mux.NewRouter().StrictSlash(true)
	r.Methods("OPTIONS").HandlerFunc(HandleOptions)
	r.HandleFunc("/getRezepte", getRezepte).Methods("GET")
	r.HandleFunc("/getRezeptePage", getRezeptePage).Methods("POST")
	r.HandleFunc("/deleteRezepte", deleteRezepte).Methods("DELETE")
	r.HandleFunc("/createRezepte", createRezepte).Methods("POST")
	r.HandleFunc("/updateRezept", updateRezept).Methods("PATCH")
	r.HandleFunc("/countItems", countItems).Methods("GET")
	r.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		t, _ := route.GetPathTemplate()
		m, _ := route.GetMethods()
		name := route.GetName()
		log.Printf("%-6v %v (%v)\n", m, t, name)
		return nil
	})
	fmt.Println("start api on port 9000")
	log.Fatal(http.ListenAndServe("127.0.0.1:9000", r))
	fmt.Println("server shutdown")
}

func main() {
	ConnectDB()
	handleRequests()
}
