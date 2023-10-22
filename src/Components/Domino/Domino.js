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
      feld: [{}],
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
    console.log(dat);
    let fragen = dat.fragen[0]
    console.log(fragen)
    let frage = dat.fragen[0].props.frage
    console.log("FRAge"+ frage );
    let antwort="Antwort"
    let frages="frage"
    return(
    <div className="card" draggable="true">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">{frage}</li>
        <li className="list-group-item">{antwort}</li>
      </ul>
    </div>);
  }

  initFeld() {
    let newFeld=[{}];
    for(let i= 0;i<9;++i){
      newFeld.push({"id":i,"stein":null, 'text': "hallo"})
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
  async componentDidMount(){
    //Connection Ably to transfer and update Data
    const Ably = require('ably');
    const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
    await ably.connection.once('connected');
    const channelId = 'domino'+this.state.room;
    const channel = ably.channels.get(channelId);
    this.initFeld();


  }

  render() {
    return (
      <div>
        <div name="domino" className="dominoFeld">
          {this.state.feld.map((zelle, index)=>{
            <div >Hallo</div>
          })}
        </div>
        <div className="Pool card">{this.getOneCard()}</div>
      </div>
    );
  }
}

export default Domino;
