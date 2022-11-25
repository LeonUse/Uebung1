package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

var err error
var DB *sql.DB

type Rezept struct {
	ID        int     `json:"id"`
	Name      string  `json:"name"`
	Dauer     float32 `json:"dauer"`
	Kosten    float32 `json:"kosten"`
	Anleitung string  `json:"anleitung"`
}

type Pagination struct {
	Start       int `json:"start"`
	NumberItems int `json:"numberItems"`
}

type Filter struct {
	NumberItems   int    `json:"numberItems"`
	Start         int    `json:"start"`
	Field         string `json:"field"`
	Sort          string `json:"sort"`
	ColumnField   string `json:"columnField"`
	OperatorValue string `json:"operatorValue"`
	FilterValue   string `json:"filterValue"`
}

func ConnectDB() {
	db, err := sql.Open("mysql", "root:@tcp(localhost)/uebung1")
	if err != nil {
		fmt.Println("Error Connecting Database")
	}
	fmt.Println("Sucessfully connected to Database")
	DB = db
}
func RespondWithError(w http.ResponseWriter, code int, msg string) error {
	log.Println("Responding with error", msg)
	return RespondWithJSON(w, code, map[string]string{"error": msg})
}

func RespondWithJSON(w http.ResponseWriter, code int, payload interface{}) error {
	response, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	SetCors(w)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
	return nil

}

func SetCors(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE, UPDATE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, token, X-Requested-With")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
}

func HandleOptions(w http.ResponseWriter, r *http.Request) {
	SetCors(w)
	w.WriteHeader(200)
}

func getRezepte(w http.ResponseWriter, r *http.Request) {
	fmt.Println("getRezepte aufgerufen")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
	rows, err := DB.Query("SELECT * FROM rezepte")
	if err != nil {
		fmt.Println("Fehler bei getRezepte:", err)
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()
	// Create a new `Bird` instance to hold our query results
	rezepte := make([]Rezept, 0)
	rezept := Rezept{}
	// the retrieved columns in our row are written to the provided addresses
	// the arguments should be in the same order as the columns defined in
	// our query
	for rows.Next() {
		if err := rows.Scan(&rezept.ID, &rezept.Name, &rezept.Dauer, &rezept.Kosten, &rezept.Anleitung); err != nil {
			RespondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}
		rezepte = append(rezepte, rezept)
	}
	if err := rows.Err(); err != nil {
		fmt.Println("Fehler bei getRezepte:", err)
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	RespondWithJSON(w, http.StatusOK, rezepte)
}

func deleteRezepte(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
	query := r.URL.Query()
	id := strings.Join(query["id"], ",")
	fmt.Println("id:", id)
	err = nil
	sql := fmt.Sprintf("DELETE FROM rezepte WHERE id IN (%s)", id)
	fmt.Println("sql:", sql)
	_, err := DB.Exec(sql)
	if err != nil {
		log.Println("Fehler bei deleteRezept mit id:", id, err)
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	RespondWithJSON(w, http.StatusOK, err)
}

func createRezepte(w http.ResponseWriter, r *http.Request) {
	fmt.Println("create wurde aufgerufen")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
	rezept := Rezept{}
	json.NewDecoder(r.Body).Decode(&rezept)
	fmt.Println("Body:", rezept)
	err = nil
	_, err := DB.Exec("INSERT INTO rezepte (name, dauer, kosten, anleitung) VALUES(?,?,?,?)", rezept.Name, rezept.Dauer, rezept.Kosten, rezept.Anleitung)
	if err != nil {
		log.Println("Fehler bei createRezept:", rezept, err)
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	RespondWithJSON(w, http.StatusOK, err)
}

func updateRezept(w http.ResponseWriter, r *http.Request) {
	fmt.Println("update wurde aufgerufen")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE, UPDATE")
	rezept := Rezept{}
	json.NewDecoder(r.Body).Decode(&rezept)
	fmt.Println("Body:", rezept)
	err = nil
	sql := "UPDATE rezepte SET name = ?, dauer = ?, kosten = ?, anleitung = ? WHERE id = ?"
	fmt.Println("SQL:", sql)
	_, err := DB.Exec(sql, rezept.Name, rezept.Dauer, rezept.Kosten, rezept.Anleitung, rezept.ID)
	if err != nil {
		log.Println("Fehler bei updateRezept:", rezept, err)
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	RespondWithJSON(w, http.StatusOK, err)
}

func getRezeptePage(w http.ResponseWriter, r *http.Request) {
	fmt.Println("getRezeptePage aufgerufen")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")

	filter := Filter{}
	startQuery := "SELECT * FROM rezepte"
	json.NewDecoder(r.Body).Decode(&filter)
	fmt.Println("Body Filter:", filter)

	//Alle Operatoren für Texte
	if filter.OperatorValue == "contains" {
		filter := " WHERE " + filter.ColumnField + " like \"%" + filter.FilterValue + "%\""
		startQuery = startQuery + filter
	}

	if filter.OperatorValue == "equals" {
		filter := " WHERE " + filter.ColumnField + " = \"" + filter.FilterValue + "\""
		startQuery = startQuery + filter
	}

	if filter.OperatorValue == "startsWith" {
		filter := " WHERE " + filter.ColumnField + " like \"" + filter.FilterValue + "%\""
		startQuery = startQuery + filter
	}

	if filter.OperatorValue == "endsWith" {
		filter := " WHERE " + filter.ColumnField + " like \"%" + filter.FilterValue + "\""
		startQuery = startQuery + filter
	}

	//Alle Operatoren für Zahlen
	if filter.FilterValue == "" {
		filter.FilterValue = "0"
	}
	if filter.OperatorValue == "=" || filter.OperatorValue == "<" || filter.OperatorValue == ">" || filter.OperatorValue == "<=" || filter.OperatorValue == ">=" || filter.OperatorValue == "!=" {
		filter := " WHERE " + filter.ColumnField + " " + filter.OperatorValue + " " + filter.FilterValue
		startQuery = startQuery + filter
	}

	if filter.Sort != "" {
		sort := " ORDER BY " + filter.Field + " " + filter.Sort
		startQuery = startQuery + sort
	}

	rezepte := make([]Rezept, 0)
	rezept := Rezept{}

	fmt.Println("Query:", startQuery+" LIMIT "+strconv.FormatInt(int64(filter.NumberItems), 10)+" OFFSET "+strconv.FormatInt(int64(filter.Start), 10))

	rows, err := DB.Query(startQuery + " LIMIT " + strconv.FormatInt(int64(filter.NumberItems), 10) + " OFFSET " + strconv.FormatInt(int64(filter.Start), 10))

	if err != nil {
		fmt.Println("Fehler bei getRezeptePage:", err)
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	for rows.Next() {
		if err := rows.Scan(&rezept.ID, &rezept.Name, &rezept.Dauer, &rezept.Kosten, &rezept.Anleitung); err != nil {
			RespondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}
		rezepte = append(rezepte, rezept)
	}
	if err := rows.Err(); err != nil {
		fmt.Println("Fehler bei getRezeptePage:", err)
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	RespondWithJSON(w, http.StatusOK, rezepte)
}

func countItems(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
	var counter int
	err := DB.QueryRow("SELECT COUNT(*) FROM rezepte").Scan(&counter)
	if err != nil {
		log.Println("Fehler bei countItems:", err)
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	RespondWithJSON(w, http.StatusOK, counter)
}
