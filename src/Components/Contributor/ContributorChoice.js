import React, { Component } from "react";

class ContributorChoice extends Component {
    constructor(props){
        super(props);
        this.state = {
            component: 'choice'
        }
    }

    onNew(event){
        this.setState({
            component: 'new'
        })
    }

    onList(event){
        this.setState({
            component: 'list'
        })
    }

    onKey(event){
        this.setState({
            component: 'key'
        })
    }

    handleCallback

    getComponent(){
        switch (this.state.component){
            case 'choice':
                return <div>
                    <button onClick={e => this.onPlayer(e)}>New Question</button><br/>
                    <button onClick={e => this.onContributor(e)}>List of Questions</button>
                </div>
            case 'new':
                return <></>
            case 'list':
                return <></>
            default:
                return <div>Error Homepage</div>
        }
    }

    render() {
        return (
            <div name='contrHomepage'>
                {this.getComponent()}
            </div> 
        )
    }
}

export default ContributorChoice;