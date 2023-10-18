import React, { Component } from "react";
class Domino extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: props.room,
      user: props.user,
      data: props.data,
      leader: false,
    };
  }
  initFeld() {
    return <div style={{color:'blue'}}>Hallo Feld</div>;
  }
  render() {
    return (
      <div>
        {this.initFeld()}
      </div>
    );
  }
}
export default Domino;
