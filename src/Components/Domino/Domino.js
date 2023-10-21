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
  handleDragStart(e, id) {

  }
  //HandleDragOver, Sammeln über was gehalten wird + erlauben
  handleDragOver(e, id) {
    e.preventDefault();
  }
  //HandleDrop, setzen des Steins + löschen der vorherigen Position
  handleDrop(e, zielID) {
  }
  getOneCard(){
    let dat = JSON.parse(this.state.data)
    console.log("FRAge"+ dat.fragen[0].props.frage);
    let antwort="Antwort"
    let frage="Antwort"
    return(
    <div className="card">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">{frage}</li>
        <li className="list-group-item">{antwort}</li>
      </ul>
    </div>);
  }

  initFeld() {
    let newFeld=[];
    for(let i= 0;i<9;++i){
      newFeld.push({"id":i,"stein":null})
    }
    let snFeld = JSON.stringify(newFeld);
    this.state = {
      room: this.state.room,
      user: this.state.user,
      data: this.state.data,
      leader: false,
      pool: [],
      feld: snFeld,
    };
  }

  render() {
    return (
      <div>
        <div name="domino" className="dominoFeld">
        
        </div>
        <div className="Pool card">{this.getOneCard()}</div>
      </div>
    );
  }
}

export default Domino;
