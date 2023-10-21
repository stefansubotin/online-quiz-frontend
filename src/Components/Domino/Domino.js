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

  getOneCard(){
    let dat = JSON.parse(this.state.data)
    console.log("FRAge"+ dat.fragen[0]);
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
    let newFeld=[];
    for(let i= 0;i<9;++i){
      newFeld.push({"id":i,"stein":null})
    }
    this.state = {
      room: this.state.room,
      user: this.state.user,
      data: this.state.data,
      leader: false,
      pool: [],
      feld: newFeld,
    };
  }

  render() {
    return (
      <div>
        <div name="domino" className="dominoFeld">
          {this.initFeld()}
          {feld.map((zelle)=>{
            <div id={id} className="zelle">{id}</div>
          })}
        </div>
        <div className="Pool card">{this.getOneCard()}</div>
      </div>
    );
  }
}

export default Domino;
