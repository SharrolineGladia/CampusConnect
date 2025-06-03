import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import { Form, Button, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import { database, storage, auth } from '../components/firebase'; // Import auth from Firebase
import { ref as dbRef, push, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
const Background = styled.div`
  background-color: #0C2145;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PageTitle = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-align: center;
`;

const StyledFormContainer = styled.div`
  background-color: #142748;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
`;

const StyledForm = styled(Form)`
  color: white;
`;

const StyledFormGroup = styled(Form.Group)`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
`;

const StyledFormControl = styled(Form.Control)`
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  &:focus {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
  }
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const StyledFormSelect = styled(Form.Select)`
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  &:focus {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
  }
  option {
    background-color: #142748;
    color: white;
  }
`;

const StyledFormLabel = styled(Form.Label)`
  color: white;
  margin-bottom: 5px;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #F24B53, #8F5EB4);
  border: none;
  &:hover {
    background: linear-gradient(45deg, #8F5EB4, #F24B53);
  }
`;

const StyledDatePicker = styled(DatePicker)`
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 100%;
  padding: 0.375rem 0.75rem;
  &:focus {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
  }
`;

const StyledTimePicker = styled(TimePicker)`
  .react-time-picker__wrapper {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  .react-time-picker__inputGroup__input {
    color: white;
  }
  .react-time-picker__button {
    stroke: white;
  }
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const StyledAlert = styled(Alert)`
  margin-top: 20px;
`;

const EventUpload = () => {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('');
  const [association, setAssociation] = useState('');
  const [department, setDepartment] = useState('');
  const [image, setImage] = useState(null);
  const [guideline, setGuideline] = useState('');
  const [time, setTime] = useState('10:00');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      let imageUrl = '';
      if (image) {
        const imageRef = storageRef(storage, `event-images/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const eventData = {
        eventName,
        association,
        department,
        imageUrl,
        time,
        venue,
        date: formatDate(date),
        description,
        guideline,
        uploaderEmail: user.email, // Add the email of the uploader
        uploadedAt: new Date().toISOString() // Optionally add a timestamp
      };

      const newEventRef = push(dbRef(database, 'events'));
      await set(newEventRef, eventData);

      console.log('Event added successfully');
      setShowAlert(true);
      
      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <Background>
      {showAlert && (
        <StyledAlert variant="success" onClose={() => setShowAlert(false)} dismissible>
          Event uploaded successfully!
        </StyledAlert>
      )}
      <PageTitle>Upload an Event</PageTitle>
      
      <StyledFormContainer>
        <StyledForm onSubmit={handleSubmit}>
          <StyledFormGroup>
            <StyledFormLabel>Event Name:</StyledFormLabel>
            <StyledFormControl
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
              placeholder="Enter event name"
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledFormLabel>Association:</StyledFormLabel>
            <StyledFormSelect
              value={association}
              onChange={(e) => setAssociation(e.target.value)}
              required
            >
              <option value="">Select Association</option>
              <option value="CSEA">CSEA</option>
              <option value="IE">IE</option>
              <option value="IEEE">IEEE</option>
              <option value="Glugot">Glugot</option>
              <option value="CSI">CSI</option>
            </StyledFormSelect>
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledFormLabel>Department:</StyledFormLabel>
            <StyledFormSelect
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="ECE">ECE</option>
              <option value="IT">IT</option>
              <option value="Civil">Civil</option>
              <option value="Mechanical">Mechanical</option>
              <option value="CSBS">CSBS</option>
              <option value="Data Science">Data Science</option>
            </StyledFormSelect>
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledFormLabel>Image:</StyledFormLabel>
            <StyledFormControl
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledFormLabel>Guideline:</StyledFormLabel>
            <StyledFormControl
              type="text"
              value={guideline}
              onChange={(e) => setGuideline(e.target.value)}
              required
              placeholder="Enter guideline"
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledFormLabel>Timing:</StyledFormLabel>
            <StyledTimePicker
              onChange={setTime}
              value={time}
              disableClock={true}
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledFormLabel>Venue:</StyledFormLabel>
            <StyledFormControl
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
              placeholder="Enter venue"
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledFormLabel>Date:</StyledFormLabel>
            <StyledDatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="yyyy-MM-dd"
              required
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <StyledFormLabel>Description:</StyledFormLabel>
            <StyledFormControl
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter description"
            />
          </StyledFormGroup>
          <StyledButtonContainer>
            <StyledButton type="submit">Submit</StyledButton>
          </StyledButtonContainer>
        </StyledForm>
      </StyledFormContainer>
    </Background>
  );
};

export default EventUpload;