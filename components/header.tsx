import { MouseEvent, useState } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';

import Login from './login';

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const navLinks = [
    {
      label: 'Create',
      href: '/tournament/create',
    },
    {
      label: 'Tournaments',
      href: '/tournament',
    },
  ];

  const logo = (
    <Typography
      variant="h6"
      noWrap
      component="a"
      href="/"
      sx={{
        mr: 2,
        fontWeight: 700,
        letterSpacing: '.3rem',
      }}
    >
      ht-slp
    </Typography>
  );

  const desktopNav = navLinks.map(({ label, href }) => (
    <Typography
      key={label}
      noWrap
      component="a"
      href={href}
      sx={{ marginRight: 3 }}
    >
      {label}
    </Typography>
  ));

  const mobileNav = (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        {navLinks.map(({ label, href }) => (
          <MenuItem key={label}>
            <Typography
              noWrap
              component="a"
              href={href}
              sx={{ marginRight: 3 }}
            >
              {label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  return (
    <Toolbar
      sx={{
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#000000',
      }}
    >
      <Box sx={{ flexGrow: 0, display: { md: 'flex', xs: 'none' } }}>
        {logo}
      </Box>
      <Box sx={{ flexGrow: 0, display: { md: 'none', xs: 'flex' } }}>
        {mobileNav}
      </Box>
      <Box sx={{ flexGrow: 0, display: { md: 'flex', xs: 'none' } }}>
        {desktopNav}
      </Box>
      <Box sx={{ flexGrow: 0, display: { md: 'none', xs: 'flex' } }}>
        {logo}
      </Box>
      <Login />
    </Toolbar>
  );
};

export default Header;
