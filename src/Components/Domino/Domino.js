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
      activePlayer:"",
      pool: [],
      feld:[],
      feldState: 0,
    };
  }
  //Gibt bei bekannter Zellen id und Zeile die Spalte zurück
  getZielZelle(id, row){
    let laenge = JSON.parse(this.state.data).laenge;
    let zelle = (id-(row*laenge));
    return zelle;
  }
  //Stein drehen
  async handleRotateStone(e){
    // Daten aus Event
    let id = e.currentTarget.id
    let zellenID = e.currentTarget.parentNode.id;
    let zellenRow = e.currentTarget.parentNode.parentNode.id;
    let zelle = this.getZielZelle(zellenID, zellenRow);

    //Zur einfacheren Handhabung
    let h;
    let fO;
    let pool1 = this.state.pool;
    let feld1 = this.state.feld;

    console.log("Got clicked")

    if(!isNaN(zellenID)){
      console.log("im feld")
      h = feld1[zellenRow].zellen[zelle].stone.h;
      fO = feld1[zellenRow].zellen[zelle].stone.fO

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
      feld1[zellenRow].zellen[zelle].stone.h = h;
      feld1[zellenRow].zellen[zelle].stone.fO = fO;
      console.log("STein gedreht ")
    }
    this.setState({
      room: this.state.room,
      user: this.state.user,
      data: this.state.data,
      activePlayer: this.state.activePlayer,
      pool: pool1,
      feld: feld1,
      feldState: this.state.feldState,
    });
    this.updateFeld(this.state.activePlayer,feld1,pool1);
  }

  //Spieler wechsel
  handleSwitchPlayer(){
    let users = this.state.users
    let ap = this.state.activePlayer;
    let next;
    for(let i = 0; i<users.length;i++){
      if(users[i] == ap && i+1<users.length){
        console.log("nicht der letzte: "+ users[i+1])
        next = users[i+1]
      }else if(users[i] == ap && i+1==users.length){
        console.log("der letzte"+ users[0])
        next = users[0]
      }else{
        next= users[0]
      }
    }
    this.updateFeld(next, this.state.feld, this.state.pool)
    
  }
  getActivePlayer(){
    let dat = JSON.parse(this.state.data);
    let ap = dat.activePlayer;
    if(this.state.activePlayer==""){
      console.log("Aktive Spieler initiiert")
      this.setState({
        room: this.state.room,
        user: this.state.user,
        data: this.state.data,
        activePlayer: ap,
        pool: this.state.pool,
        feld: this.state.feld,
        feldState: this.state.feldState,
      });


    }
    return this.state.activePlayer


  }

  //DRAG AND DROP
  //https://react.dev/reference/react-dom/components/common#dragevent-handler
  //https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
  handleDragStart(e) {
    let id = e.currentTarget.id;
    let pid = e.target.parentNode.id;
    let ppid = e.currentTarget.parentNode.parentNode.id;
    console.log("DragStart: "+id+"parent: "+pid)
    e.dataTransfer.setData("id", id);
    e.dataTransfer.setData("parent", pid)
    e.dataTransfer.setData("grandparent", ppid)

  }
  handleDragOver(e) {
    console.log("drag over ")
    e.preventDefault();
  }

  async handleDrop(e) {
    // Daten über Stein und Parent vom Stein
    let laenge = JSON.parse(this.state.data).laenge;

    let ziel = e.currentTarget.id;
    let zielRow = e.currentTarget.parentNode.id;
    let zielZelle = (ziel-(zielRow*laenge));

    let origin = e.dataTransfer.getData("id")
    //Zellen id 
    let originParent = e.dataTransfer.getData("parent")
    let originRow = e.dataTransfer.getData("grandparent")
    let originZelle;

    // Feld und Pool kopie zur einfacheren Handhabung
    let pool1 = this.state.pool;
    let poolNeu = [];
    let feld1 = this.state.feld;
    let stone;



    console.log("ziel "+ziel+ "zielRow "+zielRow+" zielZelle"+zielZelle)
    
    //Stein kommt aus dem Pool
    if(originParent=="pool"&&feld1[zielRow].zellen[zielZelle].stone.id==""){
      console.log("Stein kommt aus dem Pool "+feld1[zielRow].zellen[zielZelle].stone.id)
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
      feld1[zielRow].zellen[zielZelle].stone.id=stone.id;
      feld1[zielRow].zellen[zielZelle].stone.antwort= stone.antwort;
      feld1[zielRow].zellen[zielZelle].stone.frage= stone.frage;
      feld1[zielRow].zellen[zielZelle].stone.h  = stone.h;
      feld1[zielRow].zellen[zielZelle].stone.fO = stone.fO
      
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
    else if((!isNaN(originParent))&&feld1[zielRow].zellen[zielZelle].stone.id==""){
      originZelle = (originParent-(originRow*laenge));
      console.log(" originCard "+origin+" originId"+originParent+" originRow "+originRow+" originZelle"+originZelle)
      //setzen des Steins
      feld1[zielRow].zellen[zielZelle].stone.id=feld1[originRow].zellen[originZelle].stone.id;
      feld1[zielRow].zellen[zielZelle].stone.antwort= feld1[originRow].zellen[originZelle].stone.antwort;
      feld1[zielRow].zellen[zielZelle].stone.frage= feld1[originRow].zellen[originZelle].stone.frage;
      feld1[zielRow].zellen[zielZelle].stone.h= feld1[originRow].zellen[originZelle].stone.h;
      feld1[zielRow].zellen[zielZelle].stone.fO= feld1[originRow].zellen[originZelle].stone.fO;
      
      //löschen des Steins aus dem vorherigen Feld
      feld1[originRow].zellen[originZelle].stone.id= "";
      feld1[originRow].zellen[originZelle].stone.antwort= "";
      feld1[originRow].zellen[originZelle].stone.frage= "";
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
      activePlayer: this.state.activePlayer,
      pool: poolNeu,
      feld: feld1,
      feldState: this.state.feldState,
    });  

    this.updateFeld(this.state.activePlayer, feld1, poolNeu); 
    
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
          activePlayer: this.state.activePlayer,
          pool: stones,
          feld: this.state.feld,
          feldState: fs,
      });
    }
    if(pool.length==0){
      return <Button disabled={this.state.user!=this.state.users[0]}>beenden</Button>
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
      <div className="card w-20" id={id} draggable onClick={(e)=>this.handleRotateStone(e)} onDragStart={(e)=>this.handleDragStart(e)}>
        <ul className={horizontal ? "lh-1 fs-6 list-group list-group-horizontal" : "lh-1 fs-6 list-group list-group-flush"}>
          <li className={fOben?"lh-1 fs-6 list-group-item bg-secondary-subtle text-emphasis-secondary":"list-group-item"}>{fOben?frage:antwort}</li>
          <li className={fOben?"lh-1 fs-6 list-group-item ":"list-group-item bg-secondary-subtle text-emphasis-secondary"}>{fOben?antwort:frage}</li>
        </ul>
      </div>);
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
          activePlayer: this.state.activePlayer,
          pool: this.state.pool,
          feld: feld,
          feldState: fs,
      });     
    }      
    return (this.state.feld.map((row)=>{
      return (
        <div className="row flex-wrap " id={row.id}>
          {row.zellen.map((f)=>{
            return(
                <div onDrop={(e)=>this.handleDrop(e)} onDragOver={(e)=>this.handleDragOver(e)} className="flex-wrap zelle col-4" id={f.id}>
                  {(f.stone.id=="") ? f.id : this.getOneStone(f.stone)}
                </div> 
              
            );
          })}
       </div>
      );
    }));
  }

  initFeld() {
    //DominoData.json feld
    let feld=[];
    let zellen = [];
    let z;
    let laenge = JSON.parse(this.state.data).laenge;
    console.log("laenge"+laenge)
    
    for(let i= 0;i<laenge;++i){
      for(let j = 0; j<laenge;++j){
        let id = i*laenge+j;
        z = {id: id , stone:{id: "",frage: "frage", antwort: "   "}}
        zellen.push(z);
        console.log(zellen);
      }

      feld.push({id: i, zellen: zellen});
      zellen=[];
    }
    
    console.log(feld)
    return feld
  }

  //KOMMUNIKATION
  async updateFeld(activePlayer, feld, pool ){
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
      activePlayer: activePlayer,
      pool: pool,
      feld: feld,
      feldState: this.state.feldState,
    });   
    console.log("SEND: "+ feld+ pool+activePlayer)

    await channel.publish('updateFeld', {
      user: this.state.user,
      feld: feld,
      pool: pool,
      activePlayer: activePlayer,
      
    });
    ably.close();  

  }
  

  async handleUpdateFeld(message) {
    console.log("Got this from: "+message.data.user);
    console.log("NextPlayer: "+ message.data.activePlayer)
    
    //nur bei den anderen rerender
    if(message.user != this.state.user){
      console.log("Set State von anderen")
      this.setState({
        room: this.state.room,
        user: this.state.user,
        data: this.state.data,
        activePlayer: message.data.activePlayer,
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
    console.log(this.state)
    return (
      <div name = "domino" className="container">
        <div className="row">
          <h1 className="col-6 align-baseline">Domino</h1>
          <p className="col-6 align-text-bottom">Spieler {this.getActivePlayer()} ist am Zug</p>
        </div>
        <div className="row" id="firstPart">
          <div name="dominoFeld" id="dominoFeld" disabled={(this.state.user!=this.state.activePlayer)} className="dominoFeld rounded container flex-wrap">
              {this.getFeld()}
          </div>
        </div>

        <div id="secondPart" className="row">

            <div name="poolFeld" disabled={(this.state.user!=this.state.activePlayer)} id="pool" className="col-8 pool">
              {this.getStones()}
            </div>
            <div className="col-4">
              <button type="button" className="btn btn-light" disabled={(this.state.user!=this.state.activePlayer)} onClick={(e)=>this.handleSwitchPlayer()}>Zug beenden</button>
            </div>

        </div>  

      </div>
    );
  }
}

export default Domino;
