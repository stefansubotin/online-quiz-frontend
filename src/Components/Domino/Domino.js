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
      feldState: -1,
    };
  }
  handleDragStart(e, id) {
    console.log("drag startet")

  }
  //HandleDragOver, Sammeln über was gehalten wird + erlauben
  handleDragOver(e, id) {
    e.preventDefault();
  }
  //HandleDrop, setzen des Steins + löschen der vorherigen Position
  handleDrop(e, zielID) {
  }
  getCards(){
    let dat = JSON.parse(this.state.data)
    let fragen = dat.fragen;
    let cards;
    for(let i=0;i<dat.fragen.length;i++){
      let card = this.getOneCard(fragen[i].props.antwort, fragen[i].props.frage, fragen[i].props.key)
      cards.push(card);
    }
    console("Karten gefüllt");
    return cards;
    

  }
  getOneCard(antwort, frage, id){

    return(
    <div className="card" id={id} draggable="true">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">{frage}</li>
        <li className="list-group-item">{antwort}</li>
      </ul>
    </div>);
  }
  getFeld(){
    if(this.state.feldState<0){
      return this.initFeld();
    }else{
      console.log("noch keine Möglichkeit")
    }
  }
  initFeld() {
    let newFeld=[];
    for(let i= 0;i<9;++i){
      newFeld.push(<div id={i}>Feld {i}</div>)
    }

    return newFeld;
  }
  async componentDidMount(){
    //Connection Ably to transfer and update Data
    const Ably = require('ably');
    const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
    await ably.connection.once('connected');
    const channelId = 'domino'+this.state.room;
    const channel = ably.channels.get(channelId);
    console.log("Channel aktiv");


  }

  render() {
    return (
      <div>
        <div name="domino" className="dominoFeld">
            {this.getFeld()}
        </div>
        <div className="Pool card">{this.getCards()}</div>
      </div>
    );
  }
}

export default Domino;
