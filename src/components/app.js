import React from "react";
import events from "../events";
import {Col, Container, Row} from "react-bootstrap";
import {EventSelector} from "./eventSelector";
import {utils, writeFileXLSX} from "xlsx";
import {copyToClipboard} from "../util";
import {DepartureForm} from "./departureForm";
import {CalculationParameters} from "./calculationParameters";
import {StagesForm} from "./stagesForm";
import {Timetable} from "./timetable";
import {ArrivalTimes} from "./arrivalTimes";
import {StagesJsonDump} from "./stagesJsonDump";

export class App extends React.Component {

    constructor(props) {
        super(props);

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const event = urlParams.get('event');
        console.log('Selected event ' + event);

        this.state = {
            stages: events.get((event ? event : 'LEL 2022')),
            departure: "2022-08-07 12:45",
            timeLimit: "125:00",
            minutesPerKm: 2,
            climbPerHour: 450,
            selectedEvent: event ? event : 'LEL 2022'
        };
    }

    render() {

        return (
            <Container fluid>
                <Row>
                    <Col>
                        <h2>{"Select event"}</h2>
                        <EventSelector
                            selectedEvent={this.state.selectedEvent}
                            onChange={(e) => this.selectEvent(e)}
                            onClick={() => copyToClipboard}
                            createNewEventHandler={(eventName) => this.createNewEvent(eventName)}
                        />
                    </Col>
                    <Col>
                        <h2>{"Departure and time limit"}</h2>
                        <DepartureForm
                            initialDeparture={"2022-08-07 12:45"}
                            updateStartTimeAndTimeLimitHandler={(departure, timeLimit) => this.handleStartTimeAndTimeLimitChange(departure, timeLimit)}
                            initialTimelimit={'125:00'}
                        />
                    </Col>
                    <Col>
                        <h2>{"Parameters"}</h2>
                        <CalculationParameters
                            minutesPerKmDefaultValue={this.state.minutesPerKm}
                            climbPerHourDefaultValue={this.state.climbPerHour}
                            updateHandler={() => this.updateParameters()}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>{"Stages"}</h2>
                        <StagesForm
                            stages={this.state.stages}
                            addStageHandler={() => this.addStage()}
                            updateInputHandler={(stage, field, value) => this.updateInput(stage, field, value)}
                            removeStageHandler={(stageId) => this.removeStage(stageId)}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>{"Calculated timetable"}</h2>
                        <Timetable
                            excelExport={this.exportToExcel}
                            stages={this.state.stages}
                            departure={this.state.departure}
                            minutesPerKm={this.state.minutesPerKm}
                            climbPerHour={this.state.climbPerHour}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>{"Arrival times"}</h2>
                        <ArrivalTimes stages={this.state.stages} params={{
                            startTime: this.state.departure,
                            timeLimit: this.state.timeLimit,
                            minutesPerKm: this.state.minutesPerKm,
                            climbPerHour: this.state.climbPerHour
                        }}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>{"Export event"}</h2>
                        <StagesJsonDump
                            stages={this.state.stages}
                            copyToClipboardHandler={copyToClipboard}
                            selectedEvent={this.state.selectedEvent}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    createNewEvent(eventName) {
        events.set(eventName, []);
        this.setState({
            selectedEvent: eventName,
            stages: [],
        });
    }

    addStage() {
        console.log('Adding new stage...')
        const stages = this.state.stages.slice()

        this.setState({
            stages: stages.concat({
                id: crypto.randomUUID(),
                from: document.getElementById("input_from").value,
                to: document.getElementById("input_to").value,
                distance: document.getElementById("input_distance").value,
                climb: document.getElementById("input_climb").value,
                pause: document.getElementById("input_pause").value,
            })
        });

        // Make "to" value the default "from" value for the next input
        document.getElementById("input_from").value = document.getElementById("input_to").value;
        document.getElementById("input_to").value = "";
        document.getElementById("input_distance").value = "";
        document.getElementById("input_climb").value = "";
        document.getElementById("input_pause").value = "";
    }

    updateInput(stageId, field, value) {
        console.log("updating stage: " + stageId + " and field: " + field + " with value: " + value);
        const stages = this.state.stages.slice();
        stages.forEach((stage) => {
            if (stage.id === stageId) {
                stage[field] = value
            }
        })
        this.setState({
            stages: stages
        }, function () {
            console.log(this.state.stages);
        });
    }

    removeStage(stageId) {
        console.log("remove stage was clicked for stage: " + stageId);
        this.setState({
            stages: this.state.stages.filter(function (stage) {
                return stage.id !== stageId
            })
        });
    }

    exportToExcel(tableId) {
        console.log('export to excel - tableId: ' + tableId);
        const table = document.getElementById(tableId);
        const workbook = utils.table_to_book(table);
        writeFileXLSX(workbook, 'timetable.xlsx');
    }

    selectEvent(event) {
        console.log("select event: " + event.target.value);
        this.setState({
            stages: events.get(event.target.value),
            selectedEvent: event.target.value,
        });
    }

    handleStartTimeAndTimeLimitChange(departure, timeLimit) {
        console.log('change departure: ' + departure + ' and time limit: ' + timeLimit);
        this.setState({
            timeLimit: timeLimit,
            departure: departure,
        });
    }

    updateParameters() {
        this.setState({
            minutesPerKm: Number(document.getElementById("minutesPerKm").value),
            climbPerHour: Number(document.getElementById("climbPerHour").value),
        }, function () {
            console.log(this.state);
        });
    }
}