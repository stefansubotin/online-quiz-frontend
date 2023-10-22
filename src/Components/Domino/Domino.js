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
  //DRAG AND DROP
  //https://react.dev/reference/react-dom/components/common#dragevent-handler
  //https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
  handleDragStart(e) {
    e.dataTransfer.setData("id", e.target.id);

  }
  handleDragOver(e) {
    console.log("drag over ")
    e.preventDefault();
  }
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



  //GENERIERE STEINE
  getCards(){
    console.log("Feld State: Cards "+this.state.feldState)
    if(this.state.feldState<1){
      
      return this.initCards();
    }
      return null;
  }

  initCards(){
    //Object 
    let dat = JSON.parse(this.state.data)
    let fragen = dat.fragen
    let stones =[];
    for(const frage of fragen){
      stones.push({"id" : frage.props.key,"frage":frage.props.frage, "antwort": frage.props.antwort})
      console.log(stones);
    }
    return stones;

  }
  getOneCard(antwort, frage, id){
    //https://react.dev/learn/responding-to-events#adding-event-handlers
    console.log("id"+id);
    let stones = this.initCards();
    return(stones.map((stone)=>(
    <div className="card" id={stone.id} draggable="true" onDragStart={(e)=>this.handleDragStart(e)}>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">{stone.frage}</li>
        <li className="list-group-item">{stone.antwort}</li>
      </ul>
    </div>)));
  }
  //GENERIERE FELD
  getFeld(){
    console.log("Feld Feld State "+this.state.feldState)
    let fs = this.state.feldState
    if(fs<1){
        fs++;
        let feld = this.initFeld();
        console.log(feld)
        this.setState({
        room: this.state.room,
        user: this.state.user,
        data: this.state.data,
        leader: false,
        pool: this.state.pool,
        feld: feld,
        feldState: fs,
      });
      return (feld.map((zelle)=>(
        <div onDrop={this.handleDrop} onDragOver={this.handleDragOver} className="zelle" id={zelle.id}>{zelle.stein.antwort}</div>
      )));
    }else{
      console.log(this.state.feld.length)
    }

      
  }


    
  initFeld() {
    //DominoData.json feld
    let feld=[];
    for(let i= 0;i<9;++i){
      feld.push({"id":i, "stein":{"id": "","frage": "   ", "antwort": "   "}})
      console.log("ZellenID"+i+" "+feld[i].id)
    }
    return feld;
  }

  //KOMMUNIKATION
  UpdateSteine(message){
    
  }
  async componentDidMount(){
    //Connection Ably to transfer and update Data
    const Ably = require('ably');
    const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
    await ably.connection.once('connected');
    const channelId = 'domino'+this.state.room;
    const channel = ably.channels.get(channelId);
    console.log("Channel aktiv");
    channel.subscribe('UpdateSteine', (message)=>this.UpdateSteine(message))


  }

  render() {
    return (
      <div name = "domino">
        <div name="dominoFeld" className="dominoFeld rounded">
            {this.getFeld()}
        </div>
        <div name="dominoPool"className="pool rounded"></div>
      </div>
    );
  }
}

export default Domino;
