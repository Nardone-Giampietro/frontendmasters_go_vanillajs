import { MovieItem } from "./MovieItem.js";

export class CollectionPage extends HTMLElement {
    constructor(endpoint, title) {
        super();
        this.endpoint = endpoint;
        this.title = title;
    }

    async render() {
        const movies = (await this.endpoint()).data;
        const ul = this.querySelector("ul");
        const h2 = this.querySelector("h2");
        ul.innerHTML = "";
        if (movies === null || movies.length === 0) {
            h2.textContent = "No movies found";
            return;
        } else {
            h2.textContent = this.title;
            movies.forEach(movie => {
                const li = document.createElement("li");
                li.appendChild(new MovieItem(movie, this.title));
                ul.appendChild(li);
            });
        }
    }

    connectedCallback() {
        const template = document.getElementById("template-collection");
        const clone = document.importNode(template.content, true);
        this.appendChild(clone);
        this.render();
    }
}
