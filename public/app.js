import { HomePage } from "./components/HomePage.js";
import { API } from "./services/API.js";
import { MovieDetailsPage } from "./components/MovieDetailsPage.js";
import './components/YouTubeEmbed.js';
import './components/AnimatedLoading.js';
import { Router } from './services/Router.js';

window.addEventListener("DOMContentLoaded", (event) => {
    app.Router.init();
});

window.app = {
    Router: Router,
    search: (event) => {
        event.preventDefault();
        const keywords = document.querySelector("input[type=search]").value;
        // TODO
    },
    api : API
}