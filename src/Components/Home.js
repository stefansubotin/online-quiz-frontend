import React, { Component } from 'react';
import PlayerBase from './Player/Base';
import ContributorBase from './Contributor/ContributorBase';
import "../../Stylesheets/home.css";

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            component: 'choice'
        }
    }

    onPlayer(event) {
        this.setState({
            component: 'player'
        })
    }

    onContributor(event) {
        this.setState({
            component: 'contributor'
        })
    }

    handleCallback = (event) => {
        this.setState({
            component: 'choice'
        })
    }

    getComponent() {
        switch (this.state.component) {
            case 'choice':
                return <div>
                    <button type="button" class="btn btn-secondary" style={{ margin: '10px' }} onClick={e => this.onPlayer(e)}>Play Quiz</button><br />
                    <button type="button" class="btn btn-secondary" style={{ margin: '10px' }} onClick={e => this.onContributor(e)}>Curate Questions</button>
                </div>
            case 'player':
                return <PlayerBase parentCallback={this.handleCallback} />;
            case 'contributor':
                return <ContributorBase />
            default:
                return <div>Error Homepage</div>
        }
    }

    render() {
        return (
            <div name='homepage' className='home'>
                {this.getComponent()}
            </div>
        )
    }
}

export default Homepage;