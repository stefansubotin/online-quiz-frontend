import React, { Component } from "react";
import Stein from "./Stein";
class Domino extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: props.room,
      user: props.user,
      data: propsdata,
      leader: false,
    };
  }
  initFeld() {
    return <div style="color:blue">Hallo Feld</div>;
  }
  render() {
    return (
      <div>
        <Stein></Stein>
      </div>
    );
  }
}
export default Domino;
