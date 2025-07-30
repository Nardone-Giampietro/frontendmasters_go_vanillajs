import { API } from "./services/API.js";
import './components/YouTubeEmbed.js';
import './components/AnimatedLoading.js';
import './components/RegistrationPage.js'
import { Router } from './services/Router.js';
import proxiedStore from "./services/Store.js";
import Store from "./services/Store.js";

window.addEventListener("DOMContentLoaded", (event) => {
    app.Router.init();
});

window.app = {
    Router: Router,
    Store : proxiedStore,
    api : API,
    showError: (message="There was an error.", goToHome=false) => {
        document.getElementById("alert-modal").showModal();
        document.querySelector("#alert-modal p").textContent = message;
        if (goToHome){
            app.Router.go("/");
        }
    },
    closeError: () => {
        document.getElementById("alert-modal").close();
    },
    search: (event) => {
        event.preventDefault();
        const keywords = document.querySelector("input[type=search]").value;
        app.Router.go("/movies?q=" + keywords);
    },
    searchFilterChange: (genre) => {
        const urlParams = new URLSearchParams(window.location.search);
        const order = urlParams.get("order") ?? "";
        const q = urlParams.get("q") ?? "";
        app.Router.go("/movies?q="  + q + "&order=" + order + "&genre=" + genre);
    },
    searchOrderChange: (order) => {
        const urlParams = new URLSearchParams(window.location.search);
        const genre = urlParams.get("genre") ?? "";
        const q = urlParams.get("q") ?? "";
        app.Router.go("/movies?q="  + q + "&order=" + order + "&genre=" + genre);
    },
    addToCollection: (event, type) => {
        if (!app.Store.loggedIn) {
            app.Router.go("/account/");
            return;
        }
        event.preventDefault();
        const movieId = event.target.dataset.movieId;
        app.api.saveToCollection(movieId, type);
        if (type === "favorite") {
            event.target.textContent = "Added to Favorites";
        } else if (type === "watchlist") {
            event.target.textContent = "Added to Watchlist";
        }
        event.target.disabled = true;
    },
    register: async (event) => {
        event.preventDefault();
        const name = document.getElementById("register-name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const passwordConfirmation = document.getElementById("register-password-confirmation").value;

        const errors = [];
        if (name.length < 4) errors.push("Enter your complete name");
        if (password.length < 4) errors.push("Enter a password with at least 7 character");
        if (email.length < 4) errors.push("Enter your complete email");
        if (password !== passwordConfirmation) errors.push("Passwords don't match.");

        if (errors.length === 0){
            const response = await API.register(name, email, password);
            if (response.success) {
                app.Store.jwt = response.jwt;
                app.Router.go("/account/");
            } else {
                app.showError(response.message);
            }
        } else {
            app.showError(errors.join(". "));
        }
    },
    login : async (event) => {
        event.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const errors = [];
        if (password.length < 4) errors.push("Enter a password with at least 7 character");
        if (email.length < 4) errors.push("Enter your complete email");

        if (errors.length === 0){
            const response = await API.login(email, password);
            if (response.success) {
                app.Store.jwt = response.jwt;
                app.Router.go("/account/");
            } else {
                app.showError(response.message);
            }
        } else {
            app.showError(errors.join(". "));
        }
    },
    logout: () => {
        Store.jwt = null;
        app.Router.go("/");
    }
}