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
    };
  }
  getFirstCard() {
    let frage = "Frage 1";
    let antwort = "Antwort 1";
    return (
      <div className="card stein">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">A second item</li>
          <li className="list-group-item">A third item</li>
        </ul>
      </div>
    );
  }
  initFeld() {
    return <div className="feld">{this.getFirstCard()}</div>;
  }
  render() {
    return (
      <div className="game">
        {this.initFeld()}
        <div className="Pool card">{this.getFirstCard()}</div>
      </div>
    );
  }
}
export default Domino;
