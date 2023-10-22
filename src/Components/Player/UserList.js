import React, { Component } from "react";
import AblyFunctions from "../../Tools/AblyFunctions";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: props.room,
      user: props.user,
      leader: props.leader,
      users: [props.user],
      userCount: 1,
    };
  }

  async onJoin(message) {
    console.log(message.data);
    if (message.data.user == this.state.user) return;

    let newUsers = this.state.users;
    newUsers = newUsers.concat([message.data.user]);
    const c = this.state.userCount + 1;

    console.log(newUsers);
    if (this.state.leader) {
      const ably = await AblyFunctions.getAbly();
      const channelId = "room" + this.state.room;
      const channel = await AblyFunctions.getChannel(ably, channelId);
      await channel.publish("join-res", {
        you: message.data.user,
        users: this.state.users,
        userCount: this.state.userCount,
      });
      ably.close();
    }

    this.setStatus(newUsers, c);
    console.log(this.state);
  }

  async onJoinRes(message) {
    console.log(message.data);
    const data = message.data;
    if (data.you != this.state.user) return;
    let newUsers = message.data.users;
    newUsers = newUsers.concat([this.state.user]);
    const c = this.state.userCount + data.userCount;

    const ably = await AblyFunctions.getAbly();
    const channelId = "room" + this.state.room;
    const channel = await AblyFunctions.getChannel(ably, channelId);
    channel.unsubscribe("join-res");
    ably.close();

    this.setStatus(newUsers, c);
    console.log(this.state);
  }

  setStatus(users, c) {
    this.setState({
      room: this.state.room,
      user: this.state.user,
      leader: this.state.leader,
      users: users,
      userCount: c,
    });
  }

  async componentDidMount() {
    const ably = await AblyFunctions.getAbly();
    const channelId = "room" + this.state.room;
    const channel = await AblyFunctions.getChannel(ably, channelId);
    await channel.subscribe("join", (message) => this.onJoin(message));

    if (!this.state.leader) {
      console.log("not leader");
      await channel.subscribe("join-res", (message) => this.onJoinRes(message));
      channel.publish("join", {
        user: this.state.user,
      });
      channel.publish("join-lobby", {
        user: this.state.user,
      });
    }
  }

  render() {
    return (
      <div className="userList" name="userList">
        {this.state.users.join(", ")}
      </div>
    );
  }
}

export default UserList;
