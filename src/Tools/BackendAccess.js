class BackendAccess {
    static getUrl(){
        return 'https://gifted-shawl-fox.cyclic.app/';
    }

    static getUrlKreuzwort(){
        return this.getUrl() + 'kreuzwort';
    }

    static getUrlWwm() {
        return this.getUrl() + 'wwm';
    }
}

export default BackendAccess;