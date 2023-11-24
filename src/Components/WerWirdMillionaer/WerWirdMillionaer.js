import React, { Component } from 'react';
import '../../Stylesheets/wwm.css';

class WerWirdMillionaer extends Component {
    constructor(props) {
        super(props); 
        // Initialisierung des Komponentenzustands
        this.state = {
            room: props.room,
            user: props.user,
            data: props.data,
            currentQuestion: 0,
            correctAnswer: -1,
            chosenAnswer: -1,
        }
    }
    // Funktion zur Erstellung des Ably-Kanalnamens
    getChannelId() {
        return 'wwm' + this.state.room;
    }

    //Funktion zum Rendern der Antwortmöglichkeiten
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

    useFiftyFiftyJoker() {
        if (this.state.chosenAnswer === -1) {
            // Nur den Joker verwenden, wenn noch keine Antwort ausgewählt wurde
            const Ably = require('ably');
            const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
            ably.connection.once('connected').then(async () => {
                const channelId = this.getChannelId();
                const channel = ably.channels.get(channelId);

                let body = {
                    type: 2,  // 2 steht für die Verwendung des 50/50-Jokers
                };
                await channel.publish('player', body);
                ably.close();
            });
        }
    }
    

    // Funktion zum Rendern der Quiz-Anzeige
    getDisplay() {
        let dat = JSON.parse(this.state.data);
        let display = [];
        let disabled = dat.moderator == this.state.user || this.state.chosenAnswer == -1;
        display.push(<div>{this.state.currentQuestion + 1}/10:</div>);
        display.push(<br />);
        display.push(<div>{dat.list[this.state.currentQuestion].question}</div>)
        display.push(this.getCurrentAnswers());
         // Button für den 50/50-Joker hinzufügen
         display.push(<button onClick={() => this.useFiftyFiftyJoker()} disabled={disabled}>50/50 Joker</button>);

        if ((this.state.currentQuestion + 1) === dat.list.length) 
            display.push(<button onClick={(e) => this.sendEnd()} disabled={disabled}>End</button>);
        else display.push(<button onClick={(e) => this.onContinue()} disabled={disabled}>Next Question</button>);
        return display;
    }

    // Handler für den Fortsetzungs-Button
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

    // Handler für den End-Button
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

    // Handler für geratene Antworten
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
    
    // Handler für Moderator-Nachrichten
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

    // Handler für gegebene Antworten
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

     // Hilfsfunktion zum Rendern der Antwortmöglichkeiten mit 50/50-Joker
     getCurrentAnswers = () => {
        const { data, user, chosenAnswer, correctAnswer, currentQuestion } = this.state;
        const dat = JSON.parse(data);
        const disabled = dat.moderator === user || chosenAnswer !== -1;

        let answers = [];
        if (dat.moderator === '' && chosenAnswer === -1) {
            // Nur wenn der Benutzer kein Moderator ist und noch keine Antwort gewählt hat
            const allAnswers = [...dat.list[currentQuestion].answers];
            const incorrectAnswers = this.get50_50_Joker(allAnswers, correctAnswer);

            answers.push(
                <button
                    name={correctAnswer}
                    onClick={this.onAnswer}
                    className={chosenAnswer === correctAnswer ? 'chosen' : ''}
                    disabled={disabled}
                >
                    {`X) ${dat.list[currentQuestion].answers[correctAnswer]}`}
                </button>
            );

            for (let i = 0; i < incorrectAnswers.length; i++) {
                answers.push(
                    <button
                        name={`fake${i}`}
                        onClick={this.onAnswer}
                        className={chosenAnswer === `fake${i}` ? 'chosen' : ''}
                        disabled={disabled}
                    >
                        {`X) ${incorrectAnswers[i]}`}
                    </button>
                );
            }
        } else {
            // Andernfalls rendere die Antworten ohne 50/50-Joker
            answers = dat.list[currentQuestion].answers.map((answer, index) => (
                <button
                    key={index}
                    name={index}
                    onClick={this.onAnswer}
                    className={chosenAnswer === index ? 'chosen' : ''}
                    disabled={disabled}
                >
                    {`${this.getLetter(index)}) ${answer}`}
                </button>
            ));
        }

        return answers;
    };

    // Funktion zum Erstellen der 50/50-Joker-Antworten
    get50_50_Joker = (allAnswers, correctAnswer) => {
        // Entferne die richtige Antwort
        allAnswers.splice(correctAnswer, 1);

        // Entferne eine zufällige falsche Antwort
        const randomIndex = Math.floor(Math.random() * allAnswers.length);
        allAnswers.splice(randomIndex, 1);

        return allAnswers;
    };

    // Hilfsfunktion, um den Buchstaben zu erhalten (A, B, C, ...)
    getLetter = (index) => {
        return String.fromCharCode(65 + index);
    };


    // Lebenszyklus-Methode: Wird nach dem Rendern aufgerufen
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

    // Lebenszyklus-Methode: Wird vor dem Entfernen der Komponente aufgerufen 
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

    // Lebenszyklus-Methode: Rendert die Komponente
    render() {
        return (
            <div name='wwm'>{this.getDisplay()}</div>
        )
    }
}

export default WerWirdMillionaer;