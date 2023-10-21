import React, { Component } from "react";
import "../../Stylesheets/domino.css";
class Domino extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: props.room,
      user: props.user,
      data: props.data,
      leader: false,
      pool: [],
      feld: [],
    };
  }

  getFirstCard(){
    let frage = "Hallo ne Frage";
    return(
    <div class="card" style="width: 18rem;">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">{frage}</li>
        <li class="list-group-item">A second item</li>
      </ul>
    </div>);
  }

  initFeld() {
    var felder = [];
    for (let i = 0; i < 9; ++i) {
      felder.push(
        <div className="zelle" id={i}>
          Hallo
        </div>
      );
    }
    this.setState({
      room: this.state.room,
      user: this.state.user,
      data: this.state.data,
      leader: false,
      pool: this.state.pool,
      feld: felder,
    });
    return <span>Hallo</span>;
  }

  render() {
    return (
      <div>
        <div name="domino" className="dominoFeld">
        </div>
        <div className="Pool card">{this.getFirstCard()}</div>
      </div>
    );
  }
}

export default Domino;
