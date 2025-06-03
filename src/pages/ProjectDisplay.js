import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../components/firebase'; // Import the database instance from your firebase.js file

const styles = {
  container: {
    backgroundColor: '#0C2145',
    minHeight: '100vh',
    padding: '20px',
    color: 'white',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  filterContainer: {
    backgroundColor: '#142748',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  select: {
    backgroundColor: '#0C2145',
    color: 'white',
    padding: '8px',
    border: 'none',
    borderRadius: '4px',
    marginLeft: '10px',
  },
  addButton: {
    background: 'linear-gradient(45deg, #F24B53, #8F5EB4)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '50%',
    fontSize: '24px',
    cursor: 'pointer',
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '60px',
    height: '60px',
  },
  projectList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  projectItem: {
    backgroundColor: '#142748',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
  },
  projectItemHighlighted: {
    transform: 'scale(1.03)',
  },
  projectImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    cursor: 'pointer',
  },
  projectDetails: {
    padding: '15px',
  },
  button: {
    background: 'linear-gradient(45deg, #F24B53, #8F5EB4)',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  imageViewer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  imageViewerImg: {
    maxWidth: '90%',
    maxHeight: '90%',
  },
  nextImageBtn: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    background: 'linear-gradient(45deg, #F24B53, #8F5EB4)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

function ProjectDisplay() {
  const [projects, setProjects] = useState([]);
  const [domains, setDomains] = useState([]);
  const [expandedProjectIndex, setExpandedProjectIndex] = useState(null);
  const [highlightedProjectIndex, setHighlightedProjectIndex] = useState(null);
  const [filteredDomain, setFilteredDomain] = useState('All');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const projectsRef = ref(database, 'projects');
    
    onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setProjects(projectList);
        
        // Extract unique domains
        const uniqueDomains = [...new Set(projectList.map(project => project.domain))];
        setDomains(uniqueDomains);
      }
    });
  }, []);

  const toggleProjectDetails = (index) => {
    setExpandedProjectIndex(expandedProjectIndex === index ? null : index);
  };

  const handleMouseEnter = (index) => {
    setHighlightedProjectIndex(index);
  };

  const handleMouseLeave = () => {
    setHighlightedProjectIndex(null);
  };

  const handleDomainFilterChange = (domain) => {
    setFilteredDomain(domain);
  };

  const handleImageClick = (projectIndex, imageIndex) => {
    setSelectedImageIndex(projectIndex);
    setCurrentImageIndex(imageIndex);
  };

  const closeImageViewer = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % projects[selectedImageIndex].images.length);
  };

  const filteredProjects = filteredDomain === 'All'
    ? projects
    : projects.filter((project) => project.domain === filteredDomain);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>PROJECTS</h2>

      <div style={styles.filterContainer}>
        <label htmlFor="domain-filter">Filter by Domain:</label>
        <select
          id="domain-filter"
          value={filteredDomain}
          onChange={(e) => handleDomainFilterChange(e.target.value)}
          style={styles.select}
        >
          <option value="All">All</option>
          {domains.map((domain, index) => (
            <option key={index} value={domain}>{domain}</option>
          ))}
        </select>
      </div>

      <button onClick={() => navigate('/add-project')} style={styles.addButton}>
        +
      </button>

      <div style={styles.projectList}>
        {filteredProjects.map((project, index) => {
          const descriptionPreview = project.description.split(' ').slice(0, 30).join(' ') + (project.description.split(' ').length > 30 ? '...' : '');

          return (
            <div
              key={project.id}
              style={{
                ...styles.projectItem,
                ...(highlightedProjectIndex === index ? styles.projectItemHighlighted : {})
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div>
                {project.images && project.images.length > 0 && (
                  <img
                    src={project.images[0]}
                    alt={`project ${index}`}
                    style={styles.projectImage}
                    onClick={() => handleImageClick(index, 0)}
                  />
                )}
                <div style={styles.projectDetails}>
                  <h3>{project.name}</h3>
                  <p>{expandedProjectIndex === index ? project.description : descriptionPreview}</p>
                  
                  {expandedProjectIndex !== index && (
                    <button style={styles.button} onClick={() => toggleProjectDetails(index)}>
                      More Info
                    </button>
                  )}

                  {expandedProjectIndex === index && (
                    <>
                      <p><strong>Domain:</strong> {project.domain}</p>
                      <p><strong>Members:</strong> {project.members.join(', ')}</p>
                      {project.achievements && <p><strong>Achievements:</strong> {project.achievements}</p>}
                      {project.links && (
                        <p><strong>Links:</strong> <a href={project.links} target="_blank" rel="noopener noreferrer" style={{color: '#F24B53'}}>{project.links}</a></p>
                      )}
                      <button style={styles.button} onClick={() => toggleProjectDetails(index)}>
                        Show Less
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedImageIndex !== null && (
        <div style={styles.imageViewer} onClick={closeImageViewer}>
          <img
            src={projects[selectedImageIndex].images[currentImageIndex]}
            alt={`Full view of project image ${currentImageIndex}`}
            style={styles.imageViewerImg}
          />
          <button style={styles.nextImageBtn} onClick={nextImage}>Next Image</button>
        </div>
      )}
    </div>
  );
}

export default ProjectDisplay;