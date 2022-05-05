import React from 'react';
import ReactDOM from 'react-dom';
import {DateTime, Duration} from 'luxon';
import {Button, Form, Row} from "react-bootstrap";
import {utils, writeFileXLSX} from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {DepartureForm} from "./components/departureForm";
import {Stage} from "./components/stage";

const events = new Map();
events.set("LEL 2022", [
    {"id": "d2a2263f-e37f-414f-9f89-c4cc72c19ae1","from": "Loughton", "to": "St Ives", "distance": 102.20, "climb": 700, "pause": 30},
    {"id": "3726c5ff-ed46-4192-b294-db21b5c80d7a","from": "St Ives", "to": "Spalding", "distance": 61.10, "climb": 95, "pause": 30},
    {"id": "26e41689-7be8-4542-9047-073506043989","from": "Spalding", "to": "Louth", "distance": 82.20, "climb": 465, "pause": 210},
    {"id": "f0400501-67a1-4b43-ae7e-d88e2b3cefff","from": "Louth", "to": "Hessle", "distance": 57.80, "climb": 485, "pause": 30},
    {"id": "0a727136-4e59-4cf3-9342-f7776ff8914d","from": "Hessle", "to": "Malton", "distance": 66.90, "climb": 680, "pause": 30},
    {"id": "389bb576-640e-4a28-a99c-9d26cceaaded","from": "Malton", "to": "Barnard Castle", "distance": 114.00, "climb": 1255, "pause": 30},
    {"id": "6ab3ebb7-a37e-4176-9433-79ff9b3c87a1","from": "Barnard Castle", "to": "Brampton", "distance": 83.70, "climb": 990, "pause": 210},
    {"id": "46633595-2db0-4cec-abc6-4c5951991021","from": "Brampton", "to": "Moffat", "distance": 71.50, "climb": 810, "pause": 30},
    {"id": "b64093f1-766a-4d9f-ae06-99567a501368","from": "Moffat", "to": "Dunfermline", "distance": 111.40, "climb": 1145, "pause": 30},
    {"id": "0bddfc7b-a31f-4b15-bc6f-b9080b98a46f","from": "Dunfermline", "to": "Innerleithen", "distance": 81.20, "climb": 1135, "pause": 30},
    {"id": "5b30c06e-e382-4f2b-8e08-bebebda74a13","from": "Innerleithen", "to": "Eskdalemuir", "distance": 49.50, "climb": 660, "pause": 30},
    {"id": "10bada7c-5f27-438f-8e0f-d556d165704e","from": "Eskdalemuir", "to": "Brampton", "distance": 58.10, "climb": 585, "pause": 210},
    {"id": "aefe1130-360c-4426-b1c7-dfe5bf0dae4e","from": "Brampton", "to": "Barnard Castle", "distance": 83.60, "climb": 1000, "pause": 30},
    {"id": "054cb738-3f91-4071-b3f2-a565c956e404","from": "Barnard Castle", "to": "Malton", "distance": 111.70, "climb": 1155, "pause": 30},
    {"id": "c154c3fa-d05d-4855-9a34-bb508f7c755d","from": "Malton", "to": "Hessle", "distance": 70.00, "climb": 710, "pause": 30},
    {"id": "7d75c3d1-2436-41f6-bf2e-94f4784b8b67","from": "Hessle", "to": "Louth", "distance": 58.30, "climb": 545, "pause": 210},
    {"id": "f9fc3be6-c069-472a-b78f-59e25dc9332f","from": "Louth", "to": "Spalding", "distance": 81.30, "climb": 340, "pause": 30},
    {"id": "f876130f-e378-482d-8a9b-6193061e4fe9","from": "Spalding", "to": "St Ives", "distance": 60.30, "climb": 115, "pause": 30},
    {"id": "f1756105-d1bd-442c-bb86-f5df4e2540c9","from": "St Ives", "to": "Great Easton", "distance": 69.00, "climb": 350, "pause": 30},
    {"id": "edd46a9d-b838-417a-a3d8-3165e529659d","from": "Great Easton", "to": "Loughton", "distance": 48.60, "climb": 365, "pause": 30},
]);
events.set("BRM 200", [
    {"id": "5d7a8ffc-b3e5-4da4-bfd1-7f9aac5174dd", "from": "Buch", "to": "Radolfzell", "distance": 16.00, "climb": 80, "pause": 0},
    {"id": "0731424e-7736-40d1-9d5e-84b0a6f56a41", "from": "Radolfzell", "to": "Ludwigshafen", "distance": 16.00, "climb": 100, "pause": 0},
    {"id": "ad35e276-a703-4c52-a047-6859a47501bf", "from": "Ludwigshafen", "to": "Ueberlingen", "distance": 10.00, "climb": 50, "pause": 0},
    {"id": "bb85de98-1678-4870-bf28-c5ab08a4158b", "from": "Ueberlingen", "to": "Unteruhldingen", "distance": 9.00, "climb": 30, "pause": 0},
    {"id": "57a4d9f0-a8a2-42ee-b852-3da4cc365e20", "from": "Unteruhldingen", "to": "Immenstaad", "distance": 13.00, "climb": 50, "pause": 15},
    {"id": "f99bca5e-fa51-40f8-b0c3-46de188733f5", "from": "Immenstaad", "to": "Friedrichshafen", "distance": 10.20, "climb": 40, "pause": 0},
    {"id": "97f007ad-d32d-48aa-a99a-e89ba22d4b61", "from": "Friedrichshafen", "to": "Lindau", "distance": 25.00, "climb": 50, "pause": 0},
    {"id": "ba1ef24a-2427-43e6-b275-a64c4e86a53e", "from": "Lindau", "to": "Bregenz", "distance": 10.00, "climb": 20, "pause": 15},
    {"id": "c58255bc-cea6-4301-a765-2b97d953fdfc", "from": "Bregenz", "to": "Gaißau", "distance": 19.00, "climb": 30, "pause": 0},
    {"id": "be9db743-2b76-48c0-bfea-4f6948aa24ad", "from": "Gaißau", "to": "Rorschacher Berg", "distance": 9.00, "climb": 230, "pause": 0},
    {"id": "4032e99b-b6c6-47f1-9bf0-8991036fe1aa", "from": "Rorschacher Berg", "to": "Arborn", "distance": 11.00, "climb": 50, "pause": 15},
    {"id": "2001f218-9d46-43cc-9114-e0a802b37e25", "from": "Arborn", "to": "Romanshorn", "distance": 9.00, "climb": 20, "pause": 0},
    {"id": "3703b708-36ba-4c07-a6e2-3a92b948d043", "from": "Romanshorn", "to": "Kreuzlingen", "distance": 20.00, "climb": 90, "pause": 0},
    {"id": "ba48ab58-d510-48be-b599-05a275e89827", "from": "Kreuzlingen", "to": "Steckborn", "distance": 15.50, "climb": 120, "pause": 15},
    {"id": "931d918c-cb45-40e6-9780-704c7ae3ee96", "from": "Steckborn", "to": "Stein am Rhein", "distance": 12.00, "climb": 100, "pause": 0},
    {"id": "9dfdee6f-78a8-4820-978b-b418b5890785", "from": "Stein am Rhein", "to": "Buch", "distance": 10.00, "climb": 40, "pause": 0},
]);

export default events;

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
            <div>
                <Form>
                    <h1>{"Timetable"}</h1>
                    <Row className={"mx-0"}>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>Select event</Form.Label>
                            <Form.Select onChange={(e) => this.selectEvent(e)}>
                                {Array.from(events).map(([eventName, event]) => {
                                    return (<option key={eventName} value={eventName}>{eventName}</option>);
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <h2>{"Departure and time limit"}</h2>
                    <DepartureForm
                        initialDeparture={"2022-08-07 12:45"}
                        updateDepartureHandler={(departure) => this.handleDepartureChange(departure)}
                        initialTimelimit={'125:00'}
                        updateTimeLimitHandler={(timeLimit) => this.handleTimeLimitChange(timeLimit)}
                    />
                    <Row className={"mx-0"}>
                        <table className="table timetable">
                            <thead>
                            <tr>
                                <th>from</th>
                                <th>to</th>
                                <th>distance</th>
                                <th>climb</th>
                                <th>pause</th>
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
                <Row className={"mx-0"}>
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
                </Row>
                <Row className={"mx-0"}>
                    <Form.Group className={"mb-3"}>
                        <Button variant={"success"} onClick={() => this.exportToExcel()}>{"Excel export"}</Button>
                    </Form.Group>
                </Row>
            </div>
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

        return this.state.stages.map((stage, index) => {
            totalDistance += Number(stage.distance);
            totalClimb += Number(stage.climb);
            const stageDuration = getStageDuration(stage.distance, stage.climb);
            totalTime += stageDuration + Number(stage.pause);
            arrival = departure.plus({minutes: stageDuration});

            const result = (
                <tr key={index} className={"d-flex"}>
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
}


function getStageDuration(distance, climb) {
    return (distance * 2) + (climb / 450 * 60);
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Timetable />);
