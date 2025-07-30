const Store = {
    jwt: null,
    get loggedIn() {
        return this.jwt !== null
    }
}

// Se è già presente il token nel localStorage allora lo carico. Tuttavia non è che sto facendo una
// operazione "circolare" in cui prendo il jwt dallo storage e lo salva un'altra volta nello storage
// perché sto caricando il jwt dallo storage direttamente a Store, senza passare per il proxy
if (localStorage.getItem("jwt")){
    Store.jwt = localStorage.getItem("jwt");
}

// Per ogni variazione che viene fatta a Store si copiano i dati anche nella memoria locale del Browser
const proxiedStore = new Proxy(Store, {
    set: (target, prop, value) => {
        if (prop == "jwt") {
            // Si cambia il valore di jwt ma lo si salva anche nello storage locale
            target[prop] = value;
            if (value == null){
                // Questo per evitare che venga salvato come 'null', quindi una stringa invece che
                // effettivamente come null. Lo si rimuove e quindi viene visto come null
                localStorage.removeItem("jwt");
            } else {
                localStorage.setItem("jwt", value);
            }
        }
        // Bisogna segnalare che si è finito
        return true;
    }
});

// Esternamente il client vede solo il proxy
export default proxiedStore