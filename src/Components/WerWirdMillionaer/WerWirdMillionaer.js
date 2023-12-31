import React, { Component } from 'react';
import '../../Stylesheets/wwm.css';

class WerWirdMillionaer extends Component {
    constructor(props) {
        super(props);
        // Initialisierung des Komponentenstatus mit den übergebenen Props
        this.state = {
            room: props.room,
            user: props.user,
            data: props.data,
            currentQuestion: 0,
            correctAnswer: -1,
            chosenAnswer: -1,
        }
    }
    // Methode zur Generierung der Channel-ID basierend auf der Raumnummer
    getChannelId() {
        return 'wwm' + this.state.room;
    }
    // Methode zur Erstellung der Antwortmöglichkeiten
    getCurrentAnswers() {
        console.log(this.state);
        let dat = JSON.parse(this.state.data);
        let disabled = dat.moderator == this.state.user || this.state.chosenAnswer != -1;

        let answers = [];
        for (let i = 0; i < dat.list[this.state.currentQuestion].answers.length; i++) {
            let style = '';
            let letter = 'X) ';
            switch (i) {
                case 0:
                    letter = 'A) ';
                    break;
                case 1:
                    letter = 'B) ';
                    break;
                case 2:
                    letter = 'C) ';
                    break;
                case 3:
                    letter = 'D) ';
                    break;
            }
            if (i == this.state.correctAnswer) style = 'correct';
            else if (i == this.state.chosenAnswer) style = 'chosen';
            answers.push(<button name={i} onClick={(e) => this.onAnswer(e)} className={style} disabled={disabled}>{letter + dat.list[this.state.currentQuestion].answers[i]}</button>);
            if (i % 2 == 1) answers.push(<br />);
        }
        return answers;
    }
    // Methode zur Erstellung der Quiz-Anzeige (Anzeige der Frage und Antwortmöglichkeiten)
    getDisplay() {
        let dat = JSON.parse(this.state.data);
        let display = [];
        let disabled = dat.moderator == this.state.user || this.state.chosenAnswer == -1;
        display.push(<div>{this.state.currentQuestion + 1}/10:</div>);
        display.push(<br />);
        display.push(<div>{dat.list[this.state.currentQuestion].question}</div>)
        display.push(this.getCurrentAnswers());
        if ((this.state.currentQuestion + 1) == dat.list.length) display.push(<button onClick={(e) => this.sendEnd()} disabled={disabled}>End</button>);
        else display.push(<button onClick={(e) => this.onContinue()} disabled={disabled}>Next Question</button>);
        return display;
    }
    // Methode zum Senden einer Nachricht über Ably, dass das Spiel fortgesetzt werden soll
    async onContinue() {
        let dat = JSON.parse(this.state.data);
        if (dat.moderator != "") {
            const Ably = require('ably');
            const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
            await ably.connection.once('connected');
            const channelId = this.getChannelId();
            const channel = ably.channels.get(channelId);

            let body = {
                type: 1
            }
            await channel.publish('player', body);
            ably.close();

        }
        this.setState({
            room: this.state.room,
            user: this.state.user,
            data: this.state.data,
            currentQuestion: this.state.currentQuestion + 1,
            correctAnswer: -1,
            chosenAnswer: -1
        });

    }
    // Methode zum Senden einer Nachricht über Ably, dass das Spiel enden soll
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
     // Methode zur Verarbeitung von Spieler-Guess-Nachrichte
    async onGuess(message) {
        let dat = JSON.parse(this.state.data);
        console.log(dat.moderator);
        console.log(this.state.user);
        console.log(message);
        if (message.data.type == 1) {
            this.setState({
                room: this.state.room,
                user: this.state.user,
                data: this.state.data,
                currentQuestion: this.state.currentQuestion + 1,
                correctAnswer: dat.list[this.state.currentQuestion + 1].correct,
                chosenAnswer: -1
            });
        }
        else {
            const Ably = require('ably');
            const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
            await ably.connection.once('connected');
            const channelId = this.getChannelId();
            const channel = ably.channels.get(channelId);
            let correct = dat.list[this.state.currentQuestion].correct;
            console.log(correct);
            let body = {
                correct: correct
            }
            await channel.publish('moderator', body);
            ably.close();
            this.setState({
                room: this.state.room,
                user: this.state.user,
                data: this.state.data,
                currentQuestion: this.state.currentQuestion,
                correctAnswer: correct,
                chosenAnswer: message.data.answer
            });
        }

    }
    // Methode zur Verarbeitung von Moderator-Nachrichten
    async onModerator(message) {
        console.log(message);
        this.setState({
            room: this.state.room,
            user: this.state.user,
            data: this.state.data,
            currentQuestion: this.state.currentQuestion,
            correctAnswer: message.data.correct,
            chosenAnswer: this.state.chosenAnswer
        });
    }
    // Methode zur Verarbeitung von Antworten
    async onAnswer(e) {
        let i = e.target.name;
        let dat = JSON.parse(this.state.data);
        let chosen = i;
        console.log(chosen);
        if (dat.moderator == "") {
            let correct = dat.list[this.state.currentQuestion].correct;
            console.log(correct);
            this.setState({
                room: this.state.room,
                user: this.state.user,
                data: this.state.data,
                currentQuestion: this.state.currentQuestion,
                correctAnswer: correct,
                chosenAnswer: chosen
            });
        }
        else {
            const Ably = require('ably');
            const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
            await ably.connection.once('connected');
            const channelId = this.getChannelId();
            const channel = ably.channels.get(channelId);

            let body = {
                answer: i
            }
            await channel.publish('player', body);
            ably.close();
            this.setState({
                room: this.state.room,
                user: this.state.user,
                data: this.state.data,
                currentQuestion: this.state.currentQuestion,
                correctAnswer: -1,
                chosenAnswer: i
            });
        }
    }
    // Lebenszyklusmethode - Methode zum Abonnieren des Channels für Nachrichten und Systemnachrichten  
    async componentDidMount() {
        let dat = JSON.parse(this.props.data);
        console.log(dat);
        if (dat.moderator == "") return;

        console.log('Moderator present')
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        const channelId = this.getChannelId();
        const channel = ably.channels.get(channelId);

        let correct = dat.list[0].correct;
        console.log(correct);
        if (dat.moderator == this.state.user) {
            await channel.subscribe('player', (message) => this.onGuess(message));
            this.setState({
                room: this.state.room,
                user: this.state.user,
                data: this.state.data,
                currentQuestion: this.state.currentQuestion,
                correctAnswer: correct,
                chosenAnswer: -1
            });
        }
        else await channel.subscribe('moderator', (message) => this.onModerator(message));
    }
    // Lebenszyklusmethode - Methode zum Abbestellen des Channels und Schließen der Ably-Verbindung 
    componentWillUnmount() {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        ably.connection.once('connected');
        const channelId = this.getChannelId();
        const channel = ably.channels.get(channelId);
        channel.unsubscribe('moderator');
        channel.unsubscribe('player');
        ably.close();
    }
    // Methode zur Rendern der Komponente
    render() {
        return (
            <div nmae='wwm'>{this.getDisplay()}</div>
        )
    }
}

export default WerWirdMillionaer;