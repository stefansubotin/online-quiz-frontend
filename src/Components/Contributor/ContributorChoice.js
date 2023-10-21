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
                    <button onClick={e => this.onPlayer(e)}>Play Quiz</button><br/>
                    <button onClick={e => this.onContributor(e)}>Curate Questions</button>
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
            <div name='homepage'>
                {this.getComponent()}
            </div> 
        )
    }
}

export default ContributorChoice;