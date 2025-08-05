package data

import (
	"github.com/go-webauthn/webauthn/webauthn"
	"nardone.xyz/frontendmasters/go-vanillajs/models"
)

type MovieStorage interface {
	GetTopMovies() ([]models.Movie, error)
	GetRandomMovies() ([]models.Movie, error)
	GetMovieById(id int) (models.Movie, error)
	GetMoviesByActorId(actorId int) ([]models.Movie, error)
	SearchMoviesByName(name string, oder string, genre *int) ([]models.Movie, error)
	GetAllGenres() ([]models.Genre, error)
	GetActorById(actorId int) (models.Actor, error)
}

type AccountStorage interface {
	Authenticate(string, string) (bool, error)
	DeleteAccount(string) (bool, error)
	Register(string, string, string) (bool, error)
	GetAccountDetails(string) (models.User, error)
	SaveCollection(models.User, int, string) (bool, error)
	RemoveFromCollection(models.User, int, string) (bool, error)
}

type PasskeyStore interface {
	GetUserByEmail(userName string) (*models.PasskeyUser, error)
	GetUserByID(ID int) (*models.PasskeyUser, error)
	SaveUser(models.PasskeyUser)
	// Session management that is useful for storing the state of the client while it is doing the challenge.
	GenSessionID() (string, error)
	GetSession(token string) (webauthn.SessionData, bool)
	SaveSession(token string, data webauthn.SessionData)
	DeleteSession(token string)
}
