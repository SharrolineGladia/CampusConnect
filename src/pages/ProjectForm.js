import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, push } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { database } from '../components/firebase'; // Import the database from your firebase.js file

const containerStyle = {
  backgroundColor: '#0C2145',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
};

const formContainerStyle = {
  backgroundColor: '#142748',
  padding: '30px',
  borderRadius: '10px',
  width: '100%',
  maxWidth: '600px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#1e3a6a',
  color: 'white',
};

const buttonStyle = {
  background: 'linear-gradient(45deg, #F24B53, #8F5EB4)',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '10px',
};

const headingStyle = {
  color: 'white',
  textAlign: 'center',
  marginBottom: '20px',
};

function ProjectForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [members, setMembers] = useState(['']);
  const [achievements, setAchievements] = useState('');
  const [links, setLinks] = useState('');
  const navigate = useNavigate();

  const handleAddMember = () => {
    setMembers([...members, '']);
  };

  const handleMemberChange = (index, value) => {
    const updatedMembers = [...members];
    updatedMembers[index] = value;
    setMembers(updatedMembers);
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);
    setMembers(updatedMembers);
  };

  const handleImageChange = (event) => {
    setImageFiles(Array.from(event.target.files));
  };

  const uploadImages = async (images) => {
    const storage = getStorage();
    const uploadPromises = images.map(async (image) => {
      const imageRef = storageRef(storage, `project-images/${uuidv4()}`);
      await uploadBytes(imageRef, image);
      return getDownloadURL(imageRef);
    });
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrls = await uploadImages(imageFiles);
      
      const newProject = {
        name,
        description,
        domain,
        images: imageUrls,
        members,
        achievements,
        links
      };

      await push(ref(database, 'projects'), newProject);

      navigate('/project-display');
    } catch (error) {
      console.error("Error adding project: ", error);
      // Here you might want to show an error message to the user
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={headingStyle}>ADD NEW PROJECT</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{...inputStyle, height: '100px'}}
          />
          <input
            type="text"
            placeholder="Domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={{...inputStyle, backgroundColor: 'transparent'}}
          />
          <div style={{marginBottom: '15px'}}>
            <label style={{color: 'white', marginBottom: '5px', display: 'block'}}>Members:</label>
            {members.map((member, index) => (
              <div key={index} style={{display: 'flex', marginBottom: '10px'}}>
                <input
                  type="text"
                  placeholder={`Member ${index + 1}`}
                  value={member}
                  onChange={(e) => handleMemberChange(index, e.target.value)}
                  style={{...inputStyle, marginBottom: '0', flex: '1'}}
                />
                {index > 0 && (
                  <button type="button" onClick={() => handleRemoveMember(index)} style={{...buttonStyle, marginLeft: '10px'}}>Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddMember} style={buttonStyle}>
              Add Member
            </button>
          </div>
          <input
            type="text"
            placeholder="Achievements"
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Links"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={{...buttonStyle, width: '100%'}}>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default ProjectForm;