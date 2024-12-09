import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; // Import slick styles

function Templates() {
  const navigate = useNavigate();

  const profiles = [
    {
      id: '1',
      name: 'Modern',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      image: '/pic1.jpg',
      bgImage: '/temp1.jpg',
    },
    {
      id: '2',
      name: 'Creative',
      email: 'jane.smith@example.com',
      phone: '+0987654321',
      image: '/pic2.jpg',
      bgImage: '/temp2.jpg',
    },
  ];

  const [backgroundImage, setBackgroundImage] = useState('/public/one.jpg');
  const images = ['/public/one.jpg', '/public/two.jpg', '/public/three.jpg'];

  const handleCardClick = (id) => {
    navigate(`/dashboard?templateId=${id}`);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBackgroundImage((prevImage) => {
        const currentIndex = images.indexOf(prevImage);
        const nextIndex = (currentIndex + 1) % images.length;
        return images[nextIndex];
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [images]);

  // Carousel settings for react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Ensure only 1 card is shown per slide
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, // For mobile screens
        settings: {
          slidesToShow: 1, // Always show 1 card per slide
        },
      },
      {
        breakpoint: 1024, // For tablets and small screens
        settings: {
          slidesToShow: 1, // Always show 1 card per slide
        },
      },
      {
        breakpoint: 1600, // For larger screens
        settings: {
          slidesToShow: 1, // Always show 1 card per slide
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1200, padding: 4 }}>
        <Slider {...settings}>
          {profiles.map((profile) => (
            <div key={profile.id}>
              <Card
                elevation={3}
                sx={{
                  position: 'relative',
                  padding: 1,
                  backgroundImage: `url(${profile.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: 'pointer',
                  height: 300,
                  borderRadius: 15,
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 4,
                }}
                onClick={() => handleCardClick(profile.id)}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  }}
                />
                <CardContent
                  sx={{
                    position: 'relative',
                    zIndex: 2,
                    color: '#fff',
                    textAlign: 'center',
                  }}
                >
                  <Avatar
                    src={profile.image}
                    alt={profile.name}
                    sx={{
                      width: 80,
                      height: 80,
                      border: '4px solid #fff',
                      marginBottom: 2,
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {profile.name}
                  </Typography>
                  <Typography variant="body2">{profile.email}</Typography>
                  <Typography variant="body2">{profile.phone}</Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}

export default Templates;
