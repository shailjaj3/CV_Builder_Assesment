import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardContent, Avatar, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'; 
import { MdEmail, MdPhone } from 'react-icons/md';
import { Box } from '@mui/system';
import jsPDF from 'jspdf';

const imageArray = ['/rfour.jpg', '/rfive.jpg'];
const URL = import.meta.env.VITE_LOCAL_URL;

function AllCVs() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);


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

  const handleDelete = async () => {
    try {
      const token = getToken();
      const response = await axios.delete(`${URL}/api/v1/cv/${selectedProfileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile._id !== selectedProfileId));
        setOpenDialog(false); // Close the dialog after deletion
      } else {
        console.error('Failed to delete profile.');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog without doing anything
  };



  const handleDeleteClick = (id) => {
    setSelectedProfileId(id);
    setOpenDialog(true); // Open the delete confirmation dialog
  };


  const handleCardClick = (id, index) => {
    if (index % 2 === 0) {
      navigate(`/AllCVOne/${id}`);
    } else {
      navigate(`/AllCVTwo/${id}`);
    }
  };

  // Navigate to the dashboard with the CV ID for editing
  const handleEditClick = (id) => {
    navigate(`/editor/${id}`);
  };

  const generatePdf = (profile) => {
    const { basicDetails = {} } = profile;
    const { name = 'Unknown Name', email = 'N/A', phone = 'N/A', imageUrl = '/pic2.jpg' } = basicDetails;

    const pdf = new jsPDF('p', 'mm', 'a4');

    // Adding profile image
    pdf.addImage(imageUrl, 'JPEG', 10, 10, 40, 40);

    // Adding name and contact information
    pdf.setFontSize(20);
    pdf.text(name, 60, 20);

    pdf.setFontSize(12);
    pdf.text(`Email: ${email}`, 60, 30);
    pdf.text(`Phone: ${phone}`, 60, 40);

    // Adding a section for CV details
    pdf.setFontSize(16);
    pdf.text('About Me:', 10, 60);
    pdf.setFontSize(12);
    pdf.text(basicDetails.introductoryParagraph || 'No introductory paragraph provided.', 10, 70, { maxWidth: 180 });

    // Save the generated PDF
    pdf.save(`${name}_CV.pdf`);
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

      <Grid container spacing={3}>
        {profiles.length > 0 ? (
          profiles.map((profile, index) => {
            const { basicDetails = {} } = profile;
            const {
              name = 'Unknown Name',
              email = 'N/A',
              phone = 'N/A',
              imageUrl = '',
            } = basicDetails;

            return (
              <Grid item xs={12} sm={6} md={4} key={profile._id}>
                <Card
                  style={{
                    cursor: 'pointer',
                    transition: '0.3s',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '15px',
                    padding: '20px',
                    backgroundColor: '#e0f7fa',
                  }}
                  sx={{
                    ':hover': { boxShadow: 6 },
                  }}
                  onClick={() => handleCardClick(profile._id, index)} // Pass index to handleCardClick
                >
                  <Box display="flex" justifyContent="center" marginTop={2}>
                    <Avatar alt={name} src={imageUrl} sx={{ width: 140, height: 140 }} />
                  </Box>

                  <CardContent>
                    <Typography variant="h6" component="div" align="center" gutterBottom>
                      {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      <MdEmail /> {email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      <MdPhone /> {phone}
                    </Typography>
                  </CardContent>

                  <Box display="flex" justifyContent="center" mt={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(profile._id); // Open delete confirmation dialog
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
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={(e) => {
                        e.stopPropagation();
                        generatePdf(profile);
                      }}
                      style={{ marginLeft: '10px' }}
                    >
                      Download PDF
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography variant="body1" color="text.secondary" style={{ color: 'white', textAlign: 'center' }}>
            No profiles found.
          </Typography>
        )}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this profile?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}

export default AllCVs;
