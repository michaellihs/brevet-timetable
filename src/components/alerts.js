import {Alert} from "react-bootstrap";
import React from 'react';

export function AlertEmptyStages() {
    return <Alert data-testid={"alert-empty-stages"} variant={"info"}>
        This event has no stages yet!
    </Alert>;
}