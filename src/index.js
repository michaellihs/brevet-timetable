import React from 'react';
import ReactDOM from 'react-dom/client';
import {Button, Container, Form, Row, Col, Alert} from "react-bootstrap";
import {utils, writeFileXLSX} from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {DepartureForm} from "./components/departureForm";
import {Stage} from "./components/stage";
import {Timetable} from "./components/timetable";
import events from "./events";
import {getTimetableFromStages} from "./domain/calculation";


class ArrivalTimes extends React.Component {
    render() {
        const stages = this.props.stages;
        const startTime = this.props.params.startTime;
        const timeLimit = this.props.params.timeLimit;
        const minutesPerKm = this.props.params.minutesPerKm;
        const climbPerHour = this.props.params.climbPerHour;
        const timetable = getTimetableFromStages(stages, startTime, timeLimit, minutesPerKm, climbPerHour);
        const days = this.getDaysFromTimetable(timetable);

        return (
            <table className={"table"}>
                <thead>
                    <tr>
                        <th></th>
                        {days.map((day, index) => { return <th key={index}>{day}</th> })}
                    </tr>
                </thead>
                <tbody>
                    {timetable.map((stage, index) => {
                        return (
                            <tr key={index}>
                                <td><strong>{stage.to}</strong></td>
                                {days.map((day, index) => {
                                    const sleep = (stage.pause > 60) ? "😴" : "";
                                    const arrivalOnDay = (day === stage.arrival.weekdayShort) ? stage.arrival.toFormat("HH:mm") + " " + sleep : "";
                                    return (
                                        <td key={index}>{arrivalOnDay}</td>
                                    );
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        );
    }

    getDaysFromTimetable(stages) {
        var days = [];
        stages.forEach((stage) =>{
            let weekday = stage.arrival.weekdayShort;
            if (!days.includes(weekday)) {
                days.push(weekday);
            }
        });
        return days;
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const event = urlParams.get('event');
        console.log('Selected event ' + event);

        this.state = {
            stages: events.get((event ? event :'LEL 2022')),
            departure: "2022-08-07 12:45",
            timeLimit: "125:00",
            minutesPerKm: 2,
            climbPerHour: 450,
            selectedEvent: event ? event :'LEL 2022'
        };
    }

    render() {
        function copyToClipboard(inputId) {
            const input = document.getElementById(inputId);
            navigator.clipboard.writeText(input.value).then(r => console.log('Copied value ' + input.value + ' to clipboard'));
        }

        return (
            <Container fluid>
                <Row>
                    <Col>
                        <h2>{"Select event"}</h2>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>Select event</Form.Label>
                            <Form.Select value={this.state.selectedEvent} onChange={(e) => this.selectEvent(e)}>
                                {Array.from(events).map(([eventName, event]) => {
                                    return (<option key={eventName} value={eventName}>{eventName}</option>);
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>Link to this timetable</Form.Label>
                            <div className="input-group">
                                <input id="eventUrl" type="text" className="form-control" readOnly={true}
                                       value={`${window.location.protocol}//${window.location.host}/timetable?event=${encodeURIComponent(this.state.selectedEvent)}`}
                                       placeholder="Some path"/>
                                <span className="input-group-btn">
                                    <button className="btn btn-primary" type="button" id="copy-button"
                                            data-toggle="tooltip" data-placement="button"
                                            title="Copy to Clipboard"
                                            onClick={() => copyToClipboard('eventUrl')}
                                    >Copy</button>
                                </span>
                            </div>
                        </Form.Group>
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
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group className={"mb-3"} controlId={"minutesPerKm"}>
                                        <Form.Label>Minutes / km</Form.Label>
                                        <Form.Control
                                            placeholder={"2"}
                                            defaultValue={this.state.minutesPerKm}
                                        />
                                        <Form.Text className={"text-muted"}>
                                            How many minutes do you need per kilometer
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className={"mb-3"} controlId={"climbPerHour"}>
                                        <Form.Label>m / h</Form.Label>
                                        <Form.Control
                                            placeholder={"2"}
                                            defaultValue={this.state.climbPerHour}
                                        />
                                        <Form.Text className={"text-muted"}>
                                            How many meters do you climb per hour
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Alert variant={"success"}>
                                        The duration per stage is calculated as:
                                        <pre>(distance * minutesPerKm) + (climb / climbPerHour * 60)</pre>
                                    </Alert>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className={"mb-3"}>
                                        <Button variant={"primary"}
                                                onClick={() => this.updateParameters()}>{"Apply"}</Button>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>{"Stages"}</h2>
                        <Form>
                            <Row className={"mx-0"}>
                                <table className="table timetable">
                                    <thead>
                                    <tr>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Distance</th>
                                        <th>Climb</th>
                                        <th>Pause</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.renderStages()}
                                    {this.renderNewStage()}
                                    </tbody>
                                </table>
                            </Row>
                        </Form>
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
                        <h2>{"JSON dump"}</h2>
                        <Form>
                            <Form.Group className={"mb-3"}>
                                <Form.Label>JSON dump of stages</Form.Label>
                                <div className="input-group">
                                    <input id="jsonDump" type="text" className="form-control" readOnly={true}
                                           value={JSON.stringify(this.state.stages)}/>
                                    <span className="input-group-btn">
                                    <button className="btn btn-primary" type="button" id="copy-button"
                                            data-toggle="tooltip" data-placement="button"
                                            title="Copy to Clipboard"
                                            onClick={() => copyToClipboard('jsonDump')}
                                    >Copy</button>
                                </span>
                                </div>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }

    renderStages() {
        return this.state.stages.map((stage) => {
            return (
                <Stage
                    key={stage.id}
                    id={stage.id}
                    updateInputHandler={(stage, field, value) => this.updateInput(stage, field, value)}
                    clickRemoveStageHandler={(stageId) => this.removeStage(stageId)}
                    value={stage}
                />
            );
        });
    }

    renderNewStage() {
        return (
            <tr>
                <td>
                    <div className={"input-group"}>
                        <Form.Control placeholder={"Start CP"} id={"input_from"}/>
                    </div>
                </td>
                <td>
                    <div className={"input-group"}>
                        <Form.Control placeholder={"Destination CP"} id={"input_to"}/>
                    </div>
                </td>
                <td>
                    <div className={"input-group"}>
                        <Form.Control className={"text-end"} placeholder={"123"} id={"input_distance"}/>
                        <div className="input-group-append">
                            <span className="input-group-text">km</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div className={"input-group"}>
                        <Form.Control className={"text-end"} placeholder={"1200"} id={"input_climb"}/>
                        <div className="input-group-append">
                            <span className="input-group-text">m</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div className={"input-group"}>
                        <Form.Control className={"text-end"} placeholder={"30"} id={"input_pause"}/>
                        <div className="input-group-append">
                            <span className="input-group-text">min</span>
                        </div>
                    </div>
                </td>
                <td>
                    <Button variant={"success"} onClick={() => this.addStage()}>{"Add Stage"}</Button>
                </td>
            </tr>
        );
    }

    addStage() {
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
        }, function () {console.log(this.state.stages);});
     }

    removeStage(stageId) {
        console.log("remove stage was clicked for stage: " + stageId);
        this.setState({
            stages: this.state.stages.filter(function(stage) {
                return stage.id !== stageId
            })});
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
        }, function() {console.log(this.state);});
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
