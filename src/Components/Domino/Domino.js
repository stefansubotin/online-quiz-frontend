import React, { Component } from "react";
import edge from "./edge.png"
import "../../Stylesheets/domino.css";
import BackendAccess from "../../Tools/BackendAccess";
import Spielfeld from "./Spielfeld";


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
        let poolNew = this.initStones()
        let rowsNew = this.initField()
        console.log("Pool: ")
        console.log(poolNew)
        console.log("Feld: ")
        console.log(rowsNew)
        console.log("Constructor: ")
        this.setState(() => ({
            pool: poolNew,
            rows: rowsNew
        }))
        console.log(this.state)
    }

    /**
     *
     *
     */
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

    /**
     *
     *
     * @return {String} 
     */
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
        console.log(this.state)
        /** 
            Es wird das Spielfeld zurück gegeben, solange der Status nicht vier ist. 
            Sonst wird die Übersicht der Ergebnisse gezeigt. 
         */
        return (
            <div name="domino" className="container">
                <div className="row">
                    <h1 className="col-6 align-baseline">Domino</h1>
                    <p className="col-6 align-text-bottom">Spieler {this.getActivePlayer} ist am Zug</p>
                </div>
                {this.rowsState != 4 ?
                    <Spielfeld
                        laenge={this.state.laenge}
                        user={this.state.user}
                        activePlayer={this.state.activePlayer}
                        pool={this.state.pool}
                        rows={this.state.rows}
                        rowsState={this.state.rowsState}
                        handleStopGame={this.handleStopGame}
                        updaterows={this.updaterows}>
                    </Spielfeld>
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