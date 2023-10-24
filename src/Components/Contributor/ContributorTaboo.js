import React, { Component } from "react";
import BackendAccess from "../../Tools/BackendAccess";

class ContributorTaboo extends Component {
    constructor(props){
        super(props);
        this.state = {
            collection: props.collection,
            key: props.key,
            answer: '',
            forbiddenWords: []
        }
    }

    getDisplay(){
        let display = [];
        display.push(
            <div>
                <label for='answer'> To Explain</label>
                <input type='text' value={this.state.answer}/>
            </div>);
    }

    async componentDidMount(){
        console.log(this.props);
        if (this.props.item == "NO_KEY") {

            this.setState({
                collection: this.state.collection,
                key: this.state.key,
                answer: '',
                forbiddenWords: ['', '', '', '']
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
                answer: item.props.answer,
                forbiddenWords: item.props.forbiddenWords
            });
        }
        console.log(this.state);
    }

    render() {
        return <div>Placeholder</div>
    }
}

export default ContributorTaboo