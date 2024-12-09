import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  Link,
} from '@mui/material';

const URL = import.meta.env.VITE_LOCAL_URL;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contactNumber: '',
    password: '',
  });

  // Array of background images
  const images = ['rone.jpg', 'rtwo.jpg', 'rthree.jpg', 'rfour.jpg', 'rfive.jpg'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Change the background image every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [images.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${URL}/api/v1/auth/register`, formData);
      console.log('Registration successful:', response.data);

      navigate('/dashboard');
      alert('Registration successful');
    } catch (error) {
      console.error('Error during registration:', error.response?.data || error.message);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${images[currentImageIndex]})`, // Dynamically set background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out', // Smooth transition between images
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ padding: '20px' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              fullWidth
              value={formData.username}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              label="Contact Number"
              name="contactNumber"
              type="tel"
              fullWidth
              value={formData.contactNumber}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                mb: 2,
                backgroundColor: '#d32f2f', // Consistent red color
              }}
            >
              Register
            </Button>
          </form>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Login
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
