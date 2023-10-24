import React, { Component } from "react";
import BackendAccess from "../../Tools/BackendAccess";

class ContributorSimpleQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collection: props.collection,
            key: props.key,
            question: '',
            answer: '',
            falseAnswer1: '',
            falseAnswer2: '',
            falseAnswer3: '',
            answerCount: 1
        }
    }

    onQuestion(e) {
        this.setState({
            collection: this.state.collection,
            key: this.state.key,
            answer: this.state.answer,
            question: e.target.value,
            falseAnswer1: this.state.falseAnswer1,
            falseAnswer2: this.state.falseAnswer2,
            falseAnswer3: this.state.falseAnswer3,
            answerCount: this.state.answerCount
        });
    }

    onAnswer(e) {
        this.setState({
            collection: this.state.collection,
            key: this.state.key,
            question: this.state.question,
            answer: e.target.value,
            falseAnswer1: this.state.falseAnswer1,
            falseAnswer2: this.state.falseAnswer2,
            falseAnswer3: this.state.falseAnswer3,
            answerCount: this.state.answerCount
        });
    }

    onFalseAnswer1(e) {
        this.setState({
            collection: this.state.collection,
            key: this.state.key,
            question: this.state.question,
            answer: this.state.answer,
            falseAnswer1: e.target.value,
            falseAnswer2: this.state.falseAnswer2,
            falseAnswer3: this.state.falseAnswer3,
            answerCount: this.state.answerCount
        });
    }

    onFalseAnswer2(e) {
        this.setState({
            collection: this.state.collection,
            key: this.state.key,
            question: this.state.question,
            answer: this.state.answer,
            falseAnswer1: this.state.falseAnswer1,
            falseAnswer2: e.target.value,
            falseAnswer3: this.state.falseAnswer3,
            answerCount: this.state.answerCount
        });
    }

    onFalseAnswer3(e) {
        this.setState({
            collection: this.state.collection,
            key: this.state.key,
            question: this.state.question,
            answer: this.state.answer,
            falseAnswer1: this.state.falseAnswer1,
            falseAnswer2: this.state.falseAnswer2,
            falseAnswer3: e.target.value,
            answerCount: this.state.answerCount
        });
    }

    onCount(i){
        this.setState({
            collection: this.state.collection,
            key: this.state.key,
            question: this.state.question,
            answer: this.state.answer,
            falseAnswer1: '',
            falseAnswer2: '',
            falseAnswer3: '',
            answerCount: i
        });
        
    }
    
    onSubmit(e) {
        this.sendQuestion();
        this.props.parentCallback({
            content: 'end'
        })
    }

    onCancel(e) {
        this.props.parentCallback({
            content: 'end'
        })
    }

    async sendQuestion() {
        console.log(this.state);
        let type = 'new';
        if (this.state.key != 'NO_KEY') type = 'change';

        const response = await fetch(BackendAccess.getUrlContributor(), {
            method: "POST",
            body: JSON.stringify({
                type: type,
                collection: this.props.collection,
                key: this.props.item,
                body: {
                    answer: this.state.answer,
                    question: this.state.question,
                    falseAnswer1: this.state.falseAnswer1,
                    falseAnswer2: this.state.falseAnswer2,
                    falseAnswer3: this.state.falseAnswer3,
                    answerCount: this.state.answerCount
                }
            }),
            headers: { "Content-Type": "application/json" },
        });
        const item = await response.json();
        console.log(item);
    }

    getDisplay() {
        let display = [];
        display.push(
            <div>
                <label for='question'>Question</label>
                <input id='question' type='text' value={this.state.question} onChange={(e) => this.onQuestion(e)} />
            </div>);
        display.push(
            <div>
                <label for='answer'>Correct Answer</label>
                <input id='answer' type='text' value={this.state.answer} onChange={(e) => this.onAnswer(e)} />
            </div>);
        if (this.state.answerCount == 4) {
            display.push(
                <div>
                    <label for='answer'>False Answer 1</label>
                    <input id='answer' type='text' value={this.state.falseAnswer1} onChange={(e) => this.onFalseAnswer1(e)} />
                </div>);
            display.push(
                <div>
                    <label for='answer'>False Answer 2</label>
                    <input id='answer' type='text' value={this.state.falseAnswer2} onChange={(e) => this.onFalseAnswer2(e)} />
                </div>);
            display.push(
                <div>
                    <label for='answer'>False Answer 3</label>
                    <input id='answer' type='text' value={this.state.falseAnswer3} onChange={(e) => this.onFalseAnswer3(e)} />
                </div>);
        }
        return display;
    }

    async componentDidMount() {
        console.log(this.props);
        if (this.props.item == "NO_KEY") {

            this.setState({
                collection: this.state.collection,
                key: this.state.key,
                question: '',
                answer: '',
                falseAnswer1: '',
                falseAnswer2: '',
                falseAnswer3: '',
                answerCount: 1
            });

            return;
        }
        else {
            const response = await fetch(BackendAccess.getUrlContributor(), {
                method: "POST",
                body: JSON.stringify({
                    type: 'get',
                    collection: this.props.collection,
                    key: this.props.item
                }),
                headers: { "Content-Type": "application/json" },
            });
            const item = await response.json();
            console.log(item);

            this.setState({
                collection: this.state.collection,
                key: this.state.key,
                question: item.props.question,
                answer: item.props.answer,
                falseAnswer1: item.props.falseAnswer1,
                falseAnswer2: item.props.falseAnswer2,
                falseAnswer3: item.props.falseAnswer3,
                answerCount: item.props.answerCount
            });
        }
        console.log(this.state);
    }

    render() {
        return <div>
            <form onSubmit={(e) => this.onSubmit(e)}>
                <input type='submit' value='Save Question' />
            </form>
            <form onSubmit={(e) => this.onCancel(e)}>
                <input type='submit' value='Cancel' />
            </form><br/><br/>
            <label for='1'>One Answer</label>
            <input id='1' type='checkbox' checked={this.state.answerCount == 1} onChange={(e) => this.onCount(1)} /><br/>
            <label for='4'>Four Answers</label>
            <input id='4' type='checkbox' checked={this.state.answerCount == 4} onChange={(e) => this.onCount(4)} /><br/>
            {this.getDisplay()}
        </div>
    }
}

export default ContributorSimpleQuestion