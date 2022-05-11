import React from 'react';
import {DateTime} from "luxon";


function Row(props) {
    const stage = props.stage;
    return (
        <>
            <td>{stage.arrival.toFormat("HH:mm")}</td>
            <td>{stage.arrival.toFormat("cccc")}</td>
        </>
    )
}

export class AudaxSuisseTimetable extends React.Component {

    render() {
        const desiredAverages = [30, 25, 20, 15];
        const stages = this.props.event;
        let startTime = "2022-06-30 20:00";
        const timetables = desiredAverages.map((average) => {
           return {average: average, stages: getTimetableForAverage(stages, startTime, average)};
        });
        return (
            // TODO check this doc for proper layouting the table https://www.w3.org/WAI/tutorials/tables/irregular/
            <table className={"table"}>
                <col />
                {timetables.map((timetable, index) => {
                    return <colgroup key={timetable.stages[0].id + "_col_" + index} span={"3"} />}
                )}
                <tr>
                    <th rowSpan={"2"} scope={'col'}>CP</th>
                    <th rowSpan={"2"} scope={'col'}>km</th>
                    {timetables.map((timetable) => {
                        return <th key={timetable.average} colSpan={"2"}>ø {timetable.average} km/h</th>}
                    )}
                </tr>
                <tr>
                    {
                        timetables.map((timetable) => {
                            return (
                                <>
                                    <th key={timetable.average + "_arrival"}>Arrival</th>
                                    <th key={timetable.average + "_day"}>Day</th>
                                </>
                            )
                        })
                    }
                </tr>
                <tr>
                    <td>{timetables[0].stages[0].from}</td>
                    <td>0</td>
                    {timetables.map((timetable, index) => {
                        return (
                            <Row key={"2a1d04ca-99bc-433a-b7b7-d2cd799f3e81_zero_row_" + index} stage={{id: "2a1d04ca-99bc-433a-b7b7-d2cd799f3e81" ,to: timetable.stages[0].from, distance: 0, climb: 0, arrival: DateTime.fromFormat(startTime, "yyyy-MM-dd HH:mm")}} />
                        )
                    })}
                </tr>
                {timetables[0].stages.map((_, stageIndex) => {
                    return (
                        <tr key={timetables[0].stages[stageIndex].id}>
                            <td>{timetables[0].stages[stageIndex].to}</td>
                            <td>{timetables[0].stages[stageIndex].totalDistance}</td>
                            {timetables.map((timetable, timetableIndex) => {
                                return(
                                    <Row key={timetable.stages[stageIndex].id + "_" + timetableIndex} stage={timetable.stages[stageIndex]}/>
                                )
                            })}
                        </tr>
                    )
                })}
            </table>
        );
    }

}

function getTimetableForAverage(stages, startTime, average) {

    let totalDistance = 0;
    let totalClimb = 0;
    let totalTime = 0;
    let departure = DateTime.fromFormat(startTime, "yyyy-MM-dd HH:mm")
    let arrival = departure

    return stages.map((stage) => {
        totalDistance += Number(stage.distance);
        totalClimb += Number(stage.climb);
        const stageDuration = stage.distance / average * 60;
        totalTime += stageDuration + Number(stage.pause);
        arrival = departure.plus({minutes: stageDuration});
        const stageAverage = Number(stage.distance) / stageDuration * 60;

        const entry = {
            id: stage.id,
            from: stage.from,
            to: stage.to,
            departure: departure,
            arrival: arrival,
            distance: stage.distance,
            climb: stage.climb,
            pause: stage.pause,
            duration: stageDuration,
            totalDistance: totalDistance,
            totalClimb: totalClimb,
            totalTime: totalTime,
            average: stageAverage,
        };

        departure = arrival.plus({minutes: stage.pause});
        arrival = arrival.plus({minutes: stage.pause});

        return entry;
    });
}