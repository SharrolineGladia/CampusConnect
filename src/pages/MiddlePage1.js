import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyle from '../styles/globalStyles';

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #0C2146;
  color: #ffffff;
`;

const Button = styled.button`
  margin: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.2rem;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const MiddlePage1 = () => {
  const navigate = useNavigate();

  const handleGoToEvents = () => {
    navigate('/events');
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  const handleGoToProjects = () => {
    navigate('/project-display');
  };

  return (
    <Container>
      <GlobalStyle />
      <h1>Welcome to the Middle Page</h1>
      <Button onClick={handleGoToEvents}>Go to Events</Button>
      <Button onClick={handleGoToProfile}>Go to Profile</Button>
      <Button onClick={handleGoToProjects}>Go to Projects</Button>
    </Container>
  );
};

export default MiddlePage1;
