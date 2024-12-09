import { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, Box } from '@mui/material';
import { MdEmail, MdPhone } from 'react-icons/md';
import { ExpandMore } from '@mui/icons-material';

const imageArray = ['/rone.jpg', '/rtwo.jpg', '/rthree.jpg', '/rfour.jpg', '/rfive.jpg'];
const URL = import.meta.env.VITE_LOCAL_URL;

function AllCVs() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageArray.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`${URL}/api/v1/cv`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setProfiles(response.data.data);
        } else {
          console.error('Failed to fetch profiles.');
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = getToken();
      const response = await axios.delete(`${URL}/api/v1/cv/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile._id !== id));
      } else {
        console.error('Failed to delete profile.');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const handleCardClick = (id, index) => {
    if (index % 2 === 0) {
      navigate(`/AllCVOne/${id}`);
    } else {
      navigate(`/AllCVTwo/${id}`);
    }
  };

  const handleEditClick = (id) => {
    navigate(`/editor/${id}`);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${imageArray[currentImageIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom style={{ color: 'white', textAlign: 'center' }}>
        All CVs
      </Typography>

      <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
        {profiles.length > 0 ? (
          profiles.map((profile, index) => {
            const { basicDetails = {} } = profile;
            const { name = 'Unknown Name', email = 'N/A', phone = 'N/A', imageUrl = '/pic2.jpg' } = basicDetails;

            return (
              <Accordion key={profile._id} style={{ marginBottom: '10px', backgroundColor: '#e0f7fa' }}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls={`panel${profile._id}-content`}
                  id={`panel${profile._id}-header`}
                  style={{ cursor: 'pointer' }}
                >
                  <Box display="flex" alignItems="center">
                    <img
                      src={imageUrl}
                      alt={name}
                      style={{ width: 60, height: 60, borderRadius: '50%', marginRight: '20px' }}
                    />
                    <Typography variant="h6">{name}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <MdEmail /> {email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <MdPhone /> {phone}
                    </Typography>

                    <Box display="flex" justifyContent="flex-start" mt={2}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(profile._id);
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(profile._id);
                        }}
                        style={{ marginLeft: '10px' }}
                      >
                        Edit
                      </Button>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })
        ) : (
          <Typography variant="body1" color="text.secondary" style={{ color: 'white', textAlign: 'center' }}>
            No profiles found.
          </Typography>
        )}
      </Box>
    </div>
  );
}

export default AllCVs;
