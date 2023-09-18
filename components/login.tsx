import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';

export default function Login() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const router = useRouter();

  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const settings = [
    {
      label: 'Sign Out',
      onClick: () => {
        signOut();
        router.reload();
      },
    },
  ];

  const { data: session } = useSession();

  if (!session) {
    return <Button onClick={() => signIn()}>Sign in</Button>;
  }

  const avatar = session?.user?.image ? (
    <img
      src={session.user.image}
      height={50}
      width={50}
      style={{ borderRadius: '100%' }}
    />
  ) : (
    <Avatar sx={{ width: 50, height: 50 }}>{session.user.name[0]}</Avatar>
  );

  return (
    <Box>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu}>{avatar}</IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map(setting => (
          <MenuItem key={setting.label} onClick={setting.onClick}>
            <Typography textAlign="center">{setting.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
