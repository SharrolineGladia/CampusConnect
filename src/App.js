import React, { useState } from 'react';
import GlobalStyle from './styles/globalStyles';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EventsDisplay from './pages/EventsDisplay';
import LoginSignup from './pages/LoginSignup'; // Import your login/signup component
import styled from 'styled-components';
import MiddlePage1 from './pages/MiddlePage1';
import Profile from './pages/Profile';
import EventUpload from './pages/EventUpload';
import ProjectDisplay from './pages/ProjectDisplay';
import ProjectForm from './pages/ProjectForm';


// Styled button for navigation
const NavButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  margin: 20px;
  background-color: #007bff; /* Button color */
  color: white; /* Text color */
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3; /* Darker color on hover */
  }
`;

// Main layout component for the home page
const HomePage = () => {
  return (
    <div>
      <h1>Welcome to TCE Campus Connect</h1>
      <NavButton to="/login">Login</NavButton> {/* Button to navigate to login/signup page */}
    </div>
  );
};

const App = () => {
  const [projects, setProjects] = useState([]);
  const [domains, setDomains] = useState([]);

  const addProject = (newProject) => {
    setProjects([...projects, newProject]);

    if (!domains.includes(newProject.domain)) {
      setDomains([...domains, newProject.domain]);
    }
  };

  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Home page with navigation buttons */}
        <Route path="/events" element={<EventsDisplay />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/midpage" element={<MiddlePage1 />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/eventsupload" element={<EventUpload />} />  {/* Route for login/signup page */}
        <Route path="/project-display" element={<ProjectDisplay projects={projects} domains={domains} />} />
        <Route path="/add-project" element={<ProjectForm addProject={addProject} />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
