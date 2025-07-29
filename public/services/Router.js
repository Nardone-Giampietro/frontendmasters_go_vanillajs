import {routes} from "./Routes.js";

export const Router = {
    init: () => {
        window.addEventListener("popstate", () => {
            Router.go(window.location.pathname, false);
        });
        // Enhance current links in the document
        document.querySelectorAll("a.navlink").forEach(a => {
            a.addEventListener("click", (event) => {
                event.preventDefault();
                const href = a.getAttribute("href"); // valore iniziale caricato
                Router.go(href);
            });
        });

        // Go to the initial rout
        Router.go(location.pathname + location.search);
    },
    go : (route, addToHistory=true) => {
        if (addToHistory) {
            history.pushState(null, "", route);
        }

        let pageElement = null;

        const routePath = route.includes('?') ? route.split('?')[0] : route;
        for (const r of routes) {
            if (typeof r.path === "string" && r.path === routePath) {
                pageElement = new r.component();
                break;
            } else if (r.path instanceof RegExp){
                // Regular Expression
                const match = r.path.exec(route);
                if (match) {
                    pageElement = new r.component();
                    // Parameters
                    pageElement.params = match.slice(1);
                    break;
                }
            }
        }
        if (pageElement == null){
            pageElement = document.createElement("h1");
            pageElement.textContent = "Page Not Found";
        }
        // I have a page for the curret URL
        // Inserting the new page
        document.querySelector("main").innerHTML = "";
        document.querySelector("main").appendChild(pageElement);
    } 
}