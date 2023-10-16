import React, { Component } from 'react';
class Domino extends Component{
    constructor(props) {
        super(props);
        this.state = {
            currentComponent: 'domino',
            room: '', 
            user: '',
            leader: false
        };
    }
    render() {return (<div>Hallo domino</div>)}
} export default Domino;