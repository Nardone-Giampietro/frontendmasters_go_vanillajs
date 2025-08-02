export const API = {
    baseURL: "/api/",
    
    // Error types for consistent error handling
    ErrorTypes: {
        NETWORK_ERROR: 'NETWORK_ERROR',
        HTTP_ERROR: 'HTTP_ERROR',
        AUTH_ERROR: 'AUTH_ERROR',
        PARSE_ERROR: 'PARSE_ERROR',
        VALIDATION_ERROR: 'VALIDATION_ERROR',
        UNKNOWN_ERROR: 'UNKNOWN_ERROR'
    },

    // Helper function to create consistent error objects
    createError: (type, message, status = null, originalError = null) => {
        return {
            type,
            message,
            status,
            originalError,
            timestamp: new Date().toISOString(),
            success: false
        };
    },

    // Helper function to handle different HTTP status codes
    handleHttpStatus: (status, responseText) => {
        switch (status) {
            case 200:
            case 201:
                return null; // Success, no error
            case 400:
                return API.createError(API.ErrorTypes.VALIDATION_ERROR, 'Bad request - Invalid data provided', status);
            case 401:
                return API.createError(API.ErrorTypes.AUTH_ERROR, 'Unauthorized - Please log in again', status);
            case 403:
                return API.createError(API.ErrorTypes.AUTH_ERROR, 'Forbidden - You don\'t have permission to perform this action', status);
            case 404:
                return API.createError(API.ErrorTypes.HTTP_ERROR, 'Resource not found', status);
            case 409:
                return API.createError(API.ErrorTypes.VALIDATION_ERROR, 'Conflict - Resource already exists', status);
            case 422:
                return API.createError(API.ErrorTypes.VALIDATION_ERROR, 'Validation error - Please check your input', status);
            case 429:
                return API.createError(API.ErrorTypes.HTTP_ERROR, 'Too many requests - Please try again later', status);
            case 500:
                return API.createError(API.ErrorTypes.HTTP_ERROR, 'Internal server error - Please try again later', status);
            case 502:
            case 503:
            case 504:
                return API.createError(API.ErrorTypes.HTTP_ERROR, 'Service temporarily unavailable - Please try again later', status);
            default:
                return API.createError(API.ErrorTypes.HTTP_ERROR, `HTTP Error ${status}`, status);
        }
    },

    getTopMovies: async () => {
        return await API.request("movies/top", { method: "GET" });
    },
    getRandomMovies: async () => {
        return await API.request("movies/random", { method: "GET" });
    },
    getMovieById: async (id) => {
        return await API.request(`movies/${id}`, { method: "GET" });
    },
    getActorById: async (actorId) => {
        return await API.request(`actors/${actorId}`, { method: "GET" });
    },
    getMoviesByActorId: async (actorId) => {
        return await API.request(`movies/actor/${actorId}`, { method: "GET" });
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
    deleteAccount: async () => {
        return await API.request("account/delete/", {method: "POST"})
    },
    getFavorites: async () => {
        return await API.request("account/favorite/", { method: "GET" });
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
    deleteFromCollection: async (movie_id, collection) => {
        return await API.request("account/delete-from-collection/", {
            method: "POST",
            data: {
                movie_id: parseInt(movie_id),
                collection: collection
            }
            })
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
            
            // Handle HTTP status errors
            const httpError = API.handleHttpStatus(response.status);
            if (httpError) {
                console.error(`API Error (${ServiceName}):`, httpError);
                return httpError;
            }

            // Try to parse JSON response
            let responseData;
            try {
                responseData = await response.json();
            } catch (parseError) {
                const parseErrorObj = API.createError(
                    API.ErrorTypes.PARSE_ERROR,
                    'Failed to parse server response',
                    response.status,
                    parseError
                );
                console.error(`JSON Parse Error (${ServiceName}):`, parseErrorObj);
                return parseErrorObj;
            }

            // Check if the response contains an error message from the server
            if (responseData && responseData.error) {
                const serverError = API.createError(
                    API.ErrorTypes.VALIDATION_ERROR,
                    responseData.error,
                    response.status,
                    responseData
                );
                console.error(`Server Error (${ServiceName}):`, serverError);
                return serverError;
            }

            // Return successful response with success flag
            return {
                data: responseData,
                success: true,
                status: response.status
            };

        } catch (error) {
            // Handle network errors and other exceptions
            let errorType = API.ErrorTypes.UNKNOWN_ERROR;
            let errorMessage = 'An unexpected error occurred';

            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorType = API.ErrorTypes.NETWORK_ERROR;
                errorMessage = 'Network error - Please check your internet connection';
            } else if (error.name === 'AbortError') {
                errorType = API.ErrorTypes.NETWORK_ERROR;
                errorMessage = 'Request was aborted';
            } else {
                errorMessage = error.message || errorMessage;
            }

            const networkError = API.createError(errorType, errorMessage, null, error);
            console.error(`Network/System Error (${ServiceName}):`, networkError);
            return networkError;
        }
    }
}