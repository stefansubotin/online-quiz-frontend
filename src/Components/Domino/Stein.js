import React, { Component } from "react";
class Stein extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frage: props.frage,
      antwort: props.antwort,
      id: props.id,
    };
  }
  initFeld() {
    return <div style="color:blue">Hallo Feld</div>;
  }
  render() {
    return (
      <div id={this.state.id} class="card stein" style="width: 18rem;">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Frage</li>

          <li class="list-group-item">Antwort</li>
        </ul>
      </div>
    );
  }
}
export default Stein;
