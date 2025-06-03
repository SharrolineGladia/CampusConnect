import React from 'react';
import { Card } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faBuilding, faUsers } from '@fortawesome/free-solid-svg-icons';

// Keyframes for pulsating colors
const pulsePink = keyframes`
  0% {
    box-shadow: 0 0 10px 4px rgba(255, 20, 147, 0.6), 0 0 15px rgba(128, 0, 128, 0.4);
  }
  50% {
    box-shadow: 0 0 10px 4px rgba(255, 105, 180, 0.6), 0 0 15px rgba(128, 0, 128, 0.4);
  }
  100% {
    box-shadow: 0 0 10px 4px rgba(255, 20, 147, 0.6), 0 0 15px rgba(128, 0, 128, 0.4);
  }
`;

const pulsePurple = keyframes`
  0% {
    box-shadow: 0 0 10px 4px rgba(128, 0, 128, 0.4), 0 0 15px rgba(255, 20, 147, 0.6);
  }
  50% {
    box-shadow: 0 0 10px 4px rgba(128, 0, 128, 0.6), 0 0 15px rgba(255, 105, 180, 0.6);
  }
  100% {
    box-shadow: 0 0 10px 4px rgba(128, 0, 128, 0.4), 0 0 15px rgba(255, 20, 147, 0.6);
  }
`;

const StyledCard = styled(Card)`
  background-color: #142748;
  color: white;
  margin: 1.5rem 0;
  border-radius: 30px;
  display: flex;
  flex-direction: ${props => (props.reverse ? 'row-reverse' : 'row')};
  align-items: center;
  padding: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: scale(1.1);
    animation: ${props => (props.reverse ? pulsePurple : pulsePink)} 1s infinite alternate;
  }
`;

const EventDetails = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
`;

const ImageWrapper = styled.div`
  flex: 1;
  width: 200px;
  height: 400px;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  margin-${props => (props.reverse ? 'left' : 'right')}: 2rem;
`;

const EventImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
`;

const EventName = styled.h5`
  margin: 0;
  font-size: 1.5rem;
  color: #ffffff;
`;

const EventDate = styled.p`
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #cccccc;
`;

const EventInfo = styled.p`
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #cccccc;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: #5e60ce; /* Color for the icons */
  }
`;

const ViewDetailsButton = styled.button`
  background: linear-gradient(45deg, #F24B53, #8F5EB4); /* Add gradient */
  color: white;
  border: transparent; /* Set border to transparent */
  border-radius: 12px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  text-transform: uppercase;

  &:hover {
    border-color: #FFFFFF; /* Optional: Change border color on hover */
  }
`;


const EventCard = ({ event, onShowDetails, reverse }) => {
  return (
    <StyledCard reverse={reverse}>
      <ImageWrapper reverse={reverse}>
        <EventImage src={event.image} alt={event.name} />
      </ImageWrapper>
      <EventDetails>
        <EventName>{event.name}</EventName>
        <EventDate>
          <FontAwesomeIcon icon={faCalendarAlt} /> {event.date}
        </EventDate>
        <EventInfo>
          <FontAwesomeIcon icon={faUsers} /> <strong>Association:</strong> {event.association}
        </EventInfo>
        <EventInfo>
          <FontAwesomeIcon icon={faBuilding} /> <strong>Department:</strong> {event.department}
        </EventInfo>
        <ViewDetailsButton onClick={() => onShowDetails(event)}>
          View Details
        </ViewDetailsButton>
      </EventDetails>
    </StyledCard>
  );
};

export default EventCard;
