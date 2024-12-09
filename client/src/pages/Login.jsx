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
  Snackbar,
} from '@mui/material';

const URL = import.meta.env.VITE_LOCAL_URL;

const Login = ({ setToken, setUserName }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Array of background images
  const images = ['one.jpg', 'two.jpg', 'three.jpg', 'four.jpg'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Preload images on component mount
  useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  // Change the background image every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [images.length]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${URL}/api/v1/auth/login`, formData);
  
      // Assuming the response contains the token directly
      const result = response.data;
  
      if (result.token) {
        // Save token and email to localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('email', formData.email);

  
        // Show success message
        setSnackbarMessage('Login successful!');
        setSnackbarOpen(true);
  
        // // Navigate to the home page after a brief delay
        // setTimeout(() => {
        //   navigate('/');
        // }, 1000);


        setToken(result.token); // Update token in parent state
        const user = JSON.parse(atob(result.token.split('.')[1]));
        setUserName(user.name); // Update userName in parent state

        navigate('/');
      } else {
        // Handle case where token is not in the response
        const errorMessage = result.error || 'Login failed. Please try again.';
        setSnackbarMessage(errorMessage);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
  
      // Show specific error message if available
      const errorMessage =
        error.response?.data?.error || 'An unexpected error occurred. Please try again.';
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${images[currentImageIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out',
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ padding: '20px' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
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
                backgroundColor: '#d32f2f',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                },
              }}
            >
              Login
            </Button>
          </form>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/register" variant="body2">
                Don't have an account? Sign up
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Login;
