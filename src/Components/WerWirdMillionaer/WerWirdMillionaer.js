import React, { Component } from 'react';
import '../../Stylesheets/wwm.css';

class WerWirdMillionaer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: props.room,
            user: props.user,
            data: props.data,
            currentQuestion: 0,
            correctAnswer: -1,
            chosenAnswer: -1,
        }
    }

    getChannelId() {
        return 'wwm' + this.state.room;
    }

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

    getDisplay() {
        let dat = JSON.parse(this.state.data);
        let display = [];
        let disabled = dat.moderator == this.state.user || this.state.chosenAnswer == -1;
        display.push(<div>{dat.list[this.state.currentQuestion].question}</div>)
        display.push(this.getCurrentAnswers());
        if ((this.state.currentQuestion + 1) == dat.list.length) display.push(<button onClick={(e) => this.onEnd()} disabled={disabled}>End</button>);
        else display.push(<button onClick={(e) => this.onContinue()} disabled={disabled}>Next Question</button>);
        return display;
    }

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

    async onEnd() {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        const channelId = 'room' + this.state.room;
        const channel = ably.channels.get(channelId);

        await channel.publish('end', {
            content: 'empty'
        })
    }

    async onGuess(message) {
        let dat = JSON.parse(this.state.data);
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

            let body = {
                correct: dat.list[this.state.currentQuestion].correct
            }
            await channel.publish('moderator', body);
            ably.close();
            this.setState({
                room: this.state.room,
                user: this.state.user,
                data: this.state.data,
                currentQuestion: this.state.currentQuestion,
                correctAnswer: dat.list[this.state.currentQuestion].correct,
                chosenAnswer: message.data.answer
            });
        }
    }

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
        if (dat.moderator == this.state.user) {
            await channel.subscribe('player', (message) => this.onGuess(message));
            this.setState({
                room: this.state.room,
                user: this.state.user,
                data: this.state.data,
                currentQuestion: this.state.currentQuestion,
                correctAnswer: dat.list[this.state.currentQuestion].correct - 1,
                chosenAnswer: -1
            });
        }
        else await channel.subscribe('moderator', (message) => this.onModerator(message));
    }

    render() {
        return (
            <div nmae='wwm'>{this.getDisplay()}</div>
        )
    }
}

export default WerWirdMillionaer;