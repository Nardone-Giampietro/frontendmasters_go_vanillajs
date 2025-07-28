export class AnimatedLoading extends HTMLElement {

    constructor(){
        super();
    }

    connectedCallbask(){
        const elements = this.dataset.elements; // data-elements
        const witdth = this.dataset.witdth;
        const height = this.dataset.height;

        for(let i = 0; i < elements; i++){
            const wrapper = document.createElement("div");
            wrapper.classList.add("loading-wave");
            wrapper.style.width  = witdth;
            wrapper.style.height = height;
            wrapper.style.margin = "10px";
            wrapper.style.display = "inline-block";
            this.appendChild(wrapper);
        }
    }
}

customElements.define("animated-loading", AnimatedLoading)