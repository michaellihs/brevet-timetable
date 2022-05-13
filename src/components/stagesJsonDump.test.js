import React from "react";
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom';
import {StagesJsonDump} from "./stagesJsonDump";


describe("export form", () => {
    it("renders expected alert for empty stages", () => {
        render(<StagesJsonDump stages={[]} onClick={() => {}}/>);
        expect(screen.getByTestId(/alert-empty-stages/i)).toBeInTheDocument();
        expect(screen.queryByTestId(/export-form/i)).toBeNull();
    });
});