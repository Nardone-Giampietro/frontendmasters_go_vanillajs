package main

import (
	"database/sql"
	"github.com/go-webauthn/webauthn/webauthn"
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
	if err := godotenv.Load("/home/nardone/Documents/GitHub/frontendmasters_go_vanillajs/.env"); err != nil {
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

	// Initialize Account Repository for User
	accountRepository, err := data.NewAccountRepository(db, logInstance)
	if err != nil {
		log.Fatalf("Failed to initialize Account Data Repository: %v", err)
	}

	// Movie Initializer
	movieHandlers := handlers.MovieHandler{Storage: movieRepository, Logger: logInstance}

	// User Initializer
	accountHandler := handlers.NewAccountHandler(accountRepository, logInstance)

	http.HandleFunc("GET /api/movies/top", movieHandlers.GetTopMovies)
	http.HandleFunc("GET /api/movies/random", movieHandlers.GetRandomMovies)
	http.HandleFunc("GET /api/movies/search", movieHandlers.SearchMovies)
	http.HandleFunc("GET /api/movies/", movieHandlers.GetMovie)
	http.HandleFunc("GET /api/actors/", movieHandlers.GetActorById)
	http.HandleFunc("GET /api/genres/", movieHandlers.GetGenres)
	http.HandleFunc("GET /api/movies/actor/", movieHandlers.GetMoviesByActorId)

	http.HandleFunc("POST /api/account/register/", accountHandler.Register)
	http.HandleFunc("POST /api/account/authenticate/", accountHandler.Authenticate)
	http.Handle("POST /api/account/delete/",
		accountHandler.AuthMiddleware(http.HandlerFunc(accountHandler.DeleteAccount)))

	// Favorites endpoints
	http.Handle("GET /api/account/favorite/",
		accountHandler.AuthMiddleware(http.HandlerFunc(accountHandler.GetFavorites)))
	// Watchlist endpoints
	http.Handle("GET /api/account/watchlist/",
		accountHandler.AuthMiddleware(http.HandlerFunc(accountHandler.GetWatchlist)))
	// Save to collection endpoints
	http.Handle("POST /api/account/save-to-collection/",
		accountHandler.AuthMiddleware(http.HandlerFunc(accountHandler.SaveToCollection)))
	// Remove from collection endpoints
	http.Handle("POST /api/account/delete-from-collection/",
		accountHandler.AuthMiddleware(http.HandlerFunc(accountHandler.RemoveFromCollection)))

	// Web Authentication - Passkeys
	// WebAuthn Handlers
	config := &webauthn.Config{
		RPDisplayName: "ReelingIt",
		RPID:          "localhost",
		RPOrigins:     []string{"http://localhost:8080"}, // si può usare una collezione di origins
	}

	var webAuthnManager *webauthn.WebAuthn

	if webAuthnManager, err = webauthn.New(config); err != nil {
		logInstance.Error("Error creating WebAuthn", err)
	}

	if err != nil {
		logInstance.Error("Error initialing Passkey engine", err)
	}

	passkeyRepo := data.NewPasskeyRepository(db, *logInstance)
	webAuthnHandler := handlers.NewWebAuthnHandler(passkeyRepo, logInstance, webAuthnManager)

	// Needs User Authentication (for passkey registration)
	http.Handle("/api/passkey/registration-begin",
		accountHandler.AuthMiddleware(http.HandlerFunc(webAuthnHandler.WebAuthnRegistrationBeginHandler)))
	http.Handle("/api/passkey/registration-end",
		accountHandler.AuthMiddleware(http.HandlerFunc(webAuthnHandler.WebAuthnRegistrationEndHandler)))
	// No need for User Authentication
	http.HandleFunc("/api/passkey/authentication-begin", webAuthnHandler.WebAuthnAuthenticationBeginHandler)
	http.HandleFunc("/api/passkey/authentication-end", webAuthnHandler.WebAuthnAuthenticationEndHandler)

	catchAllClientRouteshandler := func(w http.ResponseWriter, r *http.Request) {
		// Si può fare una redirezione oppure inviare index.html
		// Se faccio una redirect allora l'utente andrebbe sulla pagina principale ogni
		// volta e non è la soluzione desiderata
		http.ServeFile(w, r, "./public/index.html")
	}
	http.HandleFunc("/movies", catchAllClientRouteshandler)
	http.HandleFunc("/movies/", catchAllClientRouteshandler)
	http.HandleFunc("/actor/", catchAllClientRouteshandler)
	http.HandleFunc("/account/", catchAllClientRouteshandler)

	// Server the static folder public
	http.Handle("/", http.FileServer(http.Dir("public")))

	const address string = ":8080"
	err = http.ListenAndServe(address, nil)
	if err != nil {
		logInstance.Error("Server failed to start.", err)
		log.Fatalf("Server failed to start: %v", err)
	}
}
