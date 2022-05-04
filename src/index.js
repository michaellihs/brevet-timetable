import React from 'react';
import ReactDOM from 'react-dom';
import { Duration, DateTime } from 'luxon';
import { Row, Button, Form } from "react-bootstrap";
import {utils, writeFileXLSX} from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';

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

class DepartureForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            departure: "",
            timeLimit: 0
        }
    }

    componentDidMount() {
        this.setState({
            departure: this.props.initialDeparture,
            timeLimit: this.props.initialTimeLimit,
        });
    }

    handleDepartureChange = (e) => {
        this.setState({departure: e.target.value});
    }

    handleTimeLimitChange = (e) => {
        this.setState({timeLimit: e.target.value});
    }

    render() {
        return (
            <>
                <Form.Group className={"mb-3"} controlId={"formDeparture"}>
                    <Form.Label>Departure</Form.Label>
                    <Form.Control
                        onChange={this.handleDepartureChange}
                        onBlur={() => this.props.updateDepartureHandler(this.state.departure)}
                        placeholder={"2022-08-05 12:45"}
                        className={"w-25"}
                    />
                    <Form.Text className={"text-muted"}>
                        Please provide the start date and start time in 'jjjj-mm-dd hh:mm'
                    </Form.Text>
                </Form.Group>
                <Form.Group className={"mb-3"} controlId={"formLimit"}>
                    <Form.Label>Time Limit</Form.Label>
                    <Form.Control
                        onChange={this.handleTimeLimitChange}
                        onBlur={() => this.props.updateTimeLimitHandler(this.state.timeLimit)}
                        placeholder={"125:00"}
                        className={"w-25"}
                    />
                    <Form.Text className={"text-muted"}>
                        Please provide the max time limit for the event
                    </Form.Text>
                </Form.Group>
            </>
        );
    }
}

class TtField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ""
        }
    }

    componentDidMount() {
        this.setState({inputValue: this.props.inputValue});
    }

    handleChange = (e) => {
        this.setState({inputValue: e.target.value});
    }

    render() {
        return (
            <div className={"input-group"}>
                <Form.Control
                    onBlur={() => this.props.updateInputHandler(this.props.stage, this.props.field, this.state.inputValue)}
                    onChange={this.handleChange}
                    defaultValue={this.props.inputValue}
                    className={this.props.unit && "text-end"}
                />
                {this.props.unit && <div className="input-group-append">
                    <span className="input-group-text">{this.props.unit}</span>
                </div>}
            </div>
    );
    }

}

class Stage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr key={this.props.stage}>
                <td>
                    <TtField
                        field={"from"}
                        stage={this.props.stage}
                        inputValue={this.props.value.from}
                        updateInputHandler={this.props.updateInputHandler}
                    />
                </td>
                <td>
                    <TtField
                        field={"to"}
                        stage={this.props.stage}
                        inputValue={this.props.value.to}
                        updateInputHandler={this.props.updateInputHandler}
                    />
                </td>
                <td>
                    <TtField
                        field={"distance"}
                        stage={this.props.stage}
                        inputValue={this.props.value.distance}
                        updateInputHandler={this.props.updateInputHandler}
                        unit={"km"}
                    />
                </td>
                <td>
                    <TtField
                        field={"climb"}
                        stage={this.props.stage}
                        inputValue={this.props.value.climb}
                        updateInputHandler={this.props.updateInputHandler}
                        unit={"m"}
                    />
                </td>
                <td>
                    <TtField
                        field={"pause"}
                        stage={this.props.stage}
                        inputValue={this.props.value.pause}
                        updateInputHandler={this.props.updateInputHandler}
                        unit={"min"}
                    />
                </td>
                <td>
                    <Button onClick={() => this.props.clickRemoveStageHandler(this.props.stage)} variant={"danger"}>{"Remove Stage"}</Button>
                </td>
            </tr>
        );
    }
}

class Timetable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stages: [
                {"from": "Loughton", "to": "St Ives", "distance": 102.20, "climb": 700, "pause": 30},
                {"from": "St Ives", "to": "Spalding", "distance": 61.10, "climb": 95, "pause": 30},
                {"from": "Spalding", "to": "Louth", "distance": 82.20, "climb": 465, "pause": 210},
                {"from": "Louth", "to": "Hessle", "distance": 57.80, "climb": 485, "pause": 30},
                {"from": "Hessle", "to": "Malton", "distance": 66.90, "climb": 680, "pause": 30},
                {"from": "Malton", "to": "Barnard Castle", "distance": 114.00, "climb": 1255, "pause": 30},
                {"from": "Barnard Castle", "to": "Brampton", "distance": 83.70, "climb": 990, "pause": 210},
                {"from": "Brampton", "to": "Moffat", "distance": 71.50, "climb": 810, "pause": 30},
                {"from": "Moffat", "to": "Dunfermline", "distance": 111.40, "climb": 1145, "pause": 30},
                {"from": "Dunfermline", "to": "Innerleithen", "distance": 81.20, "climb": 1135, "pause": 30},
                {"from": "Innerleithen", "to": "Eskdalemuir", "distance": 49.50, "climb": 660, "pause": 30},
                {"from": "Eskdalemuir", "to": "Brampton", "distance": 58.10, "climb": 585, "pause": 210},
                {"from": "Brampton", "to": "Barnard Castle", "distance": 83.60, "climb": 1000, "pause": 30},
                {"from": "Barnard Castle", "to": "Malton", "distance": 111.70, "climb": 1155, "pause": 30},
                {"from": "Malton", "to": "Hessle", "distance": 70.00, "climb": 710, "pause": 30},
                {"from": "Hessle", "to": "Louth", "distance": 58.30, "climb": 545, "pause": 210},
                {"from": "Louth", "to": "Spalding", "distance": 81.30, "climb": 340, "pause": 30},
                {"from": "Spalding", "to": "St Ives", "distance": 60.30, "climb": 115, "pause": 30},
                {"from": "St Ives", "to": "Great Easton", "distance": 69.00, "climb": 350, "pause": 30},
                {"from": "Great Easton", "to": "Loughton", "distance": 48.60, "climb": 365, "pause": 30},
            ],
            departure: "2022-08-07 12:45",
            timeLimit: "125:00",
            // stages: [
            //     {"from": "CP 1", "to": "CP 2", "departure": "12:45", "distance": "120", "climb": "700", "pause": "30"},
            //     {"from": "CP 2", "to": "CP 3", "departure": "14:45", "distance": "60", "climb": "1200", "pause": "30"},
            //     {"from": "CP 3", "to": "CP 4", "departure": "16:45", "distance": "100", "climb": "1000", "pause": "30"},
            // ],
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
                    <h2>{"Input values"}</h2>
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
        return this.state.stages.map((stage, index) => {
            return (
                <Stage
                    key={index}
                    stage={index}
                    updateInputHandler={(stage, field, value) => this.updateInput(stage, field, value)}
                    clickRemoveStageHandler={(stage) => this.removeStage(stage)}
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

    updateInput(stage, field, value) {
        console.log("updating stage: " + stage + " and field: " + field + " with value: " + value);
        const stages = this.state.stages.slice();
        stages[stage][field] = value;
        this.setState({
            stages: stages
        });
     }

    removeStage(stage) {
        console.log("remove stage was clicked for stage: " + stage);
        const stages = this.state.stages.slice();
        stages.splice(stage, 1);
        this.setState({
            stages: stages
        });
    }

    exportToExcel() {
        console.log('export to excel');
        const table = document.getElementById('calcTable');
        console.log(table);
        const workbook = utils.table_to_book(table);
        writeFileXLSX(workbook, 'timetable.xlsx');
    }
}


function getStageDuration(distance, climb) {
    return (distance * 2) + (climb / 450 * 60);
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Timetable />);
