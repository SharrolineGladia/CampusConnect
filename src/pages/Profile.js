import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { MdEdit, MdDelete } from 'react-icons/md';
import EventsConducted from '../components/Events/EventsConducted';
import EventsRegistered from '../components/Events/EventsRegistered';

const PageWrapper = styled.div`
  background-color: #0C2145;
  min-height: 100vh;
`;

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  color: #ffffff;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const SidebarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
`;

const ProfilePicture = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #007bff;
  margin-bottom: 20px;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const EditIcon = styled(MdEdit)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 24px;
  color: #ffffff;
  cursor: pointer;
`;

const DeleteIcon = styled(MdDelete)`
  position: absolute;
  bottom: 10px;
  right: 45px;
  font-size: 24px;
  color: #ffffff;
  cursor: pointer;
`;

const Name = styled.h2`
  margin: 10px 0;
`;

const Email = styled.p`
  margin: 5px 0;
`;

const NavigationSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 100%;
`;

const Option = styled.div`
  background-color: ${props => props.selected ? '#142748' : 'transparent'};
  color: #ffffff;
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #142748;
  }
`;

const ContentSection = styled.div`
  flex: 1;
  padding: 20px;
  margin-left: 20px;
`;

const FrostedContainer = styled.div`
  background: #142748;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const EditableInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #0C2145;
  color: #ffffff;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: linear-gradient(to right, #F24B53, #8F5EB4);
  color: #ffffff;
`;

const specialEmails = [
  "csea@gmail.com",
  "ieee@gmail.com",
  "ie@gmail.com",
  "csi@gmail.com",
  "glugot@gmail.com"
];

const PersonalProfile = ({ userData, onEdit, onSave, onCancel, editing, setUserData }) => {
  return (
    <FrostedContainer>
      <h3>Personal Profile</h3>
      <p>
        <strong>Name:</strong>
        {editing ? (
          <EditableInput
            value={userData.name}
            onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))} />
        ) : userData.name || 'N/A'}
      </p>
      <p>
        <strong>Email:</strong>
        {editing ? (
          <EditableInput
            value={userData.email}
            onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))} />
        ) : userData.email || 'N/A'}
      </p>
      <p>
        <strong>Date Of Birth:</strong>
        {editing ? (
          <EditableInput
            value={userData.dob}
            onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))} />
        ) : userData.dob || 'N/A'}
      </p>
      <p>
        <strong>Age:</strong>
        {editing ? (
          <EditableInput
            value={userData.age}
            onChange={(e) => setUserData((prev) => ({ ...prev, age: e.target.value }))} />
        ) : userData.age || 'N/A'}
      </p>
      <p>
        <strong>Department:</strong>
        {editing ? (
          <EditableInput
            value={userData.department}
            onChange={(e) => setUserData((prev) => ({ ...prev, department: e.target.value }))} />
        ) : userData.department || 'N/A'}
      </p>
      <p>
        <strong>Registration Number:</strong>
        {editing ? (
          <EditableInput
            value={userData.registrationNumber}
            onChange={(e) => setUserData((prev) => ({ ...prev, registrationNumber: e.target.value }))} />
        ) : userData.registrationNumber || 'N/A'}
      </p>
      <p>
        <strong>Roll Number:</strong>
        {editing ? (
          <EditableInput
            value={userData.rollNumber}
            onChange={(e) => setUserData((prev) => ({ ...prev, rollNumber: e.target.value }))} />
        ) : userData.rollNumber || 'N/A'}
      </p>
      {editing ? (
        <>
          <StyledButton onClick={onSave}>Save</StyledButton>
          <StyledButton onClick={onCancel}>Cancel</StyledButton>
        </>
      ) : (
        <StyledButton onClick={onEdit}>Edit</StyledButton>
      )}
    </FrostedContainer>
  );
};

const Profile = () => {
  const [selectedTile, setSelectedTile] = useState('');
  const [userData, setUserData] = useState({ 
    name: '', 
    email: '', 
    profileImage: '', 
    dob: '', 
    age: '', 
    department: '', 
    registrationNumber: '', 
    rollNumber: '' 
  });
  const [editing, setEditing] = useState(false);
  const [isSpecialUser, setIsSpecialUser] = useState(false);
  const storage = getStorage();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserData({ 
              name: data.name || '', 
              email: data.email || '', 
              dob: data.dob || '', 
              age: data.age || '', 
              department: data.department || '',
              registrationNumber: data.registrationNumber || '',
              rollNumber: data.rollNumber || '',
              profileImage: data.profileImage || 'default_image_url_here' 
            });
            const isSpecial = specialEmails.includes(data.email);
            setIsSpecialUser(isSpecial);
            setSelectedTile(isSpecial ? 'eventsConducted' : 'personalProfile');
          }
        });
      }
    };

    fetchUserData();
  }, [auth]);

  const handleTileClick = (tile) => {
    setSelectedTile(tile);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const deletePreviousImage = async (imageUrl) => {
    if (imageUrl && imageUrl !== 'default_image_url_here') {
      const imageRef = storageRef(storage, imageUrl);
      try {
        await deleteObject(imageRef);
        console.log("Previous profile image deleted successfully.");
      } catch (error) {
        console.error("Error deleting previous profile image:", error);
      }
    }
  };

  const uploadImage = async (file) => {
    const user = auth.currentUser;
    if (user) {
      const imageRef = storageRef(storage, `profileImages/${user.uid}/${file.name}`);
      try {
        const snapshot = await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        if (userData.profileImage) {
          await deletePreviousImage(userData.profileImage);
        }

        const db = getDatabase();
        await update(ref(db, `users/${user.uid}`), { profileImage: downloadURL });
        setUserData((prev) => ({ ...prev, profileImage: downloadURL }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);
  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, { ...userData });
      setEditing(false);
    }
  };

  return (
    <PageWrapper>
      <Container>
        <SidebarSection>
          <ProfilePicture imageUrl={userData.profileImage}>
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
              id="profileImageInput"
            />
            <EditIcon onClick={() => document.getElementById('profileImageInput').click()} />
            <DeleteIcon onClick={() => deletePreviousImage(userData.profileImage)} />
          </ProfilePicture>
          <Name>{userData.name || 'John Doe'}</Name>
          <Email>{userData.email || 'johndoe@example.com'}</Email>
          
          <NavigationSection>
            {isSpecialUser ? (
              <Option 
                selected={selectedTile === 'eventsConducted'} 
                onClick={() => handleTileClick('eventsConducted')}
              >
                Events Conducted
              </Option>
            ) : (
              <>
                <Option 
                  selected={selectedTile === 'personalProfile'} 
                  onClick={() => handleTileClick('personalProfile')}
                >
                  Personal Profile
                </Option>
                <Option 
                  selected={selectedTile === 'eventsRegistered'} 
                  onClick={() => handleTileClick('eventsRegistered')}
                >
                  Events Registered
                </Option>
              </>
            )}
          </NavigationSection>
        </SidebarSection>

        <ContentSection>
          {selectedTile === 'personalProfile' && (
            <PersonalProfile
              userData={userData}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              editing={editing}
              setUserData={setUserData}
            />
          )}
          {selectedTile === 'eventsRegistered' && (
  <FrostedContainer>
    <h3>Events Registered</h3>
    <EventsRegistered userId={auth.currentUser?.uid} />
  </FrostedContainer>
)}
          {selectedTile === 'eventsConducted' && <EventsConducted userEmail={userData.email} />}
          {!selectedTile && (
            <FrostedContainer>
              <h3>Welcome to Your Profile</h3>
              <p>Please select an option from the menu to view details.</p>
            </FrostedContainer>
          )}
        </ContentSection>
      </Container>
    </PageWrapper>
  );
};

export default Profile;