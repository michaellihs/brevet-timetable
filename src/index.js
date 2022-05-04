import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

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
            <Form.Control
                onBlur={() => this.props.updateInputHandler(this.props.stage, this.props.field, this.state.inputValue)}
                onChange={this.handleChange}
                defaultValue={this.props.inputValue}
            />
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
                    <TtField field={"from"} stage={this.props.stage} inputValue={this.props.value.from} updateInputHandler={this.props.updateInputHandler}/>
                </td>
                <td>
                    <TtField field={"to"} stage={this.props.stage} inputValue={this.props.value.to} updateInputHandler={this.props.updateInputHandler}/>
                </td>
                <td>
                    <TtField field={"distance"} stage={this.props.stage} inputValue={this.props.value.distance} updateInputHandler={this.props.updateInputHandler}/>
                </td>
                <td>
                    <TtField field={"climb"} stage={this.props.stage} inputValue={this.props.value.climb} updateInputHandler={this.props.updateInputHandler}/>
                </td>
                <td>
                    <TtField field={"pause"} stage={this.props.stage} inputValue={this.props.value.pause} updateInputHandler={this.props.updateInputHandler}/>
                </td>
                <td>
                    <Button onClick={() => this.props.clickRemoveStageHandler(this.props.stage)} variant={"danger"}>{"Remove Stage"}</Button>
                </td>
            </tr>
        );
    }
}

class Timetable extends React.Component {
    render() {
        return (
            <Form>
                <h1>{"Timetable"}</h1>
                <Form.Group className={"mb-3"} controlId={"formDeparture"}>
                    <Form.Label>Departure</Form.Label>
                    <Form.Control placeholder={"2022-08-05 12:45"} className={"w-25"}/>
                    <Form.Text className={"text-muted"}>
                        Please provide the start date and start time in 'jjjj-mm-dd hh:mm'
                    </Form.Text>
                </Form.Group>
                <Form.Group className={"mb-3"} controlId={"formLimit"}>
                    <Form.Label>Time Limit</Form.Label>
                    <Form.Control placeholder={"125:00"}  className={"w-25"}/>
                    <Form.Text className={"text-muted"}>
                        Please provide the max time limit for the event
                    </Form.Text>
                </Form.Group>
                <Row className="mx-0">
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
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            stages: [
                {"from": "CP 1", "to": "CP 2", "departure": "12:45", "distance": "120 km", "climb": "700m", "pause": "30 min"},
                {"from": "CP 2", "to": "CP 3", "departure": "14:45", "distance": "60 km", "climb": "1200m", "pause": "30 min"},
                {"from": "CP 3", "to": "CP 4", "departure": "16:45", "distance": "100 km", "climb": "1000m", "pause": "30 min"},
            ],
        }
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
                <td><Form.Control placeholder={"Start CP"} id={"input_from"}/></td>
                <td><Form.Control placeholder={"Destination CP"} id={"input_to"}/></td>
                <td><Form.Control placeholder={"123 km"} id={"input_distance"}/></td>
                <td><Form.Control placeholder={"1200 m"} id={"input_climb"}/></td>
                <td><Form.Control placeholder={"30 min"} id={"input_pause"}/></td>
                <td><Button variant={"success"} onClick={() => this.addStage()}>{"Add Stage"}</Button></td>
            </tr>
        );
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
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Timetable />);
