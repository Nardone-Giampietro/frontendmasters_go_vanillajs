import { API } from "../services/API.js"
import { MovieItem } from "./MovieItem.js";

export class ActorDetailsPage extends HTMLElement {
    movies = null
    actor = null

    async render(id) {
        this.movies = (await API.getMoviesByActorId(id)).data;
        this.actor = (await API.getActorById(id)).data;
        const template = document.getElementById("template-actor-details");
        const clone =  template.content.cloneNode(true);
        this.appendChild(clone)

        const ul = document.getElementById("actor-films");
        const h3 = this.querySelector("h3");
        const img = this.querySelector("img");

        img.setAttribute("src", this.actor.image_url ?? "/images/generic_actor.jpg");
        h3.textContent = `${this.actor.first_name} ${this.actor.last_name}`;
        renderMoviesInList(this.movies, ul);

        function renderMoviesInList(movies, ul){
            ul.innerHTML = "";
            movies.forEach(element => {
                const li = document.createElement("li");
                li.appendChild(new MovieItem(element))
                ul.append(li);
            });
        }

    }

    connectedCallback() {
        const id = this.params[0];
        this.render(id);
    }
}

customElements.define('actor-details', ActorDetailsPage);