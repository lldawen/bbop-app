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
import { appendAdminUrl } from './util';
import { Stack } from '@mui/material';

let userProfile = {};

export function getProfile() {
  return userProfile;
}

export default function Header({ isPublicPage = false }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [profile, setProfile] = React.useState();
  const [userMenuList, setUserMenuList] = React.useState(['My Dashboard', 'Profile', 'Logout']);
  const router = useRouter();

  const defaultMenuList = ['My Dashboard', 'Profile', 'Logout'];
  const adminMenuList = ['My Dashboard', 'Manage Users', 'Profile', 'Logout'];

  React.useEffect(() => {
    if (!isPublicPage) {
      checkProfile();
    }
  }, []);

  async function checkProfile() {
    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BBOP_SERVICE_URL}/auth/checkProfile`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });
        if (result.ok) {
            const json = await result.json();
            setIsLoggedIn(true);
            setProfile(json);
            userProfile = json;
            console.log(userProfile);
            localStorage.setItem('userId', json.id);
            localStorage.setItem('role', json.role);
            setIsAdmin(json.role == 'ADMIN');
            initializeUserMenu(json?.role == 'ADMIN');
        } else {
            setIsLoggedIn(false);
            router.push(appendAdminUrl(isAdmin) + '/login');
        }
    } catch(exception) {
        console.log('Invalid username and/or password.', exception);
    }
  }

  function initializeUserMenu(isAdmin) {
    if (isAdmin) {
      setUserMenuList(adminMenuList);
    } else {
      setUserMenuList(defaultMenuList);
    }
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleUserMenuNavigation = (selectedMenu) => {
    if (selectedMenu == 'Manage Users') {
      router.push('/admin/user/all');
    } else if (selectedMenu == 'My Dashboard') {
      router.push(appendAdminUrl(isAdmin) + '/dashboard');
    } else if (selectedMenu == 'Profile') {
      router.push(appendAdminUrl(isAdmin) + `/user/get/${profile.id}`);
    } else if (selectedMenu == 'Logout') {
      logout();
    }
  }

  const goToPage = (url: string) => {
    router.push(url);
  };

  function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  }

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
                <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
                  <Typography variant='h6' sx={{ fontSize: '1em', mt: 2, mr: 0 }}>Welcome, {profile.userDetail.firstName}!</Typography>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar>
                      <Image alt="Menu" width={150} height={45} src="/images/default-avatar.png" />
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
                    {userMenuList.map((userMenu) => (
                      <MenuItem key={userMenu} onClick={() => { handleUserMenuNavigation(userMenu); }}>
                        <Typography textAlign="center">{userMenu}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Stack>
              )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}