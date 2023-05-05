import Header from '@/components/common/header';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import ConfirmationModal from '../common/confirmationModal';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/pages';

const UserForm = ({ userId }) => {

    const isUpdate = userId ? true : false;

    const [user, setUser] = useState({
        id: '',
        password: '',
        confirmPassword: '',
        userDetail: {
            firstName: '',
            lastName: '',
            middleName: '',
            gender: '',
            birthDate: '',
            civilStatus: '',
            contactNo1: '',
            contactNo2: '',
            email: '',
            houseBlkNo: '',
            district: '',
            street: '',
        }
    });
    const router = useRouter();

    const [saveMsgOpen, setSaveMsgOpen] = React.useState(false);
    const handleSaveMsgOpen = () => setSaveMsgOpen(true);
    const handleSaveMsgClose = () => setSaveMsgOpen(false);

    const [successMsgOpen, setSuccessMsgOpen] = React.useState(false);
    const handleSuccessMsgOpen = () => setSuccessMsgOpen(true);
    const handleSuccessMsgClose = () => setSuccessMsgOpen(false);

    function setUserState(fieldName: any, newValue: any) {
        setUser((prevState) => ({
            ...prevState,
            [fieldName]: newValue
        }));
    }

    function setUserDetailState(fieldName: any, newValue: any) {
        setUser((prevState) => {
            const userObj = {
                ...prevState,
                userDetail: prevState.userDetail,
            }
            userObj.userDetail[fieldName] = newValue;
            return userObj;
        });
    }

    React.useEffect(() => {
        async function initializeUserDetails() {
            console.log('initializeUserDetails: ', userId);
            if (userId) {
                await fetch(`http://localhost:8081/api/v1/user/get/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        // 'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                })
                .then(response => response.json())
                .then(response => {
                    const userData = response.data;
                    console.log('userData:' , userData);
                    setUser((prevState) => {
                        const userObj = {
                            ...prevState,
                            userDetail: prevState.userDetail,
                        }
                        userObj.id = userData.id;
                        userObj.userDetail.firstName = userData.userDetail.firstName;
                        userObj.userDetail.middleName = userData.userDetail.middleName;
                        userObj.userDetail.lastName = userData.userDetail.lastName;
                        userObj.userDetail.gender = userData.userDetail.gender;
                        userObj.userDetail.birthDate = userData.userDetail.birthDate;
                        userObj.userDetail.civilStatus = userData.userDetail.civilStatus;
                        userObj.userDetail.contactNo1 = userData.userDetail.contactNo1;
                        userObj.userDetail.contactNo2 = userData.userDetail.contactNo2;
                        userObj.userDetail.email = userData.userDetail.email;
                        userObj.userDetail.houseBlkNo = userData.userDetail.houseBlkNo;
                        userObj.userDetail.district = userData.userDetail.district;
                        userObj.userDetail.street = userData.userDetail.street;
                        return userObj;
                    });
                    console.log('user: ', user);
                });
            }
        }
        initializeUserDetails();
    }, []);

    
    function handleSubmit(event: any) {
        event.preventDefault();
        handleSaveMsgOpen();
    }

    function confirmSave() {
        saveUserDetails();
    }

    function redirectToDashboard() {
        handleSuccessMsgClose();
        router.push('/dashboard');
    }

    async function saveUserDetails() {
        const url = isUpdate ? `http://localhost:8081/api/v1/user/update/${userId}` : `http://localhost:8081/auth/register`;
        const result = await fetch(url, {
            method: isUpdate ? 'PUT' : 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-type': 'application/json',
                // 'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        if (result.ok) {
            handleSuccessMsgOpen();
        }
    }

    function setDateOfBirth(newValue: any) {
        const dateOfBirthEl: HTMLElement | null = document.getElementById('birthDate');
        if (dateOfBirthEl && newValue) {
            dateOfBirthEl.value = dayjs(newValue).format('DD/MM/YYYY');
        }
        setUserDetailState(dateOfBirthEl.name, dateOfBirthEl.value);
    }

    return (
        <ThemeProvider theme={theme}>
            <Header />
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
                    { isUpdate ? 'Update' : 'Create'} User Account
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username / Email"
                        name="id"
                        autoComplete="username"
                        value={user.id}
                        onChange={(e) => { setUserState(e.target.name, e.target.value) }}
                        autoFocus
                    />

                    { !isUpdate && (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={user.password}
                            onChange={(e) => { setUserState(e.target.name, e.target.value) }}
                            autoComplete="current-password"
                        />
                    )}

                    { !isUpdate && (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            value={user.confirmPassword}
                            onChange={(e) => { setUserState(e.target.name, e.target.value) }}
                            autoComplete="confirm-password"
                        />
                    )}

                    <Typography component="h1" variant="h5">
                        Personal Information
                    </Typography>
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        value={user.userDetail.firstName}
                        onChange={(e) => { setUserDetailState(e.target.name, e.target.value) }}
                        autoComplete="firstName"
                        autoFocus
                    />
                     <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="middleName"
                        label="Middle Name"
                        name="middleName"
                        value={user.userDetail.middleName}
                        onChange={(e) => { setUserDetailState(e.target.name, e.target.value) }}
                        autoComplete="middleName"
                        autoFocus
                    />
                     <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        value={user.userDetail.lastName}
                        onChange={(e) => { setUserDetailState(e.target.name, e.target.value) }}
                        autoComplete="lastName"
                        autoFocus
                    />

                    <FormControl fullWidth margin="normal">
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="gender"
                        >
                            <FormControlLabel value="M" control={<Radio />} label="Male" onChange={(e) => { setUserDetailState(e.target.name, e.target.value) }} />
                            <FormControlLabel value="F" control={<Radio />} label="Female" onChange={(e) => { setUserDetailState(e.target.name, e.target.value) }} color='#eee442' />
                        </RadioGroup>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker format='DD/MM/YYYY' label="Date of Birth" value={dayjs(user.userDetail.birthDate)} onChange={(newValue) => { setDateOfBirth(newValue); }} />
                            <input type="hidden" id="birthDate" name="birthDate" />
                        </LocalizationProvider>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="civilStatus-label">Civil Status</InputLabel>
                        <Select
                            labelId="civilStatus-label"
                            id="civilStatus-select"
                            name="civilStatus"
                            value={user.userDetail.civilStatus}
                            onChange={(e) => { setUserDetailState(e.target.name, e.target.value) }}
                            label="Civil Status"
                        >
                            <MenuItem value='S'>Single</MenuItem>
                            <MenuItem value='M'>Married</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="contactNo1"
                        label="Contact No 1"
                        name="contactNo1"
                        value={user.userDetail.contactNo1}
                        onChange={(e) => { setUserDetailState(e.target.name, e.target.value) }}
                        autoComplete="contactNo1"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="contactNo2"
                        label="Contact No 2"
                        name="contactNo2"
                        value={user.userDetail.contactNo2}
                        onChange={(e) => { setUserDetailState(e.target.name, e.target.value) }}
                        autoComplete="contactNo2"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        value={user.userDetail.email}
                        onChange={(e) => { setUserDetailState(e.target.name, e.target.value) }}
                        autoComplete="email"
                        autoFocus
                    />

                    <Typography component="h1" variant="h5">
                        Address
                    </Typography>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="houseBlkNo"
                        label="House Block No"
                        name="houseBlkNo"
                        value={user.userDetail.houseBlkNo}
                        onChange={(e) => { setUserDetailState(e.target.name, e.target.value) }}
                        autoComplete="houseBlkNo"
                        autoFocus
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="district-label">District</InputLabel>
                        <Select
                            labelId="district-label"
                            id="district"
                            name="district"
                            value={user.userDetail.district}
                            onChange={(e) => { setUserDetailState(e.target.name, e.target.value) }}
                            label="District"
                        >
                            <MenuItem value='P1'>Purok 1</MenuItem>
                            <MenuItem value='P2'>Purok 2</MenuItem>
                            <MenuItem value='P2'>Purok 3</MenuItem>
                            <MenuItem value='P2'>Purok 4</MenuItem>
                            <MenuItem value='P2'>Purok 5</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="street-label">Street Name</InputLabel>
                        <Select
                            labelId="street-label"
                            id="street"
                            name="street"
                            value={user.userDetail.street}
                            onChange={(e) => { setUserDetailState(e.target.name, e.target.value) }}
                            label="Street Name"
                        >
                            <MenuItem value='S1'>Bagonpook Ave.</MenuItem>
                            <MenuItem value='S1'>Lina</MenuItem>
                            <MenuItem value='S2'>Macasaet</MenuItem>
                            <MenuItem value='S2'>Villapando</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {isUpdate ? 'Update' : 'Create'} Account
                    </Button>
                    </Box>
                </Box>
            </Container>
            <ConfirmationModal
                open={saveMsgOpen}
                handleClose={handleSaveMsgClose}
                action="Save" 
                message="Proceed to save?"
                okAction={null}
                yesAction={confirmSave}
                noAction={handleSaveMsgClose}
            />
            <ConfirmationModal
                open={successMsgOpen}
                handleClose={handleSuccessMsgClose}
                action="Success" 
                message="Account has been saved!"
                okAction={redirectToDashboard}
                yesAction={null}
                noAction={null}
            />
        </ThemeProvider>
    )
}

export default UserForm;