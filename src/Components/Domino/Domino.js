import React, { Component } from "react";
import "../../Stylesheets/domino.css";
class Domino extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: props.room,
      users: props.users,
      user: props.user,
      data: props.data,
      activeUser: "aktiv",
      pool: [],
      feld:[],
      feldState: 0,
    };
  }
  //Stein drehen
  async handleRotateStone(e){
    // Daten aus Event
    let id = e.currentTarget.id
    let pid = e.currentTarget.parentNode.id;
    //Zur einfacheren Handhabung
    let h;
    let fO;
    let pool1 = this.state.pool;
    let feld1 = this.state.feld;
    //Kommunikation 
    const Ably = require('ably');
    const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
    await ably.connection.once('connected');
    const channelId = 'domino' + this.state.room;
    const channel = ably.channels.get(channelId);

    console.log("Got clicked " +id +"  "+pid)
    if(!isNaN(pid)){
      console.log("im feld")
      h = feld1[pid].stone.h;
      fO = feld1[pid].stone.fO

      // Varianten wie der Stein liegt: F|A A/F A|F F/A
      if(h && fO){
        console.log("Von Zustand 1 nach 2")
        h = false;
        fO =false;
        //A/F
      }else if (!h && !fO){
        console.log("Von Zustand 2 nach 3")
        h = true;
        //A|F
      }else if (h && !fO){
        console.log("Von Zustand 3 nach 4")
        h = false;
        fO = true;
        //F/A
      }else if(!h && fO){
        console.log("Von Zustand 4 nach 1")
        h = true;
      }else {
        console.log("nichts passiert ");
      }
      feld1[pid].stone.h = h;
      feld1[pid].stone.fO= fO;
    
    }
    this.setState({
      room: this.state.room,
      user: this.state.user,
      data: this.state.data,
      activeUser: this.state.activeUser,
      pool: pool1,
      feld: feld1,
      feldState: this.state.feldState,
    });
    await channel.publish('updateSteine', {
      user: this.state.user,
      feld: feld1,
      pool: pool1,
    });
    ably.close();  
  }
  //Spieler wechsel
  handleSwitchPlayer(){
    console.log("clicked");
    /*
    let users = this.state.users
    let ap = this.state.activeUser;
    for(let i = 0; i<)
    */
  }
  getActivePlayer(){
    let dat = JSON.parse(this.state.data);
    console.log(dat)
    let ap = dat.activeUser;
    return ap;
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

  async handleDrop(e) {
    // Daten über Stein und Parent vom Stein
    let ziel = e.currentTarget.id;
    let zielRow = e.currentTarget.parentNode;
    let origin = e.dataTransfer.getData("id")
    let originParent = e.dataTransfer.getData("parent")
    // Feld und Pool kopie zur einfacheren Handhabung
    let pool1 = this.state.pool;
    let poolNeu = [];
    let feld1 = this.state.feld;
    let stone;
    // Kommunikation für Update Feld
    const Ably = require('ably');
    const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
    await ably.connection.once('connected');
    const channelId = 'domino' + this.state.room;
    const channel = ably.channels.get(channelId);


    console.log("ziel "+ziel+" origin "+origin+" parent "+originParent)
    
    //Stein kommt aus dem Pool
    if(originParent=="pool"&&feld1[ziel].stone.id==""){
      console.log("Stein kommt aus dem Pool "+feld1[ziel].stone.id)
      console.log("und ist leer")

      //Finde Stein im Pool
      //eventuell getIndexAtKey(id)?
      for(let i = 0 ; i<pool1.length;++i){
        if(pool1[i].id==origin){
          console.log("stone "+origin+"gefunden: "+pool1[i].id)
          stone= pool1[i];
        }
      }

      //setzen des Steins
      feld1[ziel].stone.id=stone.id;
      feld1[ziel].stone.antwort= stone.antwort;
      feld1[ziel].stone.frage= stone.frage;
      feld1[ziel].stone.h  = stone.h;
      feld1[ziel].stone.fO = stone.fO
      
      console.log("stein gesetzt")
      //löschen des Steins
      //eventuell getIndexAtKey(id)?
      for(let i = 0 ; i<pool1.length;++i){
        if(pool1[i].id==origin){
          console.log(pool1[i].id+" wird übersprungen. ")
        }else{
          poolNeu.push(pool1[i]);
        }
      }
      console.log(poolNeu)
    }

    //Stein kommt von einer anderen Zelle wenn Parent eine Zahl ists
    else if((!isNaN(originParent))&&feld1[ziel].stone.id==""){
      console.log("Stein kommt aus dem Feld "+feld1[ziel].stone.id)
      console.log("und ist leer")
      //setzen des Steins
      feld1[ziel].stone.id=feld1[originParent].stone.id;
      feld1[ziel].stone.antwort= feld1[originParent].stone.antwort;
      feld1[ziel].stone.frage= feld1[originParent].stone.frage;
      feld1[ziel].stone.h= feld1[originParent].stone.h;
      feld1[ziel].stone.fO= feld1[originParent].stone.fO;
      
      //löschen des Steins aus dem vorherigen Feld
      feld1[originParent].stone.id = "";
      feld1[originParent].stone.antwort="";
      feld1[originParent].stone.frage="";
      //Pool soll unverändert bleiben
      poolNeu=this.state.pool


    }
    else{
      console.log("besetzt")
      //es soll sich nichts ändern
      poolNeu=this.state.pool
    }       

    this.setState({
      room: this.state.room,
      user: this.state.user,
      data: this.state.data,
      activeUser: this.state.activeUser,
      pool: poolNeu,
      feld: feld1,
      feldState: this.state.feldState,
    });  
    //Send the Message to all user
    //Pool wird noch mit gesendet, kommt weg sobald Steine aufgeteilt werden
    await channel.publish('updateSteine', {
      user: this.state.user,
      feld: feld1,
      pool: poolNeu,
    });
    ably.close();  
    
  }

  //GENERIERE STEINE
  getStones(){
    let fs = this.state.feldState
    let stones =[];
    console.log("FeldState Steine "+fs)
    
    if(fs==1){
      fs++;
      console.log("initSteine "+stones);
        stones = this.initStones();
        console.log(stones)
        this.setState({
          room: this.state.room,
          user: this.state.user,
          data: this.state.data,
          activeUser: this.state.activeUser,
          pool: stones,
          feld: this.state.feld,
          feldState: fs,
      });
    }
    return(this.state.pool.map((stone)=>this.getOneStone(stone)));
  }

  initStones(){
    //Object 
    console.log("Mitspieler: "+ this.state.users)
    let dat = JSON.parse(this.state.data)
    let amount = dat.fragen.length;
    let stones =[];
    for(let i = 0; i<amount;i++){
      stones.push({
        id:dat.fragen[i].props.id,
        frage:dat.fragen[i].props.frage , 
        antwort: dat.fragen[i].props.antwort,
        h:false,
        fO:true
      })
    }
    return stones;

  }
  
  getOneStone(stone){
    let id = stone.id
    let frage = stone.frage
    let antwort = stone.antwort
    let horizontal = stone.h
    let fOben = stone.fO
    return (
      <div className="card" id={id} draggable="true" onClick={(e)=>this.handleRotateStone(e)} onDragStart={(e)=>this.handleDragStart(e)}>
        <ul className={horizontal ? "list-group list-group-horizontal" : "list-group list-group-flush"}>
          <li className={fOben?"list-group-item bg-secondary-subtle text-emphasis-secondary":"list-group-item"}>{fOben?frage:antwort}</li>
          <li className={fOben?"list-group-item ":"list-group-item bg-secondary-subtle text-emphasis-secondary"}>{fOben?antwort:frage}</li>
        </ul>
      </div>);
  }
  getSurroundingDatas(){
    let title = "Domino"
    
  }

  //GENERIERE FELD
  getFeld(){
    let fs = this.state.feldState
    let feld= [];
    console.log("FeldState Feld: "+fs)
  
    if(fs<1){
      fs++
      feld = this.initFeld();
      console.log(feld)
      this.setState({
          room: this.state.room,
          user: this.state.user,
          data: this.state.data,
          activeUser: this.state.activeUser,
          pool: this.state.pool,
          feld: feld,
          feldState: fs,
      });     
    }      
    return (this.state.feld.map((row)=>{
      return (
        <div className="row" id={row.id}>
          {row.map((f)=>(
            <div onDrop={(e)=>this.handleDrop(e)} onDragOver={(e)=>this.handleDragOver(e)} className="zelle" id={f.id}>
              {(f.stone.id=="") ? f.id : this.getOneStone(f.stone)}
            </div>
          ))}
        </div>
      );
    }));
  }

  initFeld() {
    //DominoData.json feld
    let feld=[];
    let row = [];
    let zelle;
    let laenge = 3;
    for(let i= 0;i<laenge;++i){
      for(let j = 0; j<laenge;++j){
        let id = i*laenge+j;
        zelle = {id: id , stone:{id: "",frage: "frage", antwort: "   "}}
        row.push(zelle);
        console.log(row);
      }

      feld.push({id: i, row: row});
      row=[];
    }
    console.log(feld)
    return feld
  }

  //KOMMUNIKATION
  async updateFeld(feld, pool, activeUser){
    // Kommunikation für Update Feld
    const Ably = require('ably');
    const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
    await ably.connection.once('connected');
    const channelId = 'domino' + this.state.room;
    const channel = ably.channels.get(channelId);

    this.setState({
      room: this.state.room,
      user: this.state.user,
      data: this.state.data,
      activeUser: activeUser,
      pool: pool,
      feld: feld,
      feldState: 2,
    });   

    await channel.publish('updateSteine', {
      user: this.state.user,
      feld: feld,
      pool: pool,
      activeUser: activeUser,
      
    });
    ably.close();  

  }
  

  async handleUpdateFeld(message) {
    console.log("Got this: "+message.data.user+" "+message.data.feld);
    let dat = JSON.parse(this.state.data);
    
    //nur bei den anderen rerender
    if(message.user != this.state.user){
      console.log("Set State von anderen")
      this.setState({
        room: this.state.room,
        user: this.state.user,
        data: this.state.data,
        activeUser: this.state.activeUser,
        pool: message.data.pool,
        feld: message.data.feld,
        feldState: this.state.feldState,
      });
    }
}
  async componentDidMount(){
    //Connection Ably to transfer and update Data
    const Ably = require('ably');
    const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
    await ably.connection.once('connected');
    const channelId = 'domino'+this.state.room;
    const channel = ably.channels.get(channelId);
    console.log("Channel aktiv");
    channel.subscribe('updateFeld', (message)=>this.handleUpdateFeld(message))


  }

  render() {
    return (
      <div name = "domino" className="container">
        <div className="row">
          <h1 className="col-6 align-baseline">Domino</h1>
          <p className="col-6 align-text-bottom">Spieler {this.getActivePlayer()} ist am Zug</p>
        </div>
        <div className="row" id="firstPart">
          <div name="dominoFeld" id="dominoFeld" className="dominoFeld rounded container">
              {this.getFeld()}
          </div>
        </div>

        <div id="secondPart" className="row">

            <div name="poolFeld" id="pool" className="col-8 pool">
              {this.getStones()}
            </div>
            <div className="col-4">
              <button type="button" className="btn btn-light" onClick={(e)=>this.handleSwitchPlayer()}>Zug beenden</button>
            </div>

        </div>  

      </div>
    );
  }
}

export default Domino;
