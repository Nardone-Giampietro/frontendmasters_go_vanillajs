import { API } from "../services/API.js";
import { MovieItemComponent } from "./MovieItem.js";

export class HomePage extends HTMLElement{ // home-page

    async render() {
        const topMovies = await API.getTopMovies();
        renderMoviesInList(topMovies, document.querySelector("#top-10 ul"));

        const randomMovies = await API.getRandomMovies();
        renderMoviesInList(randomMovies, document.querySelector("#random ul"))

        function renderMoviesInList(movies, ul){
           ul.innerHTML = "";
           movies.forEach(element => {
                const li = document.createElement("li");
                li.appendChild(new MovieItemComponent(element))
                ul.append(li);
           }); 
        }
    }

    connectedCallback(){
        const template = document.getElementById("template-home");
        const content = template.content.cloneNode(true);
        this.append(content);

        this.render();
    }
}

customElements.define("template-home", HomePage);