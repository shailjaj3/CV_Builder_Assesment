import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaFileAlt, FaListAlt } from 'react-icons/fa';
import { VscAccount } from 'react-icons/vsc';
import { AiOutlineLogout } from 'react-icons/ai';
import { RiAccountCircleLine } from 'react-icons/ri';
import axios from 'axios';

const Header = ({ token, userName, setToken, setUserName }) => {
  // const [token, setToken] = useState(null);
  // const [userName, setUserName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const user = JSON.parse(atob(storedToken.split('.')[1]));
      setUserName(user.name);
    }
  }, []);

  const email = localStorage.getItem('email');
  // const displayName = email ? email.split('@')[0] : 'User Profile';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setToken(null);
    setUserName('');
    handleCloseMenu();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const displayName = userName || localStorage.getItem('email')?.split('@')[0] || 'User Profile';


  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        {/* Left-aligned items */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
          {token ? (
            <>
              <Button color="inherit" onClick={handleMenuOpen} startIcon={<RiAccountCircleLine />} sx={{ fontWeight: 'bold' }}>
                {displayName || 'User Profile'}
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem component={Link} to="/user-profile" onClick={handleCloseMenu}>
                  <RiAccountCircleLine style={{ marginRight: '8px' }} /> User Profile
                </MenuItem>
                <MenuItem component={Link} to="/cv-builder" onClick={handleCloseMenu}>
                  <FaFileAlt style={{ marginRight: '8px' }} /> CV Builder
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <AiOutlineLogout style={{ marginRight: '8px' }} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" startIcon={<RiAccountCircleLine />} sx={{ fontWeight: 'bold' }}>
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register" startIcon={<VscAccount />} sx={{ fontWeight: 'bold' }}>
                Register
              </Button>
            </>
          )}
        </Box>

        {/* Right-aligned items */}
        <Typography variant="h6" component={Link} to="/" sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
          CV Genius App
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <Button color="inherit" component={Link} to="/dashboard" startIcon={<FaTachometerAlt />} sx={{ fontWeight: 'bold' }}>
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/templates" startIcon={<FaFileAlt />} sx={{ fontWeight: 'bold' }}>
            Templates
          </Button>
          <Button color="inherit" component={Link} to="/all-cvs" startIcon={<FaListAlt />} sx={{ fontWeight: 'bold' }}>
            All CVs
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
