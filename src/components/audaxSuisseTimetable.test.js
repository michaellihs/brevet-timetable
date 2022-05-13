import React from "react";
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom';
import {StagesJsonDump} from "./stagesJsonDump";
import {AudaxSuisseTimetable} from "./audaxSuisseTimetable";

const stages = [
    {
        "id": "d2a2263f-e37f-414f-9f89-c4cc72c19ae1",
        "from": "Loughton",
        "to": "St Ives",
        "distance": 102.20,
        "climb": 700,
        "pause": 30
    },
    {
        "id": "3726c5ff-ed46-4192-b294-db21b5c80d7a",
        "from": "St Ives",
        "to": "Spalding",
        "distance": 61.10,
        "climb": 95,
        "pause": 30
    },
    {
        "id": "26e41689-7be8-4542-9047-073506043989",
        "from": "Spalding",
        "to": "Louth",
        "distance": 82.20,
        "climb": 465,
        "pause": 210
    }
];

describe("audax suisse timetable", () => {
    it("renders expected alert for empty stages", () => {
        render(<AudaxSuisseTimetable event={[]} averages={[]} startTime={""} timeLimit={0} />);
        expect(screen.getByTestId(/alert-empty-stages/i)).toBeInTheDocument();
        expect(screen.queryByTestId(/export-form/i)).toBeNull();
    });

    it("renders expected number of rows for given events", () => {
        render(<AudaxSuisseTimetable event={stages} averages={[20]} startTime={"2022-08-07 12:45"} timeLimit={10} />);
        // remember: we have 1 additional row for the start location
        expect(screen.getAllByTestId(/stages-row/i).length).toEqual(stages.length + 1);
    });
});