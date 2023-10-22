import React, { Component } from 'react';
import '../../Stylesheets/span.css';
import '../../Stylesheets/taboo.css';
import BackendAccess from '../../Tools/BackendAccess';

class Taboo extends Component {
    constructor(props) {
        super(props);
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

    getChannelId() {
        return 'taboo' + this.state.room;
    }

    getMessages() {
        let lst = [];
        for (let i = 0; i < this.state.messages.length; i++) {
            let m = JSON.parse(this.state.messages[i]);
            if (m.explainer) {
                lst.push(<div className='explainer'>&#091;{m.time}&#091;&nbsp;{m.user}:&nbsp;{m.text}</div>);
            }
            else {
                lst.push(<div><span className='invis fixed-size size50'>&nbsp;</span><span className='explainer'>&#091;{m.time}&#091;&nbsp;{m.user}:&nbsp;{m.text}</span></div>);
            }
        }
    }

    getInput() {
        let dat = JSON.parse(this.state.data);
        return (
            <div>
                <input type="text" name="message" placeholder='Input Message' value={this.state.message} onChange={(e) => this.onMessageChange(e)} />
                <button onClick={(e) => this.sendMessage(e)} disabled={!this.state.state == 0}>Send Message</button>
            </div>
        )
    }

    getForbiddenWords() {
        let dat = JSON.parse(this.state.data);
        let enemyTurn;
        for (let i = 0; i < dat.enemyTurns; i++) {
            if (this.state.turn == dat.enemyTurns[i].turn) enemyTurn = dat.enemyTurns[i];
        }
        console.log("enemyTurn");
        console.log(enemyTurn);
        let words = [enemyTurn.answer];
        words = words.concat(enemyTurn.forbiddenWords);
        return (
            <div>{words.join(', ')}</div>
        )
    }

    getDisplay() {
        let dat = JSON.parse(this.state.data);
        let display = [];

        if (this.state.state == -1) {
            display.push(<div><h2 className='forbidden'>Verbotenes Wort wurde verwendet</h2></div>);
        }
        else if (this.state.state == 1) {
            display.push(<div><h2 className='correct'>Begriff erraten</h2></div>);
        }

        if ((this.state.turn + dat.team % dat.teams == 0)) {
            display.push(this.getInput());
            display.push(this.getMessages());
            if (this.state.turn == dat.explainingTurn) {
                display.push(<button onClick={(e) => this.continue(e)} disabled={this.state.state == 0}>Next Turn</button>);
            }
        }
        else {
            display.push(this.getForbiddenWords());
            display.push(this.getMessages());
            display.push(<div><button onClick={(e) => this.sendUsedForbiddenWord(e)} disabled={this.state.state == -1}>Forbidden Word Used!!</button></div>);
        }
    }

    checkWord(toCheck) {
        let dat = JSON.parse(this.state.data);
        if (toCheck.toLowerCase() == dat.explainingInfo.answer.toLowerCase()) return true;
        for (let i = 0; i < dat.explainingInfo.length; i++) {
            if (toCheck.toLowerCase() == dat.explainingInfo.forbiddenWords[i].toLowerCase()) return true;
        }
        return false;
    }

    checkForForbiddenWords(toCheck) {
        let lst = toCheck.split(' ');
        for (let i = 0; i < lst.length; i++) {
            if (this.checkWord(lst[i])) return true;
        }
        return false;
    }

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
            text: event.target.text.value
        }
        await channel.publish('message', message);
        if (explainer) {
            if (!this.checkForForbiddenWords(message.text)) {
                await this.sendUsedForbiddenWord();
            }
        }
        ably.close();
    }

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

    continue(event) {
        this.setState({
            room: this.state.room,
            user: this.state.user,
            data: this.state.data,
            turn: this.state.turn + 1,
            state: 0,
            message: '',
            messages: []
        })
    }

    async onMessage(message) {
        let date = new Date();
        let dateString = date.getHours + ':' + date.getMinutes;
        let messages = this.state.messages;
        messages.push(JSON.stringify({
            time: dateString,
            user: message.data.user,
            explainer: message.data.explainer,
            text: message.data.text
        }));
    }

    async onSystem(message) {
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
                })
                break;
        }
    }

    async componentDidMount() {
        console.log(JSON.parse(data));
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        const channelId = this.getChannelId();
        const channel = ably.channels.get(channelId);
        await channel.subscribe('message', (message) => this.onMessage(message));
        await channel.subscribe('system', (message) => this.onSystem(message));
    }

    render() {
        return (
            <div name='taboo'>{this.getDisplay()}</div>
        )
    }
}

export default Taboo; 