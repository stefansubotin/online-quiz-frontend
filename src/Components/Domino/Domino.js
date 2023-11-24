import React, { Component } from "react";
import edge from "./edge.png"
import "../../Stylesheets/domino.css";
import BackendAccess from "../../Tools/BackendAccess";


/**
 * Erstellt das Quiz für die übergebene Spieler und 
 * regelt die direkte Interaktion und Kommunikation mit 
 * der Oberfläche, über Ably und der Datenbank.
 *
 * @class Domino
 * @extends {Component}
 */
class Domino extends Component {
    /** 
     * Instanziiert ein Domino Objekt und initiiert ein State. 
     * @constructor
     * @param {JSON} props
     */
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

    /**
     * Gibt bei bekannter Zellen ID und Zeile die Spalte zurück
     *
     * @param {number} id
     * @param {number} row
     * @return {number} 
     */
    getZielZelle(id, row) {
        let laenge = JSON.parse(this.state.data).laenge;
        let spalte = (id - (row * laenge));
        return spalte;
    }

    /**
     * Dreht den Stein um eine Ausrichtung im Uhrzeigersinn. 
     * Setzt den State neu und sendet Update an alle.
     * @async
     * @param {MouseEvent} e
     */
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
            if (!h && fO && !d) {
                console.log("Von Zustand 1 nach 2")
                h = false;
                fO = true;
                d = true;
            } else if (!h && fO && d) {
                console.log("Von Zustand 2 nach 3")
                fO = false
                h = true
                d = false
            } else if (h && !fO && !d) {
                console.log("Von Zustand 3 nach 4")
                h = true;
                fO = false;
                d = true
            } else if (h && !fO && d) {
                console.log("Von Zustand 4 nach 5")
                h = false;
                fO = false;
                d = false
            } else if (!h && !fO && !d) {
                console.log("Von Zustand 5 nach 6")
                fO = false
                h = false
                d = true
            } else if (!h && !fO && d) {
                console.log("Von Zustand 6 nach 7")
                fO = true
                h = true
                d = false
            } else if (h && fO && !d) {
                console.log("Von Zustand 7 nach 8")
                fO = true
                h = true
                d = true
            } else if (h && fO && d) {
                console.log("Von Zustand 8 nach 1")
                fO = true
                h = false
                d = false
            } else {
                console.log("nichts passiert ");
            }
            rows1[zellenRow].columns[zelle].stone.h = h;
            rows1[zellenRow].columns[zelle].stone.fO = fO;
            rows1[zellenRow].columns[zelle].stone.d = d;
            console.log("STein gedreht ")
        }
        this.setState({
            pool: pool1,
            rows: rows1,
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


    /**
     * Speichert temporär für das Bewegen die Herkunft
     * des bewegten Steins.
     *
     * @param {DragEvent} e
     */
    handleDragStart(e) {
        let id = e.currentTarget.id;
        let pid = e.target.parentNode.id;
        let ppid = e.currentTarget.parentNode.parentNode.id;
        console.log("DragStart: " + id + "parent: " + pid)
        e.dataTransfer.setData("id", id);
        e.dataTransfer.setData("parent", pid)
        e.dataTransfer.setData("grandparent", ppid)

    }
    /**
     * Erlaubt das hoovern über einem Element.
     *
     * @param {DragEvent} e
     */
    handleDragOver(e) {
        e.preventDefault();
    }
    /**
     * Kopiert den Stein in das Element über das er fallen gelassen wurde
     * und löscht es aus seinem vorherigen Elternelement.
     * Aktualisiert den State und sendet das Update an alle.
     * 
     * @async
     *
     * @param {*} e
     */
    async handleDrop(e) {
        // Daten über Stein und Parent vom Stein
        let laenge = JSON.parse(this.state.data).laenge;
        let ziel = e.currentTarget.id;
        let zielRow = e.currentTarget.parentNode.id;
        let zielZelle = (ziel - (zielRow * laenge));
        let origin = e.dataTransfer.getData("id")
        let originParent = e.dataTransfer.getData("parent")
        let originRow = e.dataTransfer.getData("grandparent")
        let originZelle;

        // Feld und Pool Kopie zur einfacheren Handhabung
        let pool1 = this.state.pool;
        let poolNeu = [];
        let rows1 = this.state.rows;
        let stone;

        // Wenn der Stein  aus dem Pool kommt und nicht bereits einer liegt
        if (originParent == "pool" && rows1[zielRow].columns[zielZelle].stone.id == "") {
            //Findet Stein im Pool und Kopie speichern
            for (let i = 0; i < pool1.length; ++i) {
                if (pool1[i].id == origin) {
                    console.log("stone " + origin + "gefunden: " + pool1[i].id)
                    stone = pool1[i];
                }
            }

            // Kopie des Steins in die Zelle kopieren
            rows1[zielRow].columns[zielZelle].stone.id = stone.id;
            rows1[zielRow].columns[zielZelle].stone.answer = stone.answer;
            rows1[zielRow].columns[zielZelle].stone.question = stone.question;
            rows1[zielRow].columns[zielZelle].stone.h = stone.h;
            rows1[zielRow].columns[zielZelle].stone.fO = stone.fO
            rows1[zielRow].columns[zielZelle].stone.d = stone.d

            // Kopie des Pools ohne den kopierten Stein
            for (let i = 0; i < pool1.length; ++i) {
                if (pool1[i].id == origin) {
                    console.log(pool1[i].id + " wird übersprungen. ")
                } else {
                    poolNeu.push(pool1[i]);
                }
            }
        }
        // Stein kommt aus dem Feld wenn Parent eine Zahl ist und Zelle ist leer
        else if ((!isNaN(originParent)) && rows1[zielRow].columns[zielZelle].stone.id == "") {
            if (originParent < 0) {
                console.log("kleiner Parent" + originParent)
            }
            originZelle = (originParent - (originRow * laenge));
            //Kopieren des Steins in die gewünschte Zelle
            rows1[zielRow].columns[zielZelle].stone.id = rows1[originRow].columns[originZelle].stone.id;
            rows1[zielRow].columns[zielZelle].stone.answer = rows1[originRow].columns[originZelle].stone.answer;
            rows1[zielRow].columns[zielZelle].stone.question = rows1[originRow].columns[originZelle].stone.question;
            rows1[zielRow].columns[zielZelle].stone.h = rows1[originRow].columns[originZelle].stone.h;
            rows1[zielRow].columns[zielZelle].stone.fO = rows1[originRow].columns[originZelle].stone.fO;
            rows1[zielRow].columns[zielZelle].stone.d = rows1[originRow].columns[originZelle].stone.d;

            //löschen des Steins aus der ursprünglichen Zelle
            rows1[originRow].columns[originZelle].stone.id = "";
            rows1[originRow].columns[originZelle].stone.answer = "";
            rows1[originRow].columns[originZelle].stone.question = "";
            // Pool bleibt unverändert
            poolNeu = this.state.pool
        }
        // Falls der Stein besetzt ist oder kein definierten Parent hat
        else {
            console.log("Error")
            // Pool bleibt unverändert
            poolNeu = this.state.pool
        }
        this.setState({
            pool: poolNeu,
            rows: rows1,
        });
        this.updaterows(this.state.activePlayer, rows1);
    }
    /**
     * Gibt den Pool anhand des States zurück.
     *
     * @return {React.JSX.Element} 
     */
    getPool() {
        let fs = this.state.rowsState
        let stones = [];
        // Noch kein Pool initiiert
        if (fs == 1) {
            fs++;
            stones = this.initStones();
            this.setState(() => ({
                pool: stones,
                rowsState: fs,
            }));
        }
        return (this.state.pool.map((stone) => this.getOneStone(stone)));
    }

    /**
     * Einmaliges initiieren der Steine.
     *
     * @return {Array<Object>} 
     */
    initStones() {
        let dat = JSON.parse(this.state.data)
        let amount = dat.questions.length;
        let stones = [];

        /*  Array wird mit den Frage Antwort - Paaren gefüllt und 
            der Default Ausrichtung */
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

    /**
     * Gibt einen Stein als JSX.Element zurück.
     *
     * @param {Object} stone
     * @return {React.JSX.Element} 
     */
    getOneStone(stone) {
        // Werte des Steins
        let id = stone.id
        let question = stone.question
        let answer = stone.answer
        // Ausrichtung des Steins
        let h = stone.h
        let fOben = stone.fO
        let d = stone.d

        return (
            <ul
                className={h ? "list-group list-group-horizontal" : "list-group list-group-flush"}
                id={id}
                style={{ height: '100px', width: '100%' }}
                draggable onClick={this.state.user != this.state.activePlayer ? null : (e) => this.handleRotateStone(e)}
                onDragStart={this.state.user != this.state.activePlayer ? null : (e) => this.handleDragStart(e)}
            >
                {d ?
                    <>
                        <ul id="-1" className={h ? "list-group" : "list-group list-group-horizontal"}>
                            {h ? <li className={fOben ? "list-group-item col-6 bg-secondary-subtle" : "  list-group-item col-6"}>{fOben ? question : answer}</li> : this.getDiagonalStoneFiller(h, fOben, d)}
                            {h ? this.getDiagonalStoneFiller(h, fOben, d) : <li className={fOben ? "  list-group-item col-6 bg-secondary-subtle" : "  list-group-item col-6 "}>{fOben ? question : answer}</li>}
                        </ul>
                        <ul id="-2" className={h ? "list-group" : "list-group list-group-horizontal"}>
                            {h ? this.getDiagonalStoneFiller(h, fOben, d) : <li className={fOben ? "list-group-item col-6" : " bg-secondary-subtle list-group-item col-6"}>{fOben ? answer : question}</li>}
                            {h ? <li className={fOben ? "list-group-item col-6" : " bg-secondary-subtle list-group-item col-6"}>{fOben ? answer : question}</li> : this.getDiagonalStoneFiller(h, fOben, d)}
                        </ul>
                    </>
                    : <>
                        <li className={fOben ? "list-group-item col-6 bg-secondary-subtle text-emphasis-secondary" : "list-group-item col-6"}>{fOben ? question : answer}</li>
                        <li className={fOben ? "list-group-item col-6 " : "list-group-item col-6 bg-secondary-subtle text-emphasis-secondary"}>{fOben ? answer : question}</li>
                    </>
                }
            </ul>
        )
    }

    /**
     * Gibt eine leere Ecke des Steins zurück.
     *
     * @param {Boolean} h
     * @param {Boolean} fOben
     * @param {Boolean} d
     * @return {React.JSX.Element} 
     */
    getDiagonalStoneFiller(h, fOben, d) {
        let deg = 0;
        if (h && fOben && d) {
            deg = 90;
        } else if (!h && fOben && d) {
            deg = 180
        } else if (h && !fOben && d) {
            deg = -90;
        }
        let style = { transform: 'rotate(' + deg + 'deg)' };
        return <li className="list-group-item col-6 empty"><img className="edge" src={edge} alt="Logo" style={style} />  </li>
    }
    /**
     * Gibt das Feld anhand des States zurück.
     *
     * @returns {React.JSX.Element}
     */
    getField() {
        let fs = this.state.rowsState
        let rows = [];
        // Noch kein Feld initiiert
        if (fs == 0) {
            fs++;
            rows = this.initField();
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
                            <div onDrop={(e) => this.handleDrop(e)} onDragOver={(e) => this.handleDragOver(e)} className="flex-wrap border border-light zelle col-2" id={f.id}>
                                {(f.stone.id == "") ? f.id : this.getOneStone(f.stone)}
                            </div>

                        );
                    })}
                </div>
            );
        }));
    }

    /**
     * Initiiert das Feld mit der Länge aus der Datenbank, mit den Zellen IDs als
     * Representanten der leeren Steine
     *
     * @returns {Array<Object>}
     */
    initField() {
        let rows = [];
        let columns = [];
        let z;
        let laenge = JSON.parse(this.state.data).laenge;

        // Füllt die Zeilen
        for (let i = 0; i < laenge; ++i) {
            // Füllt die Zellen jeder Spalte mit den Defaultwerten
            for (let j = 0; j < laenge; ++j) {
                let id = i * laenge + j;
                z = { id: id, stone: { id: "", question: "", answer: "" } }
                columns.push(z);
            }
            rows.push({ id: i, columns: columns });
            columns = [];
        }
        return rows
    }

    /**
     * Versendet Nachrichten mit einem Filter über Ably.
     *  
     * @async
     * @param {String} reason
     * @param {Object} body
     */
    async sendMessage(reason, body) {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');

        var channel;
        var channelId;
        if (reason == 'end') {
            let tmp = this.state.room.split('_');
            channelId = 'room' + tmp[0];
            channel = ably.channels.get(channelId);
        } else {
            channelId = 'domino' + this.state.room;
            channel = ably.channels.get(channelId);
        }
        await channel.publish(reason, body);
        ably.close();

    }
    /**
     * Bereitet die Nachricht für den Sprung 
     * zurück in die Lobby vor und sendet sie ab. 
     *
     * @async
     * @returns {*}
     */
    async backToLobby() {
        var body = {
            content: 'empty'
        }
        this.sendMessage('end', body)
    }
    /**
     * Ändert Lokal und für alle Mitspieler 
     * den State.
     *
     * @async
     * @param {String} activePlayer
     * @param {Array} rows
     */
    async updaterows(activePlayer, rows) {
        // Kommunikation für Update rows

        this.setState({
            activePlayer: activePlayer,
            rows: rows,
        });

        console.log("SEND: " + rows + activePlayer)
        var body = {
            user: this.state.user,
            rows: rows,
            activePlayer: activePlayer,

        }
        this.sendMessage('updaterows', body)
    }
    /**
     * Beendet das Spiel und sendet das Feld an 
     * das Backend und erhält zwei Listen mit den 
     * richtigen und falschen Antworten.
     *
     * @async
     */
    async handleStopGame() {
        let dat = JSON.parse(this.state.data)
        let questions = dat.correctQuestions

        this.setState(() => ({
            rowsState: 4,
            correctAnswers: [],
            wrongAnswers: [],
        }));
        // State 4 ändert die View vom Spielfeld zur Übersicht des Ergebnisses
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
        // Die Listen werden in die Übersicht übertragen, wenn es keine Fehler gab.
        if (data != undefined) {
            this.sendOverview(data)
        } else {
            console.log(data)
            alert("somthing wrong")
        }
    }

    /**
     * Sendet die Ergebnisse mit dem neuen
     * Status des Spiels an alle Teilnehmer.
     *
     * @async
     * @param {JSON} data
     */
    async sendOverview(data) {
        console.log("Ende Spiel");
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

        this.sendMessage('resultDomino', body)
    }
    /**
     * Aktualisiert den State, falls die Nachricht
     * nicht vom Nutzer selbst gesendet wurde.
     *
     * @async
     * @param {*} message
     * @returns {*}
     */
    async setUpdaterows(message) {
        console.log("Got this from: " + message.data.user);
        console.log("NextPlayer: " + message.data.activePlayer)

        // Von anderem Nutzer
        if (message.user != this.state.user) {
            console.log("Set State von anderen")
            this.setState({
                activePlayer: message.data.activePlayer,
                rows: message.data.rows,
            });
        }
    }
    /**
     * Erweitert den State um zwei Listen und
     * setzt den Status des Spiels auf 4
     *
     * @async
     * @param {*} message
     */
    async setResultData(message) {
        let dat = message.data.data
        let cAnswers = dat.correctAnswers
        let wAnswers = dat.wrongAnswers

        this.setState(() => ({
            rowsState: 4,
            wrongAnswers: wAnswers,
            correctAnswers: cAnswers
        }));
    }
    /**
     * Verbindet sich mit Ably und wartet auf Nachrichten 
     * von anderen Nutzern
     * die mit den Filtern übereinstimmen.
     *
     * @async
     */
    async componentDidMount() {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        const channelId = 'domino' + this.state.room;
        const channel = ably.channels.get(channelId);
        channel.subscribe('updaterows', (message) => this.setUpdaterows(message))
        channel.subscribe('resultDomino', (message) => this.setResultData(message))
    }

    /**
     * Gibt das Spiel an die Elternkomponente zurück.
     * 
     * @returns {React.JSX.Element}
     */
    render() {
        /** 
            Es wird das Spielfeld zurück gegeben, solange der Status nicht vier ist. 
            Sonst wird die Übersicht der Ergebnisse gezeigt. 
         */
        return (
            <div name="domino" className="container">
                <div className="row">
                    <h1 className="col-6 align-baseline">Domino</h1>
                    <p className="col-6 align-text-bottom">Spieler {this.getActivePlayer()} ist am Zug</p>
                </div>
                {this.state.rowsState != 4 ?
                    <div>
                        <div className="row" id="firstPart">
                            <div name="dominoRows" id="dominoRows" className="dominoRows rounded container flex-wrap">
                                {this.getField()}
                            </div>
                        </div>

                        <div id="secondPart" className="row">

                            <div name="poolrows" disabled={(this.state.user != this.state.activePlayer)} id="pool" className="col-8 pool">
                                {this.getPool()}
                            </div>
                            <div className="col-4">
                                <button type="button" style={{ margin: '10px' }} class="btn btn-secondary" disabled={(this.state.user != this.state.activePlayer)} onClick={(e) => this.handleSwitchPlayer()}>Zug beenden</button>
                                <button type="button" style={{ margin: '10px' }} class="btn btn-secondary" onClick={(e) => this.handleStopGame()}>Spiel beenden</button>
                            </div>

                        </div>
                    </div>
                    : <div>
                        <table className="table table-striped">
                            <tr>
                                <th colspan="2">Falsche Fragen</th>
                            </tr>
                            <tr>
                                <th scope="col">Frage</th>
                                <th scope="col">Antwort</th>
                            </tr>
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
                                    <th colspan="2">Richtige Fragen</th>
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
                        <button type="button" style={{ margin: '10px' }} class="btn btn-secondary" onClick={(e) => this.backToLobby()}>Zurück zur Lobby</button>
                    </div>}

            </div>
        );
    }
}

export default Domino;