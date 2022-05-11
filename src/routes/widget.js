import { useParams } from "react-router-dom";
import events from "../events";
import { AudaxSuisseTimetable } from "../components/audaxSuisseTimetable";

export default function Widget() {
    let params = useParams();
    let event = events.get(params.eventId);
    return (
        <main style={{ padding: "1rem 0" }}>
            <AudaxSuisseTimetable event={event} />
        </main>
    );
}