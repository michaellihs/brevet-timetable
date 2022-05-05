import React from 'react';
import ReactDOM from 'react-dom/client';
import {DateTime, Duration} from 'luxon';
import {Button, Container, Form, Row, Col, Alert} from "react-bootstrap";
import {utils, writeFileXLSX} from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {DepartureForm} from "./components/departureForm";
import {Stage} from "./components/stage";
import events from "./events";


function DistanceField(props) {
    return (props.value.toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        useGrouping: false
    }) + " km");
}

function SpeedField(props) {
    return (props.value.toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        useGrouping: false
    }) + " km/h");
}

function DurationField(props) {
    return (Duration.fromMillis(props.value * 60 * 1000).toFormat("hh:mm"))
}

function TimeField(props) {
    return props.value.toFormat("dd.LL. HH:mm");
}

class Timetable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stages: events.get('LEL 2022'),
            departure: "2022-08-07 12:45",
            timeLimit: "125:00",
            minutesPerKm: 2,
            climbPerHour: 450,
        }
    }

    handleDepartureChange(departure) {
        console.log('change departure: ' + departure);
        this.setState({departure: departure});
    }

    handleTimeLimitChange(timeLimit) {
        console.log('change time limit: ' + timeLimit);
        this.setState({timeLimit: timeLimit});
    }

    render() {
        const alignRight = {
            textAlign: 'right'
        };
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <h2>{"Select event"}</h2>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>Select event</Form.Label>
                            <Form.Select onChange={(e) => this.selectEvent(e)}>
                                {Array.from(events).map(([eventName, event]) => {
                                    return (<option key={eventName} value={eventName}>{eventName}</option>);
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <h2>{"Departure and time limit"}</h2>
                        <DepartureForm
                            initialDeparture={"2022-08-07 12:45"}
                            updateDepartureHandler={(departure) => this.handleDepartureChange(departure)}
                            initialTimelimit={'125:00'}
                            updateTimeLimitHandler={(timeLimit) => this.handleTimeLimitChange(timeLimit)}
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
                                        <Button variant={"primary"} onClick={() => this.updateParameters()}>{"Apply"}</Button>
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
                        <table className="table timetable" id={"calcTable"}>
                            <thead>
                            <tr className={"d-flex"}>
                                <th className={"col-2"}>stage</th>
                                <th style={alignRight} className={"col-1"}>departure</th>
                                <th style={alignRight} className={"col-1"}>arrival</th>
                                <th style={alignRight} className={"col-1"}>stage distance</th>
                                <th style={alignRight} className={"col-1"}>total distance</th>
                                <th style={alignRight} className={"col-1"}>stage climb</th>
                                <th style={alignRight} className={"col-1"}>total climb</th>
                                <th style={alignRight} className={"col-1"}>pause</th>
                                <th style={alignRight} className={"col-1"}>stage time</th>
                                <th style={alignRight} className={"col-1"}>total time</th>
                                <th style={alignRight} className={"col-1"}>average</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.renderStagesStatic()}
                            </tbody>
                        </table>
                        <Form.Group className={"mb-3"}>
                            <Button variant={"success"} onClick={() => this.exportToExcel()}>{"Excel export"}</Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
        );
    }

    renderStagesStatic() {
        const divStyle = {
            textAlign: 'right'
        };
        let totalDistance = 0;
        let totalClimb = 0;
        let totalTime = 0;
        // TODO read from form field
        let departure = DateTime.fromFormat(this.state.departure, "yyyy-MM-dd HH:mm")
        let arrival = departure

        const minutesPerKm = Number(this.state.minutesPerKm);
        const climbPerHour = Number(this.state.climbPerHour);

        return this.state.stages.map((stage) => {
            totalDistance += Number(stage.distance);
            totalClimb += Number(stage.climb);
            const stageDuration = getStageDuration(stage.distance, stage.climb, minutesPerKm, climbPerHour);
            totalTime += stageDuration + Number(stage.pause);
            arrival = departure.plus({minutes: stageDuration});

            const result = (
                <tr key={stage.id} className={"d-flex"}>
                    <td className={"col-2"}><strong>{stage.from} - {stage.to}</strong></td>
                    <td className={"col-1"} style={divStyle}><TimeField value={departure} /></td>
                    <td className={"col-1"} style={divStyle}><TimeField value={arrival} /></td>
                    <td className={"col-1"} style={divStyle}><DistanceField value={stage.distance}/></td>
                    <td className={"col-1"} style={divStyle}><DistanceField value={totalDistance}/></td>
                    <td className={"col-1"} style={divStyle}>{stage.climb} m</td>
                    <td className={"col-1"} style={divStyle}>{totalClimb} m</td>
                    <td className={"col-1"} style={divStyle}><DurationField value={stage.pause} /></td>
                    <td className={"col-1"} style={divStyle}><DurationField value={stageDuration} /></td>
                    <td className={"col-1"} style={divStyle}><DurationField value={totalTime} /></td>
                    <td className={"col-1"} style={divStyle}><SpeedField value={stage.distance / stageDuration * 60} /></td>
                </tr>
            );
            departure = arrival.plus({minutes: stage.pause});
            arrival = arrival.plus({minutes: stage.pause});
            return result;
        });
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

    exportToExcel() {
        console.log('export to excel');
        const table = document.getElementById('calcTable');
        console.log(table);
        const workbook = utils.table_to_book(table);
        writeFileXLSX(workbook, 'timetable.xlsx');
    }

    selectEvent(event) {
        console.log("select event: " + event.target.value);
        this.setState({stages: events.get(event.target.value)});
    }

    updateParameters() {
        this.setState({
            minutesPerKm: Number(document.getElementById("minutesPerKm").value),
            climbPerHour: Number(document.getElementById("climbPerHour").value),
        }, function() {console.log(this.state);});
    }
}


function getStageDuration(distance, climb, minutesPerKm, climbPerHour) {
    return (distance * minutesPerKm) + (climb / climbPerHour * 60);
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Timetable />);
