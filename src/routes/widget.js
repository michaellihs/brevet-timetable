import { useParams, useSearchParams } from "react-router-dom";
import events from "../events";
import { AudaxSuisseTimetable } from "../components/audaxSuisseTimetable";

export default function Widget() {
    const params = useParams();
    const event = events.get(params.eventId);

    const [searchParams] = useSearchParams();
    const averagesQueryString = searchParams.get('averages')
    const averages = (averagesQueryString !== null) ? averagesQueryString.split(',') : null;

    return (
        <main style={{ padding: "1rem 0" }}>
            <AudaxSuisseTimetable averages={averages} event={event} />
        </main>
    );
}