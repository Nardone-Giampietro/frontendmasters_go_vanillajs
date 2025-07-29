package models

import "time"

type User struct {
	ID            int64      `json:"id"`
	Name          string     `json:"name"`
	Email         string     `json:"email"`
	Password      string     `json:"password_hashed"`
	LastLogin     *time.Time `json:"last_login"`
	TimeCreated   time.Time  `json:"time_created"`
	TimeConfirmed *time.Time `json:"time_confirmed"`
	TimeDeleted   *time.Time `json:"time_deleted"`
	Favorites     []Movie
	Watchlist     []Movie
}
