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
    let dat = JSON.parse(this.state.data)
    console.log(dat.fragen[0].props.frage);
    let antwort="Antwort"
    let frage="Antwort"
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
