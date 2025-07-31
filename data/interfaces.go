package data

import "nardone.xyz/frontendmasters/go-vanillajs/models"

type MovieStorage interface {
	GetTopMovies() ([]models.Movie, error)
	GetRandomMovies() ([]models.Movie, error)
	GetMovieById(id int) (models.Movie, error)
	SearchMoviesByName(name string, oder string, genre *int) ([]models.Movie, error)
	GetAllGenres() ([]models.Genre, error)
}

type AccountStorage interface {
	Authenticate(string, string) (bool, error)
	DeleteAccount(string) (bool, error)
	Register(string, string, string) (bool, error)
	GetAccountDetails(string) (models.User, error)
	SaveCollection(models.User, int, string) (bool, error)
	RemoveFromCollection(models.User, int, string) (bool, error)
}
