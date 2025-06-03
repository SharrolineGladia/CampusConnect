import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { getDatabase, ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import RegisteredUsersTable from './RegisteredUsersTableComponent';

const FrostedContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
`;

const EventCard = styled.div`
  background: rgba(30, 58, 138, 0.6);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
`;

const EventTitle = styled.h4`
  margin-top: 0;
  color: #ffffff;
`;

const EventInfo = styled.p`
  margin: 8px 0;
  color: #e2e8f0;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1rem;
`;

const EventsConducted = ({ userEmail }) => {
  const [events, setEvents] = useState([]);
  const [expandedEvents, setExpandedEvents] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      const db = getDatabase();
      const eventsRef = ref(db, 'events');
      const userEventsQuery = query(eventsRef, orderByChild('uploaderEmail'), equalTo(userEmail));

      onValue(userEventsQuery, (snapshot) => {
        const eventsData = snapshot.val();
        if (eventsData) {
          const eventsArray = Object.entries(eventsData).map(([id, event]) => ({
            id,
            ...event
          }));
          setEvents(eventsArray);
        } else {
          setEvents([]);
        }
      });
    };

    if (userEmail) {
      fetchEvents();
    }
  }, [userEmail]);

  const toggleExpand = (eventId) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  return (
    <FrostedContainer>
      <h3>Events Conducted</h3>
      {events.length > 0 ? (
        events.map((event) => (
          <EventCard key={event.id}>
            <EventTitle>{event.eventName}</EventTitle>
            <EventInfo><strong>Date:</strong> {event.date}</EventInfo>
            <ExpandButton onClick={() => toggleExpand(event.id)}>
              {expandedEvents[event.id] ? (
                <>
                  Hide Registrations <MdExpandLess />
                </>
              ) : (
                <>
                  Show Registrations <MdExpandMore />
                </>
              )}
            </ExpandButton>
            {expandedEvents[event.id] && (
              <RegisteredUsersTable eventId={event.id} />
            )}
          </EventCard>
        ))
      ) : (
        <p>No events conducted yet.</p>
      )}
    </FrostedContainer>
  );
};

export default EventsConducted;