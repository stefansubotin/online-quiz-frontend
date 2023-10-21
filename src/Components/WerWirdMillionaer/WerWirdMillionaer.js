import React, { Component } from 'react';
import AblyFunctions from '../../Tools/AblyFunctions';
import BackendAccess from '../../Tools/BackendAccess';

class WerWirdMillionaer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            init: false,
            room: props.room,
            user: props.user,
            data: props.data,
            moderator: false,
            currentQuestion: 0,
            answers: []
        }
    }

    getChannelId() {
        return 'wwm' + this.state.room;
    }

    async onUpdate(message) {
        let newAnswers = this.state.answers;
        let dat = JSON.parse(this.state.data);
        let correct = dat.questions[this.state.currentQuestion].correctAnswer == message.data.answer;
        let index = this.state.currentQuestion + 1
        newAnswers.push(JSON.stringify({
            text: index + '. Antwort: ' + message.data.answer,
            correct: correct
        }));
        this.setState({
            init: this.state.init,
            room: this.state.room,
            user: this.state.user,
            data: this.state.data,
            moderator: this.state.moderator,
            currentQuestion: index,
            answers: newAnswers
        });
    }

    onAnswer = (event) => {
        this.sendAnswer(event.target.value);
    }

    async sendAnswer(answer) {
        const ably = AblyFunctions.getAbly();
        const channel = AblyFunctions.getChannel(ably, this.getChannelId());
        await channel.publish('update', {
            answer: answer,
            currentQuestion: this.state.currentQuestion
        });
        let newAnswers = this.state.answers;
        let index = this.state.currentQuestion + 1
        newAnswers.push(index + '. Antwort: ' + answer);
        this.setState({
            init: this.state.init,
            room: this.state.room,
            user: this.state.user,
            data: this.state.data,
            moderator: this.state.moderator,
            currentQuestion: index,
            answers: newAnswers
        })
    }

    getDisplay() {
        let dat = JSON.parse(this.state.data);
        if (this.state.currentQuestion >= dat.questions.length) {
            return this.getCurrentQuestion(dat);
        }
        else {
            return this.getResults(dat);
        };
    }

    getAnswerList() {
        let answers = [];
        for (let i = 0; i < this.state.answers; i++){
            if(this.state.moderator) {
                let ele = JSON.parse(this.state.answers[i]);
                if (ele.correct){
                    answers.push(<div style={{ color: 'green'}}>{ele.text}</div>)
                }
                else {
                    answers.push(<div style={{ color: 'red'}}>{ele.text}</div>)
                }
            }
            else {
                answers.push(<div>{this.state.answers[i]}</div>)
            }
        }
        return answers;
    }

    getResults(dat) {
        if (this.state.moderator) {
            return <div>All Questions Done!</div>;
        }
        const body = JSON.stringify({
            id: dat.id,
            answers: this.state.answers
        });
        let url = BackendAccess.getUrlWwm();
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => response.json())
            .then(data => {
                let answers = [];
                for (let i = 0; i < this.state.answers; i++) {
                    if (data.correct[i] == 1) {
                        answers.push(<div style={{ color:'green'}}>Question:{dat.questions[i].question}, Your Answer:{this.state.answers[i]}</div>);
                    }
                    else{
                        answers.push(<div style={{ color:'red'}}>Question:{dat.questions[i].question}, Your Answer:{this.state.answers[i]}, Correct Answer:{data.answers[i]}</div>);
                    }
                }
                return answers;
            })
            .catch(error => console.log(error));

        return <div>Error</div>
    }

    getCurrentQuestion(dat) {
        let displayQuestion = [];
        let question = dat.questions[this.state.currentQuestion];
        displayQuestion.push(<div>{dat.question}</div>);
        displayQuestion.push(this.getAnswerTag(question, question.answer1));
        displayQuestion.push(this.getAnswerTag(question, question.answer2));
        displayQuestion.push(this.getAnswerTag(question, question.answer3));
        displayQuestion.push(this.getAnswerTag(question, question.answer4));

        return displayQuestion;
    }

    getAnswerTag(answer, question) {
        if (!this.state.moderator) {
            return <button onClick={this.onAnswer} value={answer}>{answer}</button>
        }
        else {
            if (question.correctAnswer == answer) {
                return <button disabled='true' style={{ color: 'green' }}>{answer}</button>
            }
            else {
                return <button disabled='true'>{answer}</button>
            }
        }
    }

    //#region React-Component-Lifetime-Functions
    static getDerivedStateFromProps(props, state) {
        if (state.init) {
            return {
                init: state.init,
                room: state.room,
                user: state.user,
                data: state.data,
                moderator: state.moderator,
                currentQuestion: state.currentQuestion,
                answers: state.answers
            }
        };

        let dat = JSON.parse(props.data);
        return {
            init: true,
            room: state.room,
            user: state.user,
            data: state.data,
            moderator: dat.moderator,
            currentQuestion: state.currentQuestion,
            answers: state.answers
        }
    }

    async componentDidMount() {
        if (!this.state.moderator) return;

        const ably = await this.getAbly();
        const channel = ably.channels.get(this.getChannelId());
        await channel.subscribe('update', (message) => this.onUpdate(message));
    }
//#endregion

    render() {
        return (
            <div>
                {this.getAnswerList()}<br/>
                {this.getDisplay()}
            </div>
        )
    }
}

export default WerWirdMillionaer;