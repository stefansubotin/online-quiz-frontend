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
    console.log(this.state.data['fragen'].props.frage);
    let frage = "Hallo ne Frage";
    let antwort="Antwort"
    return(
    <div className="card">
      <ul className="list-group list-group-flush">
        <li class="list-group-item">{frage}</li>
        <li class="list-group-item">{antwort}</li>
      </ul>
    </div>);
  }

  initFeld() {

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
