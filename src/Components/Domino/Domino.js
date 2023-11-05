import React, { Component, isValidElement } from "react";
import "../../Stylesheets/domino.css";
import BackendAccess from "../../Tools/BackendAccess";
class Domino extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: props.room,
      users: props.users,
      user: props.user,
      data: props.data,
      activePlayer: "",
      pool: [],
      rows: [],
      rowsState: 0,
    };
  }
  //Gibt bei bekannter Zellen id und Zeile die Spalte zurück
  getZielZelle(id, row) {
    let laenge = JSON.parse(this.state.data).laenge;
    let zelle = (id - (row * laenge));
    return zelle;
  }
  //Stein drehen
  async handleRotateStone(e) {
    // Daten aus Event
    let id = e.currentTarget.id
    console.log("id " + id)
    let zellenID = e.currentTarget.parentNode.id;
    let zellenRow = e.currentTarget.parentNode.parentNode.id;
    let zelle = this.getZielZelle(zellenID, zellenRow);

    //Zur einfacheren Handhabung
    let h;
    let d;
    let fO;
    let pool1 = this.state.pool;
    let rows1 = this.state.rows;

    console.log("Got clicked")
    console.log("zellenID " + zellenID + "zellenRow " + zellenRow + " zelle" + zelle)
    if (!isNaN(zellenID)) {
      if (zellenID < 0) {
        console.log("diagonales")
      }
      console.log("im rows")
      h = rows1[zellenRow].columns[zelle].stone.h;
      fO = rows1[zellenRow].columns[zelle].stone.fO
      d = rows1[zellenRow].columns[zelle].stone.d

      // Varianten wie der Stein liegt: F|A A/F A|F F/A
      if (h && fO && !d) {
        console.log("Von Zustand 1 nach 2")
        h = false;
        fO = true;
        d = true;
      } else if (!h && fO && d) {
        console.log("Von Zustand 2 nach 3")
        fO = false
        h = false
        d = false
      } else if (!h && !fO && !d) {
        console.log("Von Zustand 3 nach 4")
        h = true;
        fO = false;
        d = true
      } else if (h && !fO && d) {
        console.log("Von Zustand 4 nach 5")
        h = true;
        fO = false;
        d = false
      } else if (h && !fO && !d) {
        console.log("Von Zustand 5 nach 6")
        fO = false
        h = false
        d = true
      } else if (!h && !fO && d) {
        console.log("Von Zustand 6 nach 7")
        fO = true
        h = false
        d = false
      } else if (!h && fO && !d) {
        console.log("Von Zustand 7 nach 8")
        fO = true
        h = true
        d = true
      } else if (h && fO && d) {
        console.log("Von Zustand 8 nach 1")
        fO = true
        h = true
        d = false
      }
      else {
        console.log("nichts passiert ");
      }
      rows1[zellenRow].columns[zelle].stone.h = h;
      rows1[zellenRow].columns[zelle].stone.fO = fO;
      rows1[zellenRow].columns[zelle].stone.d = d;
      console.log("STein gedreht ")
    }
    this.setState({
      room: this.state.room,
      user: this.state.user,
      data: this.state.data,
      activePlayer: this.state.activePlayer,
      pool: pool1,
      rows: rows1,
      rowsState: this.state.rowsState,
    });
    this.updaterows(this.state.activePlayer, rows1, pool1);
  }

  //Spieler wechsel
  handleSwitchPlayer() {
    let users = this.state.users
    let ap = this.state.activePlayer;
    let next = "";
    for (let i = 0; i < users.length; i++) {
      if (users[i] == ap && i + 1 < users.length) {
        console.log("nicht der letzte: " + users[i + 1])
        next = users[i + 1]
      } else if (users[i] == ap && i + 1 == users.length) {
        console.log("der letzte" + users[0])
        next = users[0]
      }
    }
    this.updaterows(next, this.state.rows, this.state.pool)

  }
  getActivePlayer() {
    let dat = JSON.parse(this.state.data);
    let ap = dat.activePlayer;
    if (this.state.activePlayer == "") {
      console.log("Aktive Spieler initiiert")
      this.setState({

        activePlayer: ap,

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
    console.log("DragStart: " + id + "parent: " + pid)
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
    let zielZelle = (ziel - (zielRow * laenge));

    let origin = e.dataTransfer.getData("id")
    //Zellen id 
    let originParent = e.dataTransfer.getData("parent")
    let originRow = e.dataTransfer.getData("grandparent")
    let originZelle;

    // rows und Pool kopie zur einfacheren Handhabung
    let pool1 = this.state.pool;
    let poolNeu = [];
    let rows1 = this.state.rows;
    let stone;



    console.log("ziel " + ziel + "zielRow " + zielRow + " zielZelle" + zielZelle)

    //Stein kommt aus dem Pool
    if (originParent == "pool" && rows1[zielRow].columns[zielZelle].stone.id == "") {
      console.log("Stein kommt aus dem Pool " + rows1[zielRow].columns[zielZelle].stone.id)
      console.log("und ist leer")

      //Finde Stein im Pool
      //eventuell getIndexAtKey(id)?
      for (let i = 0; i < pool1.length; ++i) {
        if (pool1[i].id == origin) {
          console.log("stone " + origin + "gefunden: " + pool1[i].id)
          stone = pool1[i];
        }
      }

      //setzen des Steins
      rows1[zielRow].columns[zielZelle].stone.id = stone.id;
      rows1[zielRow].columns[zielZelle].stone.answer = stone.answer;
      rows1[zielRow].columns[zielZelle].stone.question = stone.question;
      rows1[zielRow].columns[zielZelle].stone.h = stone.h;
      rows1[zielRow].columns[zielZelle].stone.fO = stone.fO

      console.log("stein gesetzt")
      //löschen des Steins
      //eventuell getIndexAtKey(id)?
      for (let i = 0; i < pool1.length; ++i) {
        if (pool1[i].id == origin) {
          console.log(pool1[i].id + " wird übersprungen. ")
        } else {
          poolNeu.push(pool1[i]);
        }
      }
      console.log(poolNeu)
    }

    //Stein kommt von einer anderen Zelle wenn Parent eine Zahl ists
    else if ((!isNaN(originParent)) && rows1[zielRow].columns[zielZelle].stone.id == "") {
      if (originParent < 0) {
        console.log("kleiner Parent" + originParent)
      }
      originZelle = (originParent - (originRow * laenge));
      console.log(" originCard " + origin + " originId" + originParent + " originRow " + originRow + " originZelle" + originZelle)
      //setzen des Steins
      rows1[zielRow].columns[zielZelle].stone.id = rows1[originRow].columns[originZelle].stone.id;
      rows1[zielRow].columns[zielZelle].stone.answer = rows1[originRow].columns[originZelle].stone.answer;
      rows1[zielRow].columns[zielZelle].stone.question = rows1[originRow].columns[originZelle].stone.question;
      rows1[zielRow].columns[zielZelle].stone.h = rows1[originRow].columns[originZelle].stone.h;
      rows1[zielRow].columns[zielZelle].stone.fO = rows1[originRow].columns[originZelle].stone.fO;
      rows1[zielRow].columns[zielZelle].stone.d = rows1[originRow].columns[originZelle].stone.d;

      //löschen des Steins aus dem vorherigen rows
      rows1[originRow].columns[originZelle].stone.id = "";
      rows1[originRow].columns[originZelle].stone.answer = "";
      rows1[originRow].columns[originZelle].stone.question = "";
      //Pool soll unverändert bleiben
      poolNeu = this.state.pool


    }
    else {
      console.log("besetzt")
      //es soll sich nichts ändern
      poolNeu = this.state.pool
    }

    this.setState({
      pool: poolNeu,
      rows: rows1,
    });

    this.updaterows(this.state.activePlayer, rows1, this.state.pool);

  }

  //GENERIERE STEINE
  getStones() {
    let fs = this.state.rowsState
    let stones = [];
    console.log("rowsState Steine " + fs)

    if (fs == 1) {
      fs++;
      console.log("initSteine " + stones);
      stones = this.initStones();
      console.log(stones)
      this.setState(() => ({
        pool: stones,
        rowsState: fs,
      }));
    }


    return (this.state.pool.map((stone) => this.getOneStone(stone)));
  }

  initStones() {
    //Object 
    console.log("Mitspieler: " + this.state.users)
    let dat = JSON.parse(this.state.data)
    console.log(dat)
    console.log("Richtige questions: " + dat.correctQuestions)
    let amount = dat.questions.length;
    let stones = [];
    for (let i = 0; i < amount; i++) {
      stones.push({
        id: dat.questions[i].key,
        question: dat.questions[i].question,
        answer: dat.questions[i].answer,
        h: false,
        fO: true,
        d: false
      })
    }
    return stones;

  }

  getOneStone(stone) {
    let id = stone.id
    let question = stone.question
    let answer = stone.answer
    let h = stone.h
    let fOben = stone.fO
    let d = stone.d
    return (
      <ul
        className={h ? "list-group list-group-horizontal" : "list-group list-group-flush"}
        id={id}
        draggable onClick={(e) => this.handleRotateStone(e)}
        onDragStart={(e) => this.handleDragStart(e)}
        disabled={(this.state.user != this.state.activePlayer)}>
        {d ?
          <>
            <ul id="-1" className={h ? "list-group" : "list-group list-group-horizontal"}>
              {h ? <li className={fOben ? "list-group-item bg-secondary-subtle" : "  list-group-item"}>{fOben ? question : answer}</li> : this.getDiagonalStoneFiller()}
              {h ? this.getDiagonalStoneFiller() : <li className={fOben ? "  list-group-item bg-secondary-subtle" : "  list-group-item "}>{fOben ? question : answer}</li>}
            </ul>
            <ul id="-2" className={h ? "list-group" : "list-group list-group-horizontal"}>
              {h ? this.getDiagonalStoneFiller() : <li className={fOben ? "list-group-item" : " bg-secondary-subtle list-group-item"}>{fOben ? answer : question}</li>}
              {h ? <li className={fOben ? "list-group-item" : " bg-secondary-subtle list-group-item"}>{fOben ? answer : question}</li> : this.getDiagonalStoneFiller()}
            </ul>
          </>
          : <>
            <li className={fOben ? "list-group-item bg-secondary-subtle text-emphasis-secondary" : "list-group-item"}>{fOben ? question : answer}</li>
            <li className={fOben ? "list-group-item " : "list-group-item bg-secondary-subtle text-emphasis-secondary"}>{fOben ? answer : question}</li>
          </>
        }
      </ul>
    )
  }
  getDiagonalStoneFiller(sclass) {
    return <li className="list-group-item">o</li>
  }

  //GENERIERE rows
  getrows() {
    let fs = this.state.rowsState
    let rows = [];
    console.log("rowsState rows: " + fs)


    if (fs == 0) {
      fs++;
      rows = this.initrows();
      console.log(rows)
      this.setState(() => ({
        rows: rows,
        rowsState: fs,
      }));
    }
    return (this.state.rows.map((row) => {
      return (
        <div className="row flex-wrap " id={row.id}>
          {row.columns.map((f) => {
            return (
              <div onDrop={(e) => this.handleDrop(e)} onDragOver={(e) => this.handleDragOver(e)} className="flex-wrap zelle col-4" id={f.id}>
                {(f.stone.id == "") ? f.id : this.getOneStone(f.stone)}
              </div>

            );
          })}
        </div>
      );
    }));
  }

  initrows() {
    //DominoData.json rows
    let rows = [];
    let columns = [];
    let z;
    let laenge = JSON.parse(this.state.data).laenge;
    console.log("laenge" + laenge)

    for (let i = 0; i < laenge; ++i) {
      for (let j = 0; j < laenge; ++j) {
        let id = i * laenge + j;
        z = { id: id, stone: { id: "", question: "question", answer: "   " } }
        columns.push(z);
        console.log(columns);
      }

      rows.push({ id: i, columns: columns });
      columns = [];
    }

    console.log(rows)
    return rows
  }

  //KOMMUNIKATION
  async updaterows(activePlayer, rows, pool) {
    // Kommunikation für Update rows
    const Ably = require('ably');
    const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
    await ably.connection.once('connected');
    const channelId = 'domino' + this.state.room;
    const channel = ably.channels.get(channelId);
    console.log("ROOM " + this.state.room)
    this.setState({
      activePlayer: activePlayer,
      pool: pool,
      rows: rows,
    });
    console.log("SEND: " + rows + pool + activePlayer)

    await channel.publish('updaterows', {
      user: this.state.user,
      rows: rows,
      pool: pool,
      activePlayer: activePlayer,

    });
    ably.close();

  }
  async handleStopGame() {
    let dat = JSON.parse(this.state.data)
    let questions = dat.correctQuestions

    this.setState(() => ({
      rowsState: 4,
      correctAnswers: [],
      wrongAnswers: [],
    }));

    let body = {
      state: 4,
      room: this.state.room,
      users: this.state.users,
      rows: this.state.rows,
      questions: questions
    };

    let url = BackendAccess.getUrlDomino();

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    console.log(data);

    if (data != undefined) {
      this.sendResultsFormular(data)
    } else {
      console.log(data)
      alert("somthing wrong")
    }
  }

  async sendResultsFormular(data) {
    console.log("Ende Spiel");
    const Ably = require('ably');
    const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
    await ably.connection.once('connected');
    const channelId = 'domino' + this.state.room;
    const channel = ably.channels.get(channelId);
    let dat = data

    let cAnswers = dat.correctAnswers
    let wAnswers = dat.wrongAnswers
    console.log("cAnswer" + cAnswers)
    console.log("wAnswer" + wAnswers)

    this.setState(() => ({
      rowsState: 4,
      wrongAnswers: wAnswers,
      correctAnswers: cAnswers
    }));

    console.log("SEND: " + wAnswers + cAnswers)

    let body = {
      game: "domino",
      data: {
        rowsState: 4,
        correctAnswers: cAnswers,
        wrongAnswers: wAnswers
      },
    }

    await channel.publish('resultDomino', body);

    console.log("gesendet an " + body);
    ably.close();

  }


  async setUpdaterows(message) {
    console.log("Got this from: " + message.data.user);
    console.log("NextPlayer: " + message.data.activePlayer)

    //nur bei den anderen rerender
    if (message.user != this.state.user) {
      console.log("Set State von anderen")
      this.setState({
        activePlayer: message.data.activePlayer,
        pool: message.data.pool,
        rows: message.data.rows,
      });
    }
  }
  async setResultData(message) {
    console.log("Got Result Sheet")

    let dat = message.data.data
    let cAnswers = dat.correctAnswers
    let wAnswers = dat.wrongAnswers

    console.log(dat)

    this.setState(() => ({
      rowsState: 4,
      wrongAnswers: wAnswers,
      correctAnswers: cAnswers
    }));
  }
  async componentDidMount() {
    //Connection Ably to transfer and update Data
    const Ably = require('ably');
    const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
    await ably.connection.once('connected');
    const channelId = 'domino' + this.state.room;
    const channel = ably.channels.get(channelId);
    console.log("Channel aktiv");
    channel.subscribe('updaterows', (message) => this.setUpdaterows(message))
    channel.subscribe('resultDomino', (message) => this.setResultData(message))

  }

  render() {
    console.log(this.state)
    return (
      <div name="domino" className="container">
        <div className="row">
          <h1 className="col-6 align-baseline">Domino</h1>
          <p className="col-6 align-text-bottom">Spieler {this.getActivePlayer()} ist am Zug</p>
        </div>
        {this.state.rowsState != 4 ?
          <div>
            <div className="row" id="firstPart">
              <div name="dominorows" id="dominorows" className="dominorows rounded container flex-wrap">
                {this.getrows()}
              </div>
            </div>

            <div id="secondPart" className="row">

              <div name="poolrows" disabled={(this.state.user != this.state.activePlayer)} id="pool" className="col-8 pool">
                {this.getStones()}
              </div>
              <div className="col-4">
                <button type="button" className="btn btn-light" disabled={(this.state.user != this.state.activePlayer)} onClick={(e) => this.handleSwitchPlayer()}>Zug beenden</button>
                <button type="button" className="btn btn-light" onClick={(e) => this.handleStopGame()}>Spiel beenden</button>
              </div>

            </div>
          </div>
          : <div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">question</th>
                  <th scope="col">answer</th>
                </tr>
              </thead>
              <tbody>
                {this.state.wrongAnswers == undefined ? "Waiting for data..." : this.state.wrongAnswers.map((question) => {
                  return (
                    <tr>
                      <td>{question.question}</td>
                      <td>{question.answer}</td>
                    </tr>
                  );
                })}
                <tr>
                  <th colspan="2">Richtige questions</th>
                </tr>
                <tr>
                  <th>questions</th>
                  <th>answer</th>
                </tr>
                {this.state.correctAnswers == undefined ? "Waiting for data..." : this.state.correctAnswers.map((question) => {
                  return (
                    <tr>
                      <td>{question.question}</td>
                      <td>{question.answer}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>}

      </div>
    );
  }
}

export default Domino;