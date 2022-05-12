import React from 'react';
import {Duration} from 'luxon';
import {Button, Form} from 'react-bootstrap';
import * as PropTypes from 'prop-types';
import {getTimetableFromStages} from '../domain/calculation';


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

export class Timetable extends React.Component {
    render() {
        const alignRight = {
            textAlign: 'right'
        };

        return (
            <>
                <table className="table timetable tr-hover" id={"calcTable"}>
                    <thead key={"thead"}>
                    <tr key={"thead-tr"} className={"d-flex"}>
                        <th key={"stage"} className={"col-2"}>stage</th>
                        <th key={"departure"} style={alignRight} className={"col-1"}>departure</th>
                        <th key={"arrival"} style={alignRight} className={"col-1"}>arrival</th>
                        <th key={"stagedistance"} style={alignRight} className={"col-1"}>stage distance</th>
                        <th key={"totaldistance"} style={alignRight} className={"col-1"}>total distance</th>
                        <th key={"stageclimb"} style={alignRight} className={"col-1"}>stage climb</th>
                        <th key={"totalclimb"} style={alignRight} className={"col-1"}>total climb</th>
                        <th key={"pause"} style={alignRight} className={"col-1"}>pause</th>
                        <th key={"stagetime"} style={alignRight} className={"col-1"}>stage time</th>
                        <th key={"totaltime"} style={alignRight} className={"col-1"}>total time</th>
                        <th key={"average"} style={alignRight} className={"col-1"}>average</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.renderStagesStatic(this.props.stages, this.props.departure, this.props.minutesPerKm, this.props.climbPerHour)}
                    </tbody>
                </table>
                <Form.Group className={"mb-3"}>
                    <Button variant={"success"} onClick={() => this.props.excelExport("calcTable")}>{"Excel export"}</Button>
                </Form.Group>
            </>
        );
    }

    renderStagesStatic(stages, departure, minutesPerKm, climbPerHour) {
        const divStyle = {
            textAlign: 'right'
        };

        const calculatedStages = getTimetableFromStages(stages, departure, 0, minutesPerKm, climbPerHour)

        return calculatedStages.map((stage) => {
            return (
                <tr key={stage.id} className={"d-flex"}>
                    <td className={"col-2"}><strong >{stage.from} - {stage.to}</strong></td>
                    <td className={"col-1"} style={divStyle}><TimeField value={stage.arrival} /></td>
                    <td className={"col-1"} style={divStyle}><TimeField value={stage.departure} /></td>
                    <td className={"col-1"} style={divStyle}><DistanceField value={stage.distance}/></td>
                    <td className={"col-1"} style={divStyle}><DistanceField value={stage.totalDistance}/></td>
                    <td className={"col-1"} style={divStyle}>{stage.climb} m</td>
                    <td className={"col-1"} style={divStyle}>{stage.totalClimb} m</td>
                    <td className={"col-1"} style={divStyle}><DurationField value={stage.pause} /></td>
                    <td className={"col-1"} style={divStyle}><DurationField value={stage.duration} /></td>
                    <td className={"col-1"} style={divStyle}><DurationField value={stage.totalTime} /></td>
                    <td className={"col-1"} style={divStyle}><SpeedField value={stage.average} /></td>
                </tr>
            );
        });
    }
}

Timetable.propTypes = {
    stages: PropTypes.array,
    departure: PropTypes.string,
    minutesPerKm: PropTypes.number,
    climbPerHour: PropTypes.number,
    excelExport: PropTypes.func,
};
