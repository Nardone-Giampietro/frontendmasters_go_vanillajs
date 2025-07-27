package data

import "nardone.xyz/frontendmasters/go-vanillajs/models"

type MovieStorage interface {
	GetTopMovies() ([]models.Movie, error)
	GetRandomMovies() ([]models.Movie, error)
	GetMovieById(id int) (models.Movie, error)
	SearchMoviesByName(name string, oder string, genre *int) ([]models.Movie, error)
	GetAllGenres() ([]models.Genre, error)
}
