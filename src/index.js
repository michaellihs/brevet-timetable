import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function Stage(props) {
    return (
        // for updating, see https://stackoverflow.com/a/36683831/1549950
        <tr key={props.stage}>
            <td><Form.Control onChange={props.updateInputHandler(props.stage, "from")} defaultValue={props.value.from} /></td>
            <td><Form.Control onChange={props.updateInputHandler(props.stage, "to")} defaultValue={props.value.to}/></td>
            <td><Form.Control onChange={props.updateInputHandler(props.stage, "distance")} defaultValue={props.value.distance}/></td>
            <td><Form.Control onChange={props.updateInputHandler(props.stage, "climb")} defaultValue={props.value.climb}/></td>
            <td><Form.Control onChange={props.updateInputHandler(props.stage, "pause")} defaultValue={props.value.pause}/></td>
            <td><Button variant={"danger"}>{"Remove Stage"}</Button></td>
        </tr>
    )
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
                {"from": "CP 3", "to": "CP 3", "departure": "16:45", "distance": "100 km", "climb": "1000m", "pause": "30 min"},
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

        document.getElementById("input_from").value = "";
        document.getElementById("input_to").value = "";
        document.getElementById("input_distance").value = "";
        document.getElementById("input_climb").value = "";
        document.getElementById("input_pause").value = "";
    }

    renderStages() {
        return this.state.stages.map((stage, index) => {
            return (
                <Stage key={index} stage={index} updateInputHandler={(stage, value) => this.updateInput(stage, value)} value={stage} />
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

    updateInput(stage, value) {
        console.log("Want to update stage: " + stage + " with value: " + value);
     }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Timetable />);
