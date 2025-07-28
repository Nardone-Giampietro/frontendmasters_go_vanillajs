import { HomePage } from "../components/HomePage.js";
import { MovieDetailsPage } from "../components/MovieDetailsPage.js";
import { MoviePage } from "../components/MoviePage.js";

export const routes = [
    {
        path: "/",
        componet: HomePage
    },
    {
        path: /\/movies\/(\d+)/,
        componet: MovieDetailsPage
    },
    {
        path: "/movies", // search result
        componet: MoviePage
    }
]