import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';
import Image from 'next/image';

const settings = ['My Dashboard', 'Profile', 'Logout'];

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleUserMenuNavigation = (selectedMenu) => {
    if (selectedMenu == 'My Dashboard') {
      router.push('/dashboard');
    } else if (selectedMenu == 'Profile') {
      router.push('/user/details/junjun@gmail.com');
    } else if (selectedMenu == 'Logout') {
      setIsLoggedIn(false);
      router.push('/');
    }
  }

  const goToPage = (url: string) => {
    console.log('goToPage: ', url, router);
    router.push(url);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton onClick={() => { goToPage('/'); }} sx={{ p: 0, margin: '0 30px 0 0' }}>
            <Image alt="Brgy Bagongpook Online Portal" width={150} height={35} src="/images/bbop-logo.png" />
          </IconButton>
          
          <Box sx={{ justifyContent: "flex-end", marginLeft: "auto" }}>
              {!isLoggedIn && (
              <Button
                type="button"
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
                href="/login"
                color="inherit"
              >
                Log In
              </Button>
              )}
              {isLoggedIn && (
                <>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar>
                      <Image alt="Menu" width={150} height={45} src="/images/profile-picture.jpg" />
                    </Avatar>
                  </IconButton>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
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
                    {settings.map((setting) => (
                      <MenuItem key={setting} onClick={() => { handleUserMenuNavigation(setting); }}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}