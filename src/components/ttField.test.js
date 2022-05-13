import React from "react";
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom';
import {TtField} from "./ttField";


describe("timetable field", () => {
    it("renders with a unit", () => {
        render(<TtField unit={"km"}/>);
        expect(screen.getByTestId(/unit-span/i)).toBeInTheDocument();
        expect(screen.getByText('km')).toBeInTheDocument();
    });

    it("renders without a unit", () => {
        render(<TtField />);
        expect(screen.queryByTestId(/unit-span/i)).toBeNull();
    })
});
