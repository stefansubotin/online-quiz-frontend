import React, { Component } from "react";
class Feedback {
    constructor() {
    }

    getFeedback(wrongAnswers, correctAnswers) {
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
                        {wrongAnswers == undefined ? "Waiting for data..." : wrongAnswers.map((question) => {
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
                        {correctAnswers == undefined ? "Waiting for data..." : correctAnswers.map((question) => {
                            return (
                                <tr>
                                    <td>{question.question}</td>
                                    <td>{question.answer}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <button type="button" className="btn btn-primary" onClick={(e) => this.handleEndGame()}>Zurück zur Lobby</button>
            </>
        )
    }

}

export default Feedback;