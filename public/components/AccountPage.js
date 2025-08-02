export class AccountPage extends HTMLElement {

    connectedCallback(){
        const template = document.getElementById("template-account");
        const clone = template.content.cloneNode(true);
        this.appendChild(clone);
    }

}

customElements.define("account-page", AccountPage)