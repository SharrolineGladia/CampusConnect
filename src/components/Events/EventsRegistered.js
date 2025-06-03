import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const EventsRegistered = ({ userId }) => {
  const [registeredEvents, setRegisteredEvents] = useState([]);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      const db = getDatabase();
      const eventsRef = ref(db, 'events'); // Make sure to reference the 'events' node

      onValue(eventsRef, (snapshot) => {
        const eventsData = snapshot.val();
        if (eventsData) {
          const userEvents = [];
          Object.entries(eventsData).forEach(([eventId, event]) => {
            if (event.registrations) {
              // Check if the user is in the registrations
              const isUserRegistered = Object.values(event.registrations).some(
                registration => registration.userId === userId
              );
              
              if (isUserRegistered) {
                userEvents.push({
                  id: eventId,
                  name: event.eventName,
                  association: event.association || 'N/A',
                  venue: event.venue || 'N/A',
                  date: event.date || 'N/A',
                  time: event.time || 'N/A'
                });
              }
            }
          });
          setRegisteredEvents(userEvents);
        }
      });
    };

    if (userId) {
      fetchRegisteredEvents();
    }
  }, [userId]);

  return (
    <div style={{ margin: '20px auto', maxWidth: '800px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Registered Events</h2>
      {registeredEvents.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Event Name</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Association</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Venue</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {registeredEvents.map((event) => (
              <tr key={event.id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{event.name}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{event.association}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{event.venue}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{event.date}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{event.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: '#666' }}>No events registered yet.</p>
      )}
    </div>
  );
};

export default EventsRegistered;