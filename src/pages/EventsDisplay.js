import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import GlobalStyle from '../styles/globalStyles';
import EventCard from '../components/Events/EventCard';
import EventModal from '../components/Events/EventModal';
import CarouselComponent from '../components/CarouselComponent';
import { Container, Row, Col } from 'react-bootstrap';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import Typewriter from 'typewriter-effect';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

// Utility function to format date
const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

// Example images for CarouselComponent
const carouselImages = [
  { src: './assets/images/augccwinners.jpg', caption: 'Winners of August Monthly Coding Contest' },
  { src: './assets/images/codingcontestwinners.jpg', caption: 'Winners of September Coding Contest' },
  { src: './assets/images/dafswinners.jpg', caption: 'Winners of Debug At First Sight' },
  { src: './assets/images/oowinners.jpg', caption: 'Winners of Oops Olympiad' },
];

// Styled container for the overlay
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  display: ${props => (props.show ? 'block' : 'none')};
`;

// Styled container for the carousel
const CarouselContainer = styled.div`
  width: 80%;
  margin: 2rem auto;
  position: relative;
`;

// Styled container for the title
const TitleContainer = styled.div`
  color: #ffffff;
  text-align: center;
  margin: 2rem 0;
  font-size: 2rem;
`;

// Styled container for the main events display
const EventsContainer = styled.div`
  background-color: #0C2146;
  padding: 2rem;
  min-height: 100vh;
`;

const EventsDisplay = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const loggedInEmail = user ? user.email : null;

  const allowedEmails = [
    "csea@gmail.com",
    "ieee@gmail.com",
    "ie@gmail.com",
    "csi@gmail.com",
    "glugot@gmail.com",
  ];

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const eventsRef = ref(db, 'events');

    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const eventsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setEvents(eventsArray);
      }
    });
  }, []);

  const handleShowDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <EventsContainer>
      <GlobalStyle />
      {allowedEmails.includes(loggedInEmail) && (
        <button
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 15px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/eventsupload')}
        >
          Upload Event
        </button>
      )}
      <CarouselContainer>
        <CarouselComponent images={carouselImages} />
      </CarouselContainer>
      <Container>
        <TitleContainer>
          <Typewriter
            options={{
              strings: ['Check out the recent Events!'],
              autoStart: true,
              loop: true,
              delay: 60,
              deleteSpeed: 40,
            }}
          />
        </TitleContainer>
        <Row>
          {events.map((event, index) => (
            <Col key={event.id} xs={12}>
              <EventCard
                event={{
                  ...event,
                  date: formatDate(event.date),
                  image: event.imageUrl, // Use the imageUrl from the database
                }}
                onShowDetails={handleShowDetails}
                reverse={index % 2 === 1}
              />
            </Col>
          ))}
        </Row>
      </Container>
      <Overlay show={showModal} />
      <EventModal show={showModal} event={selectedEvent} onHide={handleCloseModal} />
    </EventsContainer>
  );
};

export default EventsDisplay;