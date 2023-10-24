import React, { Component } from "react";

class ContributorChoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            component: 'choice'
        }
    }

    onNew(event) {
        this.setState({
            component: event
        })
    }

    onList(event) {
        this.setState({
            component: 'list'
        })
    }

    onKey(event) {
        this.setState({
            component: 'key'
        })
    }

    handleCallback = (childData) => {
        this.setState({ 
            room: childData.room,
            user: childData.user,
            leader: childData.leader,
            currentComponent: 'lobby'
        });
    }

    getComponent() {
        switch (this.state.component) {
            case 'choice':
                return this.getBase()
            case 'kreuzwort':
                return <></>
            case 'taboo':
                return <></>
            case 'simple':
                return <></>
            default:
                return <div>Error Homepage</div>
        }
    }

    getBase() {
        <div>
            <button onClick={e => this.onNew('kreuzwort')}>New Kreuzwort Question</button><br />
            <button onClick={e => this.onNew('taboo')}>New Taboo Question</button><br />
            <button onClick={e => this.onNew('simple')}>New Simple Question</button><br />
            <button onClick={e => this.onList(e)}>List of Questions</button>
        </div>
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