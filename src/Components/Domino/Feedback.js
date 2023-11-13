import React, { Component } from "react";
class Feedback {
    constructor(wrongAnswers, correctAnswers) {
        this.wrongAnswers = wrongAnswers
        this.correctAnswers = correctAnswers
    }

    getFeedback() {
        return (
            <>
                <table className="table table-striped">
                    <tr>
                        <th colspan="3">Falsche Fragen</th>
                    </tr>
                    <tr>
                        <th scope="col">Frage</th>
                        <th scope="col">Antwort</th>
                    </tr>
                    <tbody>
                        {this.state.wrongAnswers == undefined ? "Waiting for data..." : this.state.wrongAnswers.map((question) => {
                            return (
                                <tr>
                                    <td>{question.question}</td>
                                    <td>{question.answer}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tr>
                        <th colspan="3">Richtige Fragen</th>
                    </tr>
                    <tbody>
                        {this.state.correctAnswers == undefined ? "Waiting for data..." : this.state.correctAnswers.map((question) => {
                            return (
                                <tr>
                                    <td>{question.question}</td>
                                    <td>{question.answer}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <button type="button" className="btn btn-primary" onClick={(e) => this.props.handleEndGame()}>Zurück zur Lobby</button>
            </>
        )
    }

}

export default Feedback;