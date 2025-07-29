import { HomePage } from "../components/HomePage.js";
import { MovieDetailsPage } from "../components/MovieDetailsPage.js";
import { MoviesPage } from "../components/MoviesPage.js";
import { RegistrationPage } from "../components/RegistrationPage.js";
import {LoginPage} from "../components/LoginPage.js";

export const routes = [
    {
        path: "/",
        component: HomePage
    },
    {
        path: /\/movies\/(\d+)/,
        component: MovieDetailsPage
    },
    {
        path: "/movies", // search result
        component: MoviesPage
    },
    {
        path: "/account/register", // search result
        component: RegistrationPage
    },
    {
        path: "/account/login", // search result
        component: LoginPage
    }
]