package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"nardone.xyz/frontendmasters/go-vanillajs/data"
	"nardone.xyz/frontendmasters/go-vanillajs/handlers"
	"nardone.xyz/frontendmasters/go-vanillajs/logger"
)

func initializeLogger() *logger.Logger {
	logInstance, err := logger.NewLogger("movie.log")
	if err != nil {
		log.Fatalf("Failed to initialize logger %v", err)
	}
	defer logInstance.Close()
	return logInstance
}

func main() {
	// log Initializer
	logInstance := initializeLogger()

	// Env Initializer
	if err := godotenv.Load(); err != nil {
		log.Fatalf("No .env file was found.")
	}

	// Connect to DB
	dbConnStr := os.Getenv("DATABASE_URL")
	if dbConnStr == "" {
		log.Fatal("DATABASE_URL not set.")
	}
	db, err := sql.Open("postgres", dbConnStr)
	if err != nil {
		log.Fatalf("Failed to connect do the DB: %v", err)
	}
	defer db.Close()

	// Initialize Data Repository for Movie
	movieRepository, err := data.NewMovieRepository(db, logInstance)
	if err != nil {
		log.Fatalf("Failed to initialize Movie Data Repository: %v", err)
	}

	// Movie Initializer
	movieHandlers := handlers.MovieHandler{Storage: movieRepository, Logger: logInstance}

	http.HandleFunc("GET /api/movies/top", movieHandlers.GetTopMovies)
	http.HandleFunc("GET /api/movies/random", movieHandlers.GetRandomMovies)
	http.HandleFunc("GET /api/movies/search", movieHandlers.SearchMovies)
	http.HandleFunc("GET /api/movies/", movieHandlers.GetMovie)
	http.HandleFunc("GET /api/genres/", movieHandlers.GetGenres)

	catchAllClientRouteshandler := func(w http.ResponseWriter, r *http.Request) {
		// Si può fare una redirezione oppure inviare index.html
		// Se faccio una redirect allora l'utente andrebbe sulla pagina principale ogni
		// volta e non è la soluzione desiderata
		http.ServeFile(w, r, "./public/index.html")
	}
	http.HandleFunc("/movies", catchAllClientRouteshandler)
	http.HandleFunc("/movies/", catchAllClientRouteshandler)
	http.HandleFunc("/account/", catchAllClientRouteshandler)

	// Server the static folder public
	http.Handle("/", http.FileServer(http.Dir("public")))

	const address string = ":8080"
	err = http.ListenAndServe(address, nil)
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
		logInstance.Error("Server failed to start.", err)
	}
}
