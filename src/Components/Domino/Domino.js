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
      feld:[],
      feldState: -1,
    };
  }
  handleDragStart(e) {
    e.dataTransfer.setData("id", e.target.id);

  }
  //HandleDragOver, Sammeln über was gehalten wird + erlauben
  handleDragOver(e) {
    console.log("drag over ")
    e.preventDefault();
  }
  //HandleDrop, setzen des Steins + löschen der vorherigen Position
  handleDrop(e) {
    let draggedElement = e.dataTransfer.getData("id");
    console.log("elementdropped"+e.target.name+" "+e.target.children)
    if(false){

    }
    this.setState({
      room: this.state.room,
      user: this.state.user,
      data: this.state.data,
      leader: false,
      pool: this.state.data,
      feldState: this.feldState++,
      feld: this.state.data,
    });
    console.log(this.state.feldState)
    
  }
  getCards(){
    console.log("Feld State: Cards "+this.state.feldState)
    if(this.state.feldState<0){
      
      return this.initCards();
    }else if(this.state.feldState>0){
      let fragen = this.state.pool;
      let cards=[];
      for(let i=0;i<this.state.data.fragen.length;i++){
        let card = this.getOneCard(fragen[i].props.antwort, fragen[i].props.frage, fragen[i].props.id)
        cards.push(card)
      }
      console.log("Karten gefüllt");
      return cards;
      
    }
  }
  initCards(){
    //Object 
    let dat = JSON.parse(this.state.data)
    let fragen = dat.fragen
    this.setState({
      room: this.state.room,
      user: this.state.user,
      data: this.state.data,
      leader: false,
      pool: fragen,
      feldState: 1,
      feld:this.state.feld,
    });
    console.log(this.state.pool+'ander s'+dat.fragen)
    
    let cards=[];
    for(let i=0;i<this.state.pool.length;i++){
      let card = this.getOneCard(this.state.pool[i].props.antwort, this.state.pool[i].props.frage, this.state.pool[i].props.id)
      cards.push(card)
    }
    console.log("Karten gefüllt");
    return cards;
    

  }
  getOneCard(antwort, frage, id){
    //https://react.dev/learn/responding-to-events#adding-event-handlers
    console.log("id"+id);
    return(
    <div className="card" id={id} draggable="true" onDragStart={(e)=>this.handleDragStart(e)}>
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
      newFeld.push(<div onDrop={this.handleDrop} onDragOver={this.handleDragOver} className="zelle" id={i}>Feld {i}</div>)
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
        <div name="domino" className="dominoFeld rounded">
            {this.getFeld()}
        </div>
        <div className="pool rounded">{this.getCards()}</div>
      </div>
    );
  }
}

export default Domino;
