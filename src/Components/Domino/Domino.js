import React, { Component } from "react";
import "../../Stylesheets/domino.css";
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
  getFirstCard() {
    return (
      <div class="card" style="width: 18rem;">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">An item</li>
          <li class="list-group-item">A second item</li>
          <li class="list-group-item">A third item</li>
        </ul>
      </div>
    );
  }
  initFeld() {
    return <div className="feld">Hallo Feld</div>;
  }
  render() {
    return <div>{this.getFirstCard()}</div>;
  }
}
export default Domino;
