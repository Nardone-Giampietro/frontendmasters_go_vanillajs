import { API } from "../services/API.js";
import { CollectionPage } from "./CollectionPage.js";

export class WatchlistPage extends CollectionPage {
    constructor() {
        super(API.getWatchlist, "watchlist");
    }
}

customElements.define("app-watchlist", WatchlistPage);