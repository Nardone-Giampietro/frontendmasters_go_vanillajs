export class MovieItem extends HTMLElement{
    
    constructor(movie, collection = ""){
        super();
        this.movie = movie
        this.collection = collection
    }

    connectedCallback(){
        const url = "/movies/" + this.movie.id;
        const trashCanSVG = `
            <div onclick="event.stopPropagation(); app.deleteFromCollection(event,'${this.movie.id}', '${this.collection}');"
                     style="position: absolute; top: 5px; right: 5px; cursor: pointer; z-index: 1;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"> 
                    </path>
                </svg>
            </div>`
        const deleteIcon = this.collection !== "" ? trashCanSVG : "";
        this.innerHTML = `
            <a href="#" onclick="event.preventDefault(); app.Router.go('${url}')">
                <article style="position: relative;">
                ` + deleteIcon + `
                    <img src="${this.movie.poster_url}" alt="${this.movie.title} Poster" >
                    <p>${this.movie.title} (${this.movie.release_year})</p>
                </article>
            </a>
        `;
    }
} 

customElements.define("movie-item", MovieItem)