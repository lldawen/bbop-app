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
import { Checkbox, Stack, ThemeProvider } from '@mui/material';
import { theme } from '@/pages';
import ApplicationDocumentsGrid from './applicationDocumentGrid';

export default function ApplicationForm({ applId }) {

    const isUpdate = applId ? true : false;

    const [application, setApplication] = useState({
        applId: '',
        applicantId: 'admin@gmail.com',
        applTypeDescr: '',
        purposeDescr: '',
        isFeeRequired: false,
        feeAmount: 0,
        feePaid: 0,
        paymentDate: '',
        paymentModeDescr: '',
        status: 'S1',
        statusDescr: '',
        notifyViaEmail: false,
        certificateIssued: false,
        certificateIssueDate: '',
        applDocuments: [],
        certificateList: [],
        consent: false,
    });

    const [applTypeList, setApplTypeList] = useState([]);
    const [purposeList, setPurposeList] = useState([]);

    const router = useRouter();

    
    const [saveMsgOpen, setSaveMsgOpen] = React.useState(false);
    const [successMsgOpen, setSuccessMsgOpen] = React.useState(false);
    const [msgAction, setMsgAction] = React.useState('');
    const [msgDetail, setMsgDetail] = React.useState('');
    
    const handleSaveMsgOpen = (action: string, msgDetail: string) => {
        setMsgAction(action);
        setMsgDetail(msgDetail);
        setSaveMsgOpen(true);
    }
    const handleSuccessMsgOpen = (action: string, msgDetail: string) => {
        setTimeout(() => {
            setMsgAction(action);
            setMsgDetail(msgDetail);
            setSuccessMsgOpen(true);
        }, 300);
    }
    const handleSaveMsgClose = () => {
        setMsgAction('');
        setMsgDetail('');
        setSaveMsgOpen(false);
    }
    const handleSuccessMsgClose = () => {
        setMsgAction('');
        setMsgDetail('');
        setSuccessMsgOpen(false);
    }

    function setApplicationState(fieldName: any, newValue: any) {
        console.log('setApplicationState: ', fieldName, newValue);
        setApplication((prevState) => ({
            ...prevState,
            [fieldName]: newValue
        }));
    }

    function setApplicationType(fieldName: any, newValue: any) {
        const isFeeRequiredVal = newValue == 'C' || newValue == 'R';
        const feeAmountVal = newValue == 'C' ? 50.00 : (newValue == 'R' ? 100.50 : 0.00);
        setApplicationState(fieldName, newValue);
        setApplicationState('isFeeRequired', isFeeRequiredVal);
        setApplicationState('feeAmount', feeAmountVal);
    }
    
    async function getCodes(category, setter) {
        const response = await fetch(`http://localhost:8081/api/v1/code/category/${category}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                // 'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        const json = await response.json();
        console.log('json: ', json.data);
        setter(json.data);
    }

    React.useEffect(() => {
        getCodes('APPL_TYPE', setApplTypeList);
        getCodes('APPL_PURPOSE', setPurposeList);
        async function initializeApplicationDetails() {
            if (applId) {
                await fetch(`http://localhost:8081/api/v1/application/get/${applId}`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        // 'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                })
                .then(response => response.json())
                .then(response => {
                    const applData = response.data;
                    console.log('applData:' , applData);
                    setApplication((prevState) => ({
                        ...prevState,
                        applId: applData.id,
                        applType: applData.applType,
                        applTypeDescr: applData.applTypeDescr,
                        purpose: applData.purpose,
                        purposeDescr: applData.purposeDescr,
                        isFeeRequired: applData.isFeeRequired,
                        feeAmount:applData.feeAmount,
                        feePaid:applData.feePaid,
                        paymentDate: applData.paymentDate,
                        paymentMode: applData.paymentMode,
                        paymentModeDescr: applData.paymentModeDescr,
                        status: applData.status,
                        statusDescr: applData.statusDescr,
                        notifyViaEmail: applData.notifyViaEmail,
                        certificateIssued: applData.certificateIssued,
                        certificateIssueDate: applData.certificateIssueDate,
                        applDocuments: applData.applDocuments,
                        certificateList: applData.certificateList,
                    }));
                });
            }
        }
        initializeApplicationDetails();
    }, []);

    
    function handleSubmit(event: any) {
        event.preventDefault();
        handleSaveMsgOpen('Confirm', 'Do you want to proceed submitting this application?');
    }

    function confirmSave() {
        console.log('confirmSave: ', application);
        saveApplicationDetails();
    }

    function redirectToDashboard() {
        handleSuccessMsgClose();
        router.push('/dashboard');
    }

    async function saveApplicationDetails() {
        const url = isUpdate 
            ? `http://localhost:8081/api/v1/application/update/${applId}` 
            : `http://localhost:8081/api/v1/application/create`;
        const result = await fetch(url, {
            method: isUpdate ? 'PUT' : 'POST',
            body: JSON.stringify(application),
            headers: {
                'Content-type': 'application/json',
                // 'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        if (result.ok) {
            handleSaveMsgClose();
            handleSuccessMsgOpen('Success', isUpdate ? 'Application updated!' : 'Application submitted!');
        }
    }

    function formatDateFieldValue(fieldName: any, newValue: any) {
        const dateFieldEl: HTMLElement | null = document.getElementsByName(fieldName)[0];
        if (dateFieldEl && newValue) {
            dateFieldEl.value = dayjs(newValue).format('DD/MM/YYYY');
        }
        setApplication((prevState) => ({
            ...prevState,
            [fieldName]: newValue
        }));
    }

    function cancelApplication() {
        router.push('/dashboard');
    }

    return (
        <ThemeProvider theme={theme}>
            <Header />
            <Container component="main" maxWidth="md">
                <Box
                    sx={{
                        marginTop: 6,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography component="h1" variant="h4" sx={{ margin: '20px 0 10px' }}>
                        { isUpdate ? 'Edit' : 'Submit New'} Application
                    </Typography>
                    
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    
                    {isUpdate && (
                        <TextField
                            type="number"
                            margin="normal"
                            fullWidth
                            disabled
                            id="applId"
                            label="Application ID"
                            name="applId"
                            value={application.applId}
                        />
                    )}

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="applType-label">Application Type</InputLabel>
                        <Select
                            labelId="applType-label"
                            id="applType-select"
                            name="applType"
                            disabled={isUpdate}
                            value={application.applType}
                            onChange={(e) => { setApplicationType(e.target.name, e.target.value) }}
                            label="Application Type"
                        >
                              {applTypeList.map((option) => (
                                <MenuItem key={option.code} value={option.code}>{option.codeDescription}</MenuItem>    
                            ))}  
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="purpose-label">Purpose</InputLabel>
                        <Select
                            labelId="purpose-label"
                            id="purpose-select"
                            name="purpose"
                            value={application.purpose}
                            onChange={(e) => { setApplicationState(e.target.name, e.target.value) }}
                            label="Purpose"
                        >
                            {purposeList.map((option) => (
                                <MenuItem key={option.code} value={option.code}>{option.codeDescription}</MenuItem>    
                            ))}
                        </Select>
                    </FormControl>

                    {isUpdate && (
                        <TextField
                            type="number"
                            margin="normal"
                            fullWidth
                            disabled
                            id="status"
                            label="Status"
                            name="status"
                            value={application.statusDescr}
                        />
                    )}

                    <Typography component="h1" variant="h6" sx={{ margin: '20px 0 10px' }}>
                        Payment Details
                    </Typography>

                    <FormControlLabel 
                        control={
                        <Checkbox 
                            id="isFeeRequired" 
                            name="isFeeRequired"
                            disabled
                            checked={application.isFeeRequired}
                            onChange={(e) => { setApplicationState(e.target.name, e.target.value) }}
                        />}
                        label="Is Fee Required?" 
                    />

                    <TextField
                        type="number"
                        margin="normal"
                        fullWidth
                        disabled
                        id="feeAmount"
                        label="Fee Amount"
                        name="feeAmount"
                        value={application.feeAmount}
                    />

                    <FormControl fullWidth margin="normal">
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="paymentMode"
                            defaultValue="OTC"
                        >
                            <FormControlLabel value="OTC" control={<Radio />} label="Over-the-Counter" />
                            <FormControlLabel value="GC" control={<Radio />} label="GCash" disabled />
                            <FormControlLabel value="C" control={<Radio />} label="Credit/Debit Card" disabled />
                            <FormControlLabel control={<Button disabled type="button" variant="contained" sx={{ marginLeft: '40px' }}>Pay</Button>} label="" />
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        type="number"
                        margin="normal"
                        fullWidth
                        disabled
                        id="feePaid"
                        label="Fee Paid"
                        name="feePaid"
                        value={application.feePaid}
                    />

                    <FormControl fullWidth margin="normal">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker disabled format='DD/MM/YYYY' label="Payment Date" value={dayjs(application.paymentDate)} />
                            <input type="hidden" id="paymentDate" name="paymentDate" />
                        </LocalizationProvider>
                    </FormControl>
                   
                    <ApplicationDocumentsGrid applId={applId} />

                    <FormControlLabel 
                        control={
                        <Checkbox 
                            id="consent" 
                            name="consent"
                            checked={application.consent}
                            onChange={(e) => { setApplicationState(e.target.name, e.target.checked) }}
                        />}
                        label="I hereby blah blah blah blah blah blah blah ....." 
                    />

                    <Box sx={{ width: '100%', margin: '20px auto' }}>
                        <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
                            <Button variant="contained" type='submit' disabled={!application.consent}>
                            {isUpdate ? 'Update' : 'Submit'} Application
                            </Button>
                            <Button variant="contained" type='button' onClick={cancelApplication}>
                                Cancel
                            </Button>
                        </Stack>
                    </Box>
                    </Box>
                </Box>
            </Container>
            <ConfirmationModal
                open={saveMsgOpen}
                handleClose={handleSaveMsgClose}
                action={msgAction} 
                message={msgDetail}
                okAction={null}
                yesAction={confirmSave}
                noAction={handleSaveMsgClose}
            />
            <ConfirmationModal
                open={successMsgOpen}
                handleClose={handleSuccessMsgClose}
                action={msgAction} 
                message={msgDetail}
                okAction={redirectToDashboard}
                yesAction={null}
                noAction={null}
            />
        </ThemeProvider>
    )
}