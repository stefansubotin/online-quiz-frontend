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
}

export default BackendAccess;
