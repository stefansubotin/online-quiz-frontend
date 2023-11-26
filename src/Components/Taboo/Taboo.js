import React, { Component } from 'react';
import '../../Stylesheets/span.css';
import '../../Stylesheets/taboo.css';

class Taboo extends Component {
    constructor(props) {
        super(props);
        // Initialisierung des Komponentenzustands mit den übergebenen Props
        this.state = {
            room: props.room,
            user: props.user,
            data: props.data,
            turn: 0,
            state: 0,
            message: '',
            messages: []
        }
    }
    // Methode zur Generierung der Channel-ID basierend auf der Raumnummer
    getChannelId() {
        return 'taboo' + this.state.room;
    }
    // Methode zur Verarbeitung der Nachrichten für die Anzeige
    getMessages() {
        let lst = [];
        for (let i = 0; i < this.state.messages.length; i++) {
            let m = JSON.parse(this.state.messages[i]);
            if (m.explainer) {
                lst.push(<div className='explainer'>&#091;{m.time}&#093;&nbsp;{m.user}:&nbsp;{m.text}</div>);
            }
            else {
                lst.push(<div><span className='invis fixed-size size50'>&nbsp;</span><span className='guesser'>&#091;{m.time}&#093;&nbsp;{m.user}:&nbsp;{m.text}</span></div>);
            }
        }
        return lst;
    }
    // Methode zur Generierung des Eingabefelds für Nachrichten
    getInput() {
        let dat = JSON.parse(this.state.data);
        return (
            <div>
                <input type="text" name="message" placeholder='Input Message' value={this.state.message} onChange={(e) => this.onMessageChange(e)} />
                <button onClick={(e) => this.sendMessage(e)} disabled={!this.state.state == 0}>Send Message</button>
            </div>
        )
    }
    // Methode zur Anzeige der verbotenen Wörter
    getForbiddenWords() {
        let dat = JSON.parse(this.state.data);
        console.log('FW Test');
        console.log(dat);
        for (let i = 0; i < dat.enemyTurns.length; i++) {
            console.log(dat.enemyTurns[i].turn);
            if (this.state.turn == dat.enemyTurns[i].turn) {
                let words = [dat.enemyTurns[i].answer];
                words = words.concat(dat.enemyTurns[i].forbiddenWords);
                console.log(dat.enemyTurns[i]);
                console.log(dat.enemyTurns[i].forbiddenWords);
                console.log(words);
                return (
                    <div>{words.join(', ')}</div>
                )
            }
        }
    }
    // Methode zur Generierung der Anzeige basierend auf dem Spielzustand
    getDisplay() {
        let dat = JSON.parse(this.state.data);
        let display = [];

        if (this.state.state == -1) {
            display.push(<div><h2 className='forbidden'>Verbotenes Wort wurde verwendet</h2></div>);
        }
        else if (this.state.state == 1) {
            display.push(<div><h2 className='correct'>Begriff erraten</h2></div>);
        }
        console.log(this.state.turn + '+' + dat.team + '%' + dat.teams)
        console.log(this.state.turn + dat.team % dat.teams);
        if ((this.state.turn + dat.team) % dat.teams == 0) {
            if (this.state.turn == dat.explainingTurn) {
                let words = [dat.explainingInfo.answer];
                words = words.concat(dat.explainingInfo.forbiddenWords);
                console.log(words);
                display.push(<div>{words.join(', ')}</div>);
            }
            display.push(this.getInput());
            display.push(this.getMessages());
            if (this.state.turn == dat.explainingTurn) {
                display.push(<button onClick={(e) => this.sendCorrect(e)} disabled={!this.state.state == 0}>Richtige Antwort!</button>);
                if ((this.state.turn + 1) == dat.maxTurns) display.push(<button onClick={(e) => this.sendEnd(e)} disabled={this.state.state == 0}>End</button>)
                else display.push(<button onClick={(e) => this.sendContinue(e)} disabled={this.state.state == 0}>Next Turn</button>);
            }
        }
        else {
            display.push(this.getForbiddenWords());
            display.push(this.getMessages());
            display.push(<div><button onClick={(e) => this.sendUsedForbiddenWord(e)} disabled={this.state.state == -1}>Forbidden Word Used!!</button></div>);
        }
        return display;
    }
    // Methode zum Überprüfen, ob das eingegebene Wort erlaubt oder verboten ist
    checkWord(toCheck) {
        let dat = JSON.parse(this.state.data);
        console.log('Check: ' + toCheck.toLowerCase() + ', ' + dat.explainingInfo.answer.toLowerCase());
        console.log(toCheck.toLowerCase() == dat.explainingInfo.answer.toLowerCase());
        if (toCheck.toLowerCase() == dat.explainingInfo.answer.toLowerCase()){
            console.log('1');
            return true;
        } 
        for (let i = 0; i < dat.explainingInfo.forbiddenWords.length; i++) {
            console.log('2 ' + i);
            console.log('Check: ' + toCheck.toLowerCase() + ', ' + dat.explainingInfo.forbiddenWords[i].toLowerCase());
            if (toCheck.toLowerCase() == dat.explainingInfo.forbiddenWords[i].toLowerCase()) return true;
        }
        return false;
    }
    // Methode zum Überprüfen, ob verbotene Wörter in der Nachricht verwendet werden
    checkForForbiddenWords(toCheck) {
        let lst = toCheck.split(' ');
        for (let i = 0; i < lst.length; i++) {
            console.log('ToCheck: ' + lst[i]);
            if (this.checkWord(lst[i])) {
                console.log(3);
                return true;
            }
        }
        return false;
    }
    // Methode zum Senden einer Nachricht über den Channel
    async sendMessage(event) {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        const channelId = this.getChannelId();
        const channel = ably.channels.get(channelId);

        let dat = JSON.parse(this.state.data);
        let explainer = dat.explainingTurn == this.state.turn;
        let message = {
            user: this.state.user,
            explainer: explainer,
            text: this.state.message
        }
        this.setState({
            room: this.state.room,
            user: this.state.user,
            data: this.state.data,
            turn: this.state.turn,
            state: this.state.state,
            message: '',
            messages: this.state.messages
        });
        await channel.publish('message', message);
        if (explainer) {
            if (this.checkForForbiddenWords(message.text)) {
                await this.sendUsedForbiddenWord();
            }
        }
        ably.close();
    }
    // Methode zum Senden einer Nachricht über verbotene Wörter
    async sendUsedForbiddenWord() {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        const channelId = this.getChannelId();
        const channel = ably.channels.get(channelId);

        await channel.publish('system', {
            type: 'forbidden'
        })
    }
    // Methode zum Senden einer Nachricht zum Fortsetzen des Spiels
    async sendContinue() {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        const channelId = this.getChannelId();
        const channel = ably.channels.get(channelId);

        await channel.publish('system', {
            type: 'continue'
        })
    }
    // Methode zum Senden einer Nachricht über die richtige Antwort
    async sendCorrect() {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        const channelId = this.getChannelId();
        const channel = ably.channels.get(channelId);

        await channel.publish('system', {
            type: 'correct'
        })
    }
    // Methode zum Senden einer Nachricht zum Beenden des Spiels
    async sendEnd(){
        let tmp = this.state.room.split('_');
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        const channelId = 'room' + tmp[0];
        const channel = ably.channels.get(channelId);

        await channel.publish('end', {
            content: 'empty'
        })
    }
    // Methode zum Aktualisieren des Nachrichten-Texts im Komponentenstatus
    onMessageChange(event) {
        this.setState({
            room: this.state.room,
            user: this.state.user,
            data: this.state.data,
            turn: this.state.turn,
            state: this.state.state,
            message: event.target.value,
            messages: this.state.messages
        })
    }
    // Methode zur Verarbeitung von Nachrichten aus dem Channel
    async onMessage(message) {
        console.log(message.data);
        let date = new Date();
        let dateString = date.getHours() + ':' + date.getMinutes();
        let messages = this.state.messages;
        messages.push(JSON.stringify({
            time: dateString,
            user: message.data.user,
            explainer: message.data.explainer,
            text: message.data.text
        }));
        this.setState({
            room: this.state.room,
            user: this.state.user,
            data: this.state.data,
            turn: this.state.turn,
            state: this.state.state,
            message: '',
            messages: messages
        });
        console.log(this.state);
    }
    // Methode zur Verarbeitung von Systemnachrichten aus dem Channel
    async onSystem(message) {
        console.log(message.data);
        switch (message.data.type) {
            case 'forbidden':
                this.setState({
                    room: this.state.room,
                    user: this.state.user,
                    data: this.state.data,
                    turn: this.state.turn,
                    state: -1,
                    message: this.state.message,
                    messages: this.state.messages
                })
                break;
            case 'correct':
                this.setState({
                    room: this.state.room,
                    user: this.state.user,
                    data: this.state.data,
                    turn: this.state.turn,
                    state: 1,
                    message: this.state.message,
                    messages: this.state.messages
                })
                break;
            case 'continue':
                this.setState({
                    room: this.state.room,
                    user: this.state.user,
                    data: this.state.data,
                    turn: this.state.turn + 1,
                    state: 0,
                    message: '',
                    messages: []
                });
                console.log(this.state);
                break;
        }
    }
    // Lebenszyklusmethode - Methode zum Abonnieren des Channels für Nachrichten und Systemnachrichten 
    async componentDidMount() {
        console.log(JSON.parse(this.state.data));
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        const channelId = this.getChannelId();
        const channel = ably.channels.get(channelId);
        await channel.subscribe('message', (message) => this.onMessage(message));
        await channel.subscribe('system', (message) => this.onSystem(message));
    }
    // Lebenszyklusmethode - Methode zum Abbestellen des Channels und Schließen der Ably-Verbindung
    componentWillUnmount(){
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        ably.connection.once('connected');
        const channelId = this.getChannelId();
        const channel = ably.channels.get(channelId);
        channel.unsubscribe('message');
        channel.unsubscribe('system');
        ably.close();
    }

    // Methode zur Rendern der Komponente
    render() {
        return (
            <div name='taboo'>{this.getDisplay()}</div>
        )
    }
}

export default Taboo; 