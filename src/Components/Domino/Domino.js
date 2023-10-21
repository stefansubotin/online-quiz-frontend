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
  getFirstCard() {
    let frage = "Frage 1";
    let antwort = "Antwort 1";
    return (
      <div className="card stein">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">{frage}</li>
          <li className="list-group-item">{antwort}</li>
        </ul>
      </div>
    );
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
      feld: felder,
    });
    return this.state.feld.map((zelle) => {
      <div className="feld">{zelle}</div>;
    });
  }
  render() {
    return (
      <div>
        {this.initFeld()}
        <div className="Pool card">{this.getFirstCard()}</div>
      </div>
    );
  }
}
export default Domino;
