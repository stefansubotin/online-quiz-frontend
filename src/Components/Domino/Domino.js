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
  //Stein drehen
  async handleOnClick(e){
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
    if(pid == "pool"){

      console.log("clicked in Pool momentan nicht möglich")
      /*
      let index;
      for(index = 0 ; index<pool1.length;++index){
        //Finde Stein im Pool
        if(pool1[index].id==id){
          console.log("stone "+id+"gefunden: "+pool1[index].id)
        }
      }
      console.log(JSON.stringify(pool1[index]));
      h = pool1[index].h;
      fO = pool1[index].fO

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
      pool1[index].h = h;
      pool1[index].fO= fO;
*/
    }
    else {
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
      leader: false,
      pool: pool1,
      feld: feld1,
      feldState: this.state.feldState,
    });
    await channel.publish('updateSteine', {
      user: this.state.user,
      feld: feld1,
      pool: poolNeu,
    });
    ably.close();  
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
      leader: false,
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
    return(this.state.pool.map((stone)=>this.getOneStone(stone)));
  }

  initStones(){
    //Object 
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
      <div className="card" id={id} draggable="true" onClick={(e)=>this.handleOnClick(e)} onDragStart={(e)=>this.handleDragStart(e)}>
        <ul className={horizontal ? "list-group list-group-horizontal" : "list-group list-group-flush"}>
          <li className="list-group-item">{fOben?frage:antwort}</li>
          <li className="list-group-item">{fOben?antwort:frage}</li>
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
      {(f.stone.id=="") ? "Zelle" : this.getOneStone(f.stone)}
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

  async handleUpdateSteine(message) {
    console.log("Got this: "+message.data.user+" "+message.data.feld);
    let dat = JSON.parse(this.state.data);
    
    //nur bei den anderen rerender
    if(message.user != this.state.user){
      console("Set State von anderen")
     this.setState({
      room: this.state.room,
      user: this.state.user,
      data: this.state.data,
      leader: false,
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
    channel.subscribe('updateSteine', (message)=>this.handleUpdateSteine(message))


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
