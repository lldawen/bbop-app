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
import ConfirmationModal, { closeMessageBox, closeMessagePrompt, showMessageBox } from '../common/confirmationModal';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/pages';
import { appendAdminUrl, getDropdownOptions } from '../common/util';

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

    const [genderList, setGenderList] = React.useState([]);
    const [civilStatusList, setCivilStatusList] = React.useState([]);
    const [streetList, setStreetList] = React.useState([]);
    const [districtList, setDistrictList] = React.useState([]);

    const [messageBox, setMessageBox] = React.useState({
        open: false,
        action: '',
        message: '',
        okAction: undefined as unknown,
        yesAction: undefined as unknown,
        noAction: undefined as unknown,
    });

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
        getDropdownOptions('GENDER', setGenderList);
        getDropdownOptions('CIVIL_STATUS', setCivilStatusList);
        getDropdownOptions('STREET', setStreetList);
        getDropdownOptions('DISTRICT', setDistrictList);
        async function initializeUserDetails() {
            if (userId) {
                await fetch(`${process.env.NEXT_PUBLIC_BBOP_SERVICE_URL}/api/v1/user/get/${userId}`, {
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

    
    function saveUserAccount(event: any) {
        event.preventDefault();
        showMessageBox({
            action: 'Confirmation',
            message: 'Do you want to create this user account?',
            yesAction: confirmSaveUserAccount,
            noAction: () => closeMessagePrompt(setMessageBox),
        }, setMessageBox);
    }

    async function confirmSaveUserAccount() {
        if (user.password !== user.confirmPassword) {
            closeMessageBox({
                action: 'Error', 
                message: 'The passwords you entered do not match.',
            }, setMessageBox);
            return;
        }
        const url = isUpdate 
            ? `${process.env.NEXT_PUBLIC_BBOP_SERVICE_URL}/api/v1/user/update/${userId}` 
            : `${process.env.NEXT_PUBLIC_BBOP_SERVICE_URL}/auth/register`;
        const result = await fetch(url, {
            method: isUpdate ? 'PUT' : 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-type': 'application/json',
                // 'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        if (result.ok) {
            closeMessageBox({
                action: 'Success', 
                message: 'User account has been successfully ' + (isUpdate ? 'saved!' : 'created!'),
            }, setMessageBox, redirectPageAfterSave);
        }
    }

    function redirectPageAfterSave() {
        if (isUpdate) {
            router.push(appendAdminUrl(localStorage.getItem('role') == 'ADMIN') + `/dashboard`);
        } else {
            router.push(`/login`);
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
            <Header isPublicPage={!isUpdate} />
            <Container component="main" maxWidth="xs">
                <Box sx={{ marginTop: 4, display: "flex", flexDirection: "column", alignItems: "center", }}>
                    <Typography component="h1" variant="h4">
                        { isUpdate ? 'Update' : 'Create'} User Account
                    </Typography>
                </Box>
                <Box
                    sx={{
                    marginTop: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    }}
                >
                    <Box component="form" onSubmit={saveUserAccount} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        type='email'
                        fullWidth
                        id="username"
                        label="Username / Email"
                        name="id"
                        autoComplete="username"
                        value={user.id}
                        onChange={(e) => { setUserState(e.target.name, e.target.value) }}
                        autoFocus
                        disabled={isUpdate}
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

                    <Typography sx={{ mt: 3, mb: 1 }} component="h1" variant="h5">
                        Personal Information
                    </Typography>
                    
                    <TextField
                        margin="normal"
                        required
                        type='text'
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
                        type='text'
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
                        type='text'
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
                            {genderList.map((option) => (
                                <FormControlLabel key={option.code} checked={option.code == user.userDetail.gender} value={option.code} control={<Radio />} label={option.codeDescription} onChange={(e) => { setUserDetailState(e.target.name, e.target.value) }} />
                            ))}
                        </RadioGroup>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker 
                                format='DD/MM/YYYY' 
                                label="Date of Birth" 
                                value={dayjs(user.userDetail.birthDate)} 
                                onChange={(newValue) => { setDateOfBirth(newValue); }} 
                                disableFuture
                            />
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
                            {civilStatusList.map((option) => (
                                <MenuItem key={option.code} value={option.code}>{option.codeDescription}</MenuItem>    
                            ))}
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
                        type='email'
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        value={user.userDetail.email ? user.userDetail.email : user.id}
                        onChange={(e) => { setUserDetailState(e.target.name, e.target.value) }}
                        autoComplete="email"
                        autoFocus
                    />

                    <Typography sx={{ mt: 3, mb: 1 }} component="h1" variant="h5">
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
                            {districtList.map((option) => (
                                <MenuItem key={option.code} value={option.code}>{option.codeDescription}</MenuItem>    
                            ))}
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
                            {streetList.map((option) => (
                                <MenuItem key={option.code} value={option.code}>{option.codeDescription}</MenuItem>    
                            ))}
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
                open={messageBox.open}
                handleClose={() => closeMessagePrompt(setMessageBox)}
                action={messageBox.action}
                message={messageBox.message}
                okAction={messageBox.okAction}
                yesAction={messageBox.yesAction}
                noAction={messageBox.noAction}
            />
        </ThemeProvider>
    )
}

export default UserForm;