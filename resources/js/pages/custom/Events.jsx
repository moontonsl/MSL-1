import { useEffect, useState } from "react";

const Events = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const apiUrl = import.meta.env.DEV
            ? '/api/data/event'
            : `${import.meta.env.VITE_API_BASE_URL}/data/event`;

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                console.log("All event data:", data);
                setEvents(data);
            })
            .catch(err => {
                console.error("Failed to fetch events", err);
            });
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-5xl font-bold text-center mb-6">Events</h1>
            {events.length > 0 ? (
                <div className="space-y-6">
                    {events.map((event, idx) => (
                        <div
                            key={idx}
                            className="border p-4 rounded shadow-md max-w-xl mx-auto"
                        >
                            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                            <p><strong>Description:</strong> {event.description}</p>
                            <p><strong>Date:</strong> {event.date}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            <p><strong>Prize Pool:</strong> {event.prizePool}</p>
                            <p><strong>Organizer:</strong> {event.organizer}</p>
                            <div>
                                <strong>Teams:</strong>
                                <ul className="list-disc list-inside">
                                    {event.teams.map((team, i) => (
                                        <li key={i}>{team}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">Loading events...</p>
            )}
        </div>
    );
};

export default Events;
