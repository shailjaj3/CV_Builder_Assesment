import { Box, Grid, Card, CardContent, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Templates() {
    const navigate = useNavigate();

    const profiles = [
        {
            id: '1',
            name: 'Modern',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            image: '/pic1.jpg',
        },
        {
            id: '2',
            name: 'Creative',
            email: 'jane.smith@example.com',
            phone: '+0987654321',
            image: '/pic2.jpg',
        },
    ];

    const [backgroundImage, setBackgroundImage] = useState('/public/one.jpg');
    const images = ['/public/two.jpg'];

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
            <Box sx={{ flexGrow: 1, padding: 4 }}>
                <Grid container spacing={3} justifyContent="center">
                    {profiles.map((profile) => (
                        <Grid item xs={12} sm={6} md={4} key={profile.id}>
                            <Card
                                elevation={3}
                                sx={{
                                    position: 'relative',
                                    padding: 1,
                                    backgroundImage: `url(/temp1.jpg)`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    cursor: 'pointer',
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
                                        zIndex: 1,
                                    }}
                                ></Box>

                                <CardContent
                                    sx={{
                                        position: 'relative',
                                        zIndex: 2,
                                        color: '#fff',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginBottom: 2,
                                        }}
                                    >
                                        <Avatar
                                            src={profile.image}
                                            alt={profile.name}
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                border: '5px solid #fff',
                                                backgroundColor: '#fff',
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="h5" component="div" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                        {profile.name}
                                    </Typography>

                                    <Typography variant="body1" component="div" sx={{ textAlign: 'center' }}>
                                        {profile.email}
                                    </Typography>

                                    <Typography variant="body1" component="div" sx={{ textAlign: 'center', marginBottom: 2 }}>
                                        {profile.phone}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

export default Templates;
