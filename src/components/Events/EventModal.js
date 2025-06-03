import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { getDatabase, ref, push, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Styled components for the modal
const StyledModal = styled(Modal)`
  .modal-dialog {
    max-width: 80%;
    margin: 1.75rem auto;
  }
  
  .modal-content {
    background: rgba(255, 255, 255, 0.3);
    border: none;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    color: white;
  }
`;

const ModalContent = styled.div`
  padding: 2rem;
  color: white;
`;

const EventName = styled.h5`
  margin: 0;
  font-size: 2rem;
`;

const EventDetails = styled.p`
  margin: 1rem 0;
`;

const EventLink = styled.a`
  color: #5e60ce;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const CloseButton = styled(Button)`
  background-color: #5e60ce;
  color: white;
  border: 2px solid #5e60ce;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  text-transform: uppercase;
  
  &:hover {
    background-color: #4c51a0;
    border-color: #4c51a0;
  }
`;

const RegisterButton = styled(Button)`
  background-color: #06d6a0;
  color: white;
  border: 2px solid #06d6a0;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  text-transform: uppercase;
  
  &:hover {
    background-color: #05b086;
    border-color: #05b086;
  }
`;

const EventModal = ({ show, onHide, event }) => {
  const auth = getAuth();
  const db = getDatabase();

  const handleRegister = async () => {
    const user = auth.currentUser;
    if (user && event) {
      const registrationRef = ref(db, `events/${event.id}/registrations`);
      const newRegistrationRef = push(registrationRef);
      
      await set(newRegistrationRef, {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userEmail: user.email,
        timestamp: Date.now()
      });

      alert('Registration successful!');
      onHide();
    } else {
      alert('You must be logged in to register for an event.');
    }
  };

  if (!event) return null;

  return (
    <StyledModal show={show} onHide={onHide} centered>
      <ModalContent>
        <Modal.Header closeButton>
          <Modal.Title>
            <EventName>{event.name}</EventName>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventDetails>
            <strong>Association:</strong> {event.association}<br />
            <strong>Department:</strong> {event.department}<br />
            <strong>Date:</strong> {event.date}<br />
            <strong>Timing:</strong> {event.timing}<br />
            <strong>Venue:</strong> {event.venue}<br /><br />
            <strong>Description:</strong> {event.description}<br />
            <strong>Guideline:</strong> {event.guideline}
          </EventDetails>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <RegisterButton onClick={handleRegister}>
              Register
            </RegisterButton>
          </ButtonGroup>
        </Modal.Footer>
      </ModalContent>
    </StyledModal>
  );
};

export default EventModal;