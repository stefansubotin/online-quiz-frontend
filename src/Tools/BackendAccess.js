class BackendAccess {
    static getUrl() {
        return "https://gifted-shawl-fox.cyclic.app/";
    }

    static getUrlKreuzwort() {
        return this.getUrl() + "kreuzwort";
    }

    static getUrlWwm() {
        return this.getUrl() + "wwm";
    }

    static getUrlContributor() {
        return this.getUrl() + "contributor";
    }

    static getUrlDomino() {
        return this.getUrl() + "domino";
    }

    static getUrlTaboo() {
        return this.getUrl() + "taboo";
    }

    static getUrlLobby() {
        return this.getUrl() + "lobby";
    }

    static getUrlLeaveLobby() {
        return this.getUrl() + "db/"
    }
}

export default BackendAccess;
