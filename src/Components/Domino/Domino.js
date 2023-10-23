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
      feldState: 0,
    };
  }
  //DRAG AND DROP
  //https://react.dev/reference/react-dom/components/common#dragevent-handler
  //https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
  handleDragStart(e) {
    let id = e.currentTarget.id;
    let pid = e.target.parentNode.id;
    console.log("DragStart: "+id+"parent: "+pid)
    e.dataTransfer.setData("id", id);
    e.dataTransfer.setData("parent", pid)

  }
  handleDragOver(e) {
    console.log("drag over ")
    e.preventDefault();
  }

  handleDrop(e) {
    let ziel = e.currentTarget.id;
    let origin = e.dataTransfer.getData("id")
    let originParent = e.dataTransfer.getData("parent")
    let pool1 = this.state.pool;
    let feld1 = this.state.feld;
    console.log("ziel "+ziel+" origin "+origin+" parent "+originParent)
    
    if(originParent=="pool"){
      console.log("aus dem Pool "+feld1[ziel].stone.id)
      
      if(feld1[ziel].stone.id==""){
          console.log("ist leer")
          feld1[ziel].stone.id = origin;
          //Stein finden im Pool
          for(let i = 0 ; i<pool1.length;++i){
            if(pool1[i].id==origin){
              console.log("Stein gefunden "+origin)
            }
          }
        }
        else{
          console.log("besetzt")
          return 
        }
      
    }else{
      console.log("noch nicht abgefangen")
    }
    
  }

  dropAllowed(zielid, id){
    return true;
  }

  //GENERIERE STEINE
  getStones(){
    let fs = this.state.feldState
    let stones =[];
    console.log("FeldState Steine "+fs)
    
    if(fs==1){
      console.log("initSteine "+stones);
        fs++;
        stones = this.initStones();
        console.log(stones)
        this.setState({
          room: this.state.room,
          user: this.state.user,
          data: this.state.data,
          leader: false,
          pool: stones,
          feld: this.state.feld,
          feldState: fs,
      });
    }
    return(this.state.pool.map((stone)=>(
      <div className="card" id={stone.id} draggable="true" onDragStart={(e)=>this.handleDragStart(e)}>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">{stone.frage}</li>
          <li className="list-group-item">{stone.antwort}</li>
        </ul>
      </div>)));
  }

  initStones(){
    //Object 
    let dat = JSON.parse(this.state.data)
    let amount = dat.fragen.length;
    let stones =[];
    for(let i = 0; i<amount;i++){
      stones.push({id:dat.fragen[i].props.id,frage:dat.fragen[i].props.frage , antwort: dat.fragen[i].props.antwort})
    }
    return stones;

  }
  
  getOneStone(id,frage,antwort){
    return (
      <div className="card" id={id} draggable="true" onDragStart={(e)=>this.handleDragStart(e)}>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">{frage}</li>
          <li className="list-group-item">{antwort}</li>
        </ul>
      </div>);
  }

  //GENERIERE FELD
  getFeld(){
    let fs = this.state.feldState
    let feld= [];
    console.log("FeldState Feld: "+fs)
  
    if(fs<1){
      fs++;
      feld = this.initFeld();
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
    }      
    return(this.state.feld.map((f)=>(
    <div onDrop={(e)=>this.handleDrop(e)} onDragOver={(e)=>this.handleDragOver(e)} className="zelle" id={f.id}>
      {(f.stone.id=="") ? "Zelle" : this.getOneStone(f.stone.id,f.stone.frage,f.stone.antwort)}
    </div>)));  
  }

  initFeld() {
    //DominoData.json feld
    let feld=[];
    for(let i= 0;i<9;++i){
      feld.push({id:i, stone:{id: "",frage: "frage", antwort: "   "}})
    }
    return feld
  }

  //KOMMUNIKATION
  
  
  UpdateSteine(message){
    console.log("got Message")
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
        <div name="dominoFeld" id="dominoFeld" className="dominoFeld rounded">
            {this.getFeld()}
        </div>
        <div name="dominoPool"id="pool"className="pool rounded">{this.getStones()}</div>
      </div>
    );
  }
}

export default Domino;
