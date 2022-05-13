import React from 'react';
import {getTimetableFromStages} from '../domain/calculation';
import {AlertEmptyStages} from "./alerts";

export class ArrivalTimes extends React.Component {
    render() {
        const stages = this.props.stages;

        if (stages === null || stages.length === 0) {
            return (<AlertEmptyStages />);
        }

        const startTime = this.props.startTime;
        const timeLimit = this.props.timeLimit;
        const minutesPerKm = this.props.minutesPerKm;
        const climbPerHour = this.props.climbPerHour;
        const timetable = getTimetableFromStages(stages, startTime, timeLimit, minutesPerKm, climbPerHour);
        const days = this.getDaysFromTimetable(timetable);

        return (
            <table className={"table tr-hover"}>
                <colgroup>
                    {[...days,1].map((_, index) => {
                        const cssClass = (index !== 0) ? ((index % 2 === 1) ? 'col-bg-lightgray' : 'col-bg-darkgray') : '';
                        return <col className={cssClass} key={index}/>
                    })}
                </colgroup>
                <thead>
                <tr>
                    <th></th>
                    {days.map((day, index) => {
                        return <th key={index}>{day}</th>
                    })}
                </tr>
                </thead>
                <tbody>
                {timetable.map((stage, index) => {
                    return (
                        <tr data-testid={"stages-row"} key={index}>
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
        stages.forEach((stage) => {
            let weekday = stage.arrival.weekdayShort;
            if (!days.includes(weekday)) {
                days.push(weekday);
            }
        });
        return days;
    }
}