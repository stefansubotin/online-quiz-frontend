import e from "express";
import edge from "./edge.png"
import React, { Component } from "react";

class Stone extends Component {
    constructor(props) {
        super(props)
        this.isUserActive = props.isUserActive
        this.id = props.stone.id
        this.question = props.stone.question
        this.answer = props.stone.answer
        this.h = props.stone.h
        this.this.ftop = props.stone.fO
        this.d = props.stone.d
    }
    getDiagonalStoneFiller(h, fOben, d) {
        let deg = 0;
        if (h && fOben && d) {
            deg = 90;
        } else if (!h && fOben && d) {
            deg = 180
        } else if (h && !fOben && d) {
            deg = -90;
        }
        let style = { transform: 'rotate(' + deg + 'deg)' };
        return <li className="list-group-item col-6 empty"><img className="edge" src={edge} alt="Logo" style={style} />  </li>
    }

    render() {
        return (
            <ul
                className={this.h ? "stone list-group list-group-horizontal" : "stone list-group list-group-flush"}
                id={this.id}
                draggable onClick={this.isUserActive ? null : (e) => this.props.handleRotateStone(e)}
                onDragStart={this.isUserActive ? null : (e) => this.props.handleDragStart(e)}
            >
                {this.d ?
                    <>
                        <ul id="-1" className={this.h ? "list-group" : "list-group list-group-horizontal"}>
                            {this.h ? <li className={this.ftop ? "list-group-item col-6 bg-secondary-subtle" : "  list-group-item col-6"}>{this.ftop ? this.question : this.answer}</li> : this.getDiagonalStoneFiller(this.h, this.ftop, this.d)}
                            {this.h ? this.getDiagonalStoneFiller(this.h, this.ftop, this.d) : <li className={this.ftop ? "  list-group-item col-6 bg-secondary-subtle" : "  list-group-item col-6 "}>{this.ftop ? this.question : this.answer}</li>}
                        </ul>
                        <ul id="-2" className={this.h ? "list-group" : "list-group list-group-horizontal"}>
                            {this.h ? this.getDiagonalStoneFiller(this.h, this.ftop, this.d) : <li className={this.ftop ? "list-group-item col-6" : " bg-secondary-subtle list-group-item col-6"}>{this.ftop ? this.answer : this.question}</li>}
                            {this.h ? <li className={this.ftop ? "list-group-item col-6" : " bg-secondary-subtle list-group-item col-6"}>{this.ftop ? this.answer : this.question}</li> : this.getDiagonalStoneFiller(this.h, this.ftop, this.d)}
                        </ul>
                    </>
                    : <>
                        <li className={this.ftop ? "list-group-item col-6 bg-secondary-subtle text-emphasis-secondary" : "list-group-item col-6"}>{this.ftop ? this.question : this.answer}</li>
                        <li className={this.ftop ? "list-group-item col-6 " : "list-group-item col-6 bg-secondary-subtle text-emphasis-secondary"}>{this.ftop ? this.answer : this.question}</li>
                    </>
                }
            </ul>
        )
    }
}
export default Stone