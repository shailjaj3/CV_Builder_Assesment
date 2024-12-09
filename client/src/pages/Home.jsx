import { Email, Instagram, Twitter, LinkedIn } from '@mui/icons-material'; // Material UI Icons
import { useEffect, useState } from 'react';

const Home = () => {
  const images = [
    'pone (1).jpg',
    'pone (2).jpg',
    'pone (3).jpg',
    'pone (4).jpg',
    'pone (5).jpg',
  ];

  const data = [
    {
      name: 'Haruto Yamamoto',
      designation: 'Digital Artist',
      about: 'I create immersive digital art experiences, focusing on color and emotion.',
      education: '2024 Bachelor of Fine Arts in Digital Arts, Artistry University, Graduated with Honors',
      experience: '2023 Freelance Artist, 2022 Art Intern at Creative Studio',
    },
    {
      name: 'Akira Tanaka',
      designation: 'Graphic Designer',
      about: 'I specialize in branding and visual communication, turning ideas into impactful designs.',
      education: '2023 Bachelor of Arts in Graphic Design, Creative Arts College',
      experience: '2022 Junior Designer at Design Agency, Freelance Projects',
    },
    {
      name: 'Sakura Watanabe',
      designation: 'Web Developer',
      about: 'I build responsive and user-friendly websites with a focus on front-end development.',
      education: '2025 Bachelor of Science in Computer Science, Tech University',
      experience: '2023 Web Developer Intern at Startup Inc., Freelance Developer',
    },
    {
      name: 'Yuki Sato',
      designation: 'Illustrator',
      about: 'My illustrations tell stories through vibrant colors and imaginative characters.',
      education: '2024 Bachelor of Arts in Illustration, Art Institute',
      experience: '2023 Freelance Illustrator, 2022 Intern at Creative Publishing',
    },
    {
      name: 'Riku Kobayashi',
      designation: 'Animator',
      about: 'I bring characters to life with engaging animations, focusing on storytelling.',
      education: '2025 Bachelor of Fine Arts in Animation, Animation Academy',
      experience: '2023 Animation Intern at Media Productions, Freelance Animator',
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <div className="min-h-screen flex justify-center items-center relative">
      {/* Fixed background image */}
      <div
        style={{
          backgroundImage: `url('/onetry.jpg')`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      />

      {/* Main Container */}
      <div className="flex w-[90%] max-w-7xl rounded-md shadow-lg bg-[#f5e4d7] overflow-hidden relative">
        {/* Left Section - Image Slider */}
        <div className="relative flex justify-center items-center w-[40%]">
          <div
            className="absolute rounded-full border-4 border-opacity-30 border-white bg-opacity-40"
            style={{
              height: '300px',
              width: '300px',
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}
          />
          <img
            src={`/${images[currentImageIndex]}`}
            alt="Dynamic Profile"
            className="w-64 h-64 rounded-full object-cover z-10 shadow-md"
          />
        </div>

        {/* Right Section */}
        <div className="w-[60%] p-8 bg-[#fff] relative">
          {/* About Me Section */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-brown-700">About Me</h3>
            <p className="text-md text-brown-600 mt-2">{data[currentImageIndex].about}</p>
          </div>

          {/* Education Section */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-brown-700">Education</h3>
            <p className="text-md text-brown-600 mt-2">{data[currentImageIndex].education}</p>
          </div>

          {/* Experience Section */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-brown-700">Experience</h3>
            <p className="text-md text-brown-600 mt-2">{data[currentImageIndex].experience}</p>
          </div>

          {/* Social Icons */}
          <div className="mt-8 flex space-x-4 justify-center">
            <a href="#" className="text-brown-600 hover:text-brown-800">
              <Email fontSize="large" />
            </a>
            <a href="#" className="text-brown-600 hover:text-brown-800">
              <Instagram fontSize="large" />
            </a>
            <a href="#" className="text-brown-600 hover:text-brown-800">
              <Twitter fontSize="large" />
            </a>
            <a href="#" className="text-brown-600 hover:text-brown-800">
              <LinkedIn fontSize="large" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
