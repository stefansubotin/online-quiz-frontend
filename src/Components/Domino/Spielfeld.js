import React, { Component } from "react";
import edge from "./edge.png"
import "../../Stylesheets/domino.css";
import BackendAccess from "../../Tools/BackendAccess";


/**
 * Erstellt das Quiz für die übergebene Spieler und 
 * regelt die direkte Interaktion und Kommunikation mit 
 * der Oberfläche, über Ably und der Datenbank.
 *
 * @class Spielfeld
 * @extends {Component}
 */
class Spielfeld extends Component {
    /** 
     * Instanziiert ein Spielfeld Objekt und initiiert ein State. 
     * @constructor
     * @param {JSON} props
     */
    constructor(props) {
        super(props);
        this.state = {
            laenge: props.laenge,
            user: props.user,
            activePlayer: props.activePlayer,
            pool: props.pool,
            rows: props.rows,
            rowsState: 0,
            changeState: props.changeState,
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
        let laenge = this.state.laenge;
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
        this.props.updaterows(this.state.activePlayer, rows1, pool1);
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
        let laenge = this.state.laenge;
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
        this.props.updaterows(this.state.activePlayer, rows1);
    }
    /**
     * Gibt den Pool anhand des States zurück.
     *
     * @return {React.JSX.Element} 
     */
    getPool() {

        return (this.state.pool.map((stone) => this.getOneStone(stone)));
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
            <>
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
                            <button type="button" style={{ margin: '10px' }} class="btn btn-secondary" onClick={(e) => this.props.handleStopGame()}>Spiel beenden</button>
                        </div>

                    </div>
                </div>

            </>
        );
    }
}

export default Spielfeld;