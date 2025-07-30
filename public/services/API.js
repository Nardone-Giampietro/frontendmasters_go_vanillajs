export const API = {
    baseURL: "/api/",
    getTopMovies: async () => {
        return await API.request("movies/top", { method: "GET" });
    },
    getRandomMovies: async () => {
        return await API.request("movies/random", { method: "GET" });
    },
    getMovieById: async (id) => {
        return await API.request(`movies/${id}`, { method: "GET" });
    },
    searchMovies: async(q, order, genre) => {
        return await API.request("movies/search", { method: "GET", args: { q, order, genre } });
    },
    getGenres: async () => {
        return await API.request("genres/", { method: "GET" });
    },
    register: async(name, email, password) =>{
        return await API.request("account/register/", {method: "POST",data: {name, email, password}})
    },
    login: async (email, password) => {
        return await  API.request("account/authenticate/", {method: "POST", data: {email, password}})
    },
    getFavorites: async () => {
        return await API.request("account/favorites/", { method: "GET" });
    },
    getWatchlist: async () => {
        return await API.request("account/watchlist/", { method: "GET" });
    },
    saveToCollection: async (movie_id, collection) => {
        return await API.request("account/save-to-collection/", {
            method: "POST",
            data: {
                movie_id: parseInt(movie_id),
                collection: collection
            }
        });
    },
    request: async (ServiceName, { method = "GET", data = null, args = null } = {}) => {
        try {
            let url = API.baseURL + ServiceName;
            let options = {
                method,
                headers: {
                    "Authorization": "Bearer " + (window.app.Store.jwt ?? "")
                }
            };

            if (args && method === "GET") {
                const queryString = new URLSearchParams(args).toString();
                url += "?" + queryString;
            }

            if (data && method !== "GET") {
                options.headers["Content-Type"] = "application/json";
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            return await response.json();
        } catch (e) {
            console.error(e);
        }
    }
}