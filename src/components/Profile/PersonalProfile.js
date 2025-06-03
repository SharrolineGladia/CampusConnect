import React, { useState, useEffect } from 'react';
import { database, auth } from '../components/firebase'; // Adjust the import based on your Firebase setup
import { ref, onValue, update } from 'firebase/database';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.input`
  margin: 10px 0;
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const EditButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ProfileField = styled.div`
  margin-bottom: 15px;
`;

const PersonalProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    department: '',
    year: '',
    registerNumber: '',
    rollNo: '',
  });
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(database, `users/${user.uid}`); // Adjust based on your database structure
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserData({
              name: data.name || '',
              age: data.age || '',
              department: data.department || '',
              year: data.year || '',
              registerNumber: data.registerNumber || '',
              rollNo: data.rollNo || '',
            });
          }
        });
      }
    };

    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveChanges = async () => {
    const user = auth.currentUser;
    if (user) {
      await update(ref(database, `users/${user.uid}`), userData);
      alert("Changes saved successfully!");
      setIsEditable(false);
    }
  };

  return (
    <Container>
      <h2>Personal Profile</h2>
      <ProfileField>
        <label>Name:</label>
        <InputField
          type="text"
          name="name"
          value={userData.name}
          onChange={handleInputChange}
          readOnly={!isEditable}
        />
      </ProfileField>
      <ProfileField>
        <label>Age:</label>
        <InputField
          type="text"
          name="age"
          value={userData.age}
          onChange={handleInputChange}
          readOnly={!isEditable}
        />
      </ProfileField>
      <ProfileField>
        <label>Department:</label>
        <InputField
          type="text"
          name="department"
          value={userData.department}
          onChange={handleInputChange}
          readOnly={!isEditable}
        />
      </ProfileField>
      <ProfileField>
        <label>Year:</label>
        <InputField
          type="text"
          name="year"
          value={userData.year}
          onChange={handleInputChange}
          readOnly={!isEditable}
        />
      </ProfileField>
      <ProfileField>
        <label>Register Number:</label>
        <InputField
          type="text"
          name="registerNumber"
          value={userData.registerNumber}
          onChange={handleInputChange}
          readOnly={!isEditable}
        />
      </ProfileField>
      <ProfileField>
        <label>Roll No:</label>
        <InputField
          type="text"
          name="rollNo"
          value={userData.rollNo}
          onChange={handleInputChange}
          readOnly={!isEditable}
        />
      </ProfileField>
      <EditButton onClick={isEditable ? handleSaveChanges : handleEditToggle}>
        {isEditable ? 'Save Changes' : 'Edit'}
      </EditButton>
    </Container>
  );
};

export default PersonalProfile;
