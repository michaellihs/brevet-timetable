import {DateTime} from "luxon";

export function getTotalDistanceFromStages(stages) {
    return stages.reduce(function (previousValue, currentValue) {
        return previousValue + Number(currentValue.distance);
    }, 0);
}

export function getTimetableFromStages(stages, startTime, timeLimit, minutesPerKm, climbPerHour) {

    let totalDistance = 0;
    let totalClimb = 0;
    let totalTime = 0;
    let departure = DateTime.fromFormat(startTime, "yyyy-MM-dd HH:mm")
    let arrival = departure

    return stages.map((stage) => {
        totalDistance += Number(stage.distance);
        totalClimb += Number(stage.climb);
        const stageDuration = getStageDuration(stage.distance, stage.climb, minutesPerKm, climbPerHour);
        totalTime += stageDuration + Number(stage.pause);
        arrival = departure.plus({minutes: stageDuration});
        const average = Number(stage.distance) / stageDuration * 60;

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
            average: average,
        };

        departure = arrival.plus({minutes: stage.pause});
        arrival = arrival.plus({minutes: stage.pause});

        return entry;
    });
}

function getStageDuration(distance, climb, minutesPerKm, climbPerHour) {
    return (distance * minutesPerKm) + (climb / climbPerHour * 60);
}
