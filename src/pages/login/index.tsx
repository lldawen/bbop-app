import Header from '@/components/common/header';
import { ThemeProvider } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { theme } from '..';
import ConfirmationModal, { showMessageBox } from '@/components/common/confirmationModal';
import { closeMessagePrompt } from '@/components/common/confirmationModal';

const LoginPage = () => {

    const [profile, setProfile] = useState();
    const router = useRouter();
    const [messageBox, setMessageBox] = React.useState({
        open: false,
        action: '',
        message: '',
        okAction: undefined as unknown,
        yesAction: undefined as unknown,
        noAction: undefined as unknown,
    });

    function handleSubmit(event: any) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        authenticate(data.get('email'), data.get('password'));
    };

    async function authenticate(email: any, password: any) {
        let loginFailed = false;
        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_BBOP_SERVICE_URL}/auth/authenticate`, {
                method: 'POST',
                body: JSON.stringify({ 'username': email, 'password': password, signInAsAdmin: false }),
                headers: {
                    'Content-type': 'application/json',
                },
            });
            if (result.ok) {
                const json = await result.json();
                localStorage.setItem('userId', email);
                localStorage.setItem('role', 'USER');
                localStorage.setItem('token', json.data.token);
                router.push('/dashboard');
            } else {
                loginFailed = true;
            }
        } catch(exception) {
            loginFailed = true;
        }
        if (loginFailed) {
            showMessageBox({
                action: 'Login Failed',
                message: 'Failed to login. Please check your username/password.',
                okAction: () => closeMessagePrompt(setMessageBox),
            }, setMessageBox);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Header isPublicPage={true} />
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{  
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h5">
                    Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                        <Link href="/admin/login" variant="body2">
                            Administrator Login
                        </Link>
                        </Grid>
                        <Grid item>
                        <Link href="/user/create" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                        </Grid>
                    </Grid>
                    </Box>
                </Box>
            </Container>
            <ConfirmationModal
                open={messageBox.open}
                handleClose={closeMessagePrompt}
                action={messageBox.action}
                message={messageBox.message}
                okAction={messageBox.okAction}
                yesAction={messageBox.yesAction}
                noAction={messageBox.noAction}
            />
        </ThemeProvider>
    )
}

export default LoginPage;