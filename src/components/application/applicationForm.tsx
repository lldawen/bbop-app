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
import ConfirmationModal, { showMessageBox } from '../common/confirmationModal';
import { Checkbox, Stack, ThemeProvider } from '@mui/material';
import { theme } from '@/pages';
import ApplicationDocumentsGrid from './applicationDocumentGrid';
import { closeMessagePrompt } from '../common/confirmationModal';
import { closeMessageBox } from '../common/confirmationModal';
import { getDropdownOptions } from '../common/util';
import { Certificate } from 'crypto';
import CertificateMenu from '../common/certificateMenu';

export default function ApplicationForm({ applId, isAdmin }) {

    const isUpdate = applId ? true : false;
    const applicantId = localStorage.getItem('userId');

    const [application, setApplication] = useState({
        applId: '',
        applicantId: localStorage.getItem('userId'),
        applType: '',
        applTypeDescr: '',
        purpose: '',
        purposeDescr: '',
        isFeeRequired: false,
        feeAmount: 0,
        feePaid: 0,
        paymentDate: '',
        paymentMode: 'OTC',
        paymentModeDescr: '',
        notifyViaEmail: false,
        certificateIssued: false,
        certificateIssueDate: '',
        applDocuments: [],
        certificateList: [],
        consent: false,
        status: '',
        statusDescr: '',
        isPaymentComplete: false,
    });

    const [applTypeList, setApplTypeList] = useState([]);
    const [purposeList, setPurposeList] = useState([]);
    const [paymentModeList, setPaymentModeList] = useState([]);

    const today = dayjs();
    const todayStartOfTheDay = today.startOf('day');

    const router = useRouter();

    const [messageBox, setMessageBox] = React.useState({
        open: false,
        action: '',
        message: '',
        okAction: undefined as unknown,
        yesAction: undefined as unknown,
        noAction: undefined as unknown,
    });
    
    function hasPendingPayment(feeAmt, feePaid) {
        return feeAmt == 0 || (feeAmt - feePaid <= 0);
    }

    function isReadOnly(status) {
        return status == 'A' || status == 'R' || status == 'C' || status == 'W';
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
        const feeAmountVal = newValue == 'C' ? 30.00 : (newValue == 'R' ? 50.00 : 0.00);
        setApplicationState(fieldName, newValue);
        setApplicationState('isFeeRequired', isFeeRequiredVal);
        setApplicationState('feeAmount', feeAmountVal);
        getDropdownOptions(`APPL_PURPOSE_${newValue}`, setPurposeList);
    }
    
    React.useEffect(() => {
        getDropdownOptions('APPL_TYPE', setApplTypeList);
        getDropdownOptions('PAYMENT_MODE', setPaymentModeList);
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
                    getDropdownOptions(`APPL_PURPOSE_${applData.applType}`, setPurposeList);
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
                        notifyViaEmail: applData.notifyViaEmail,
                        certificateIssued: applData.certificateIssued,
                        certificateIssueDate: applData.certificateIssueDate,
                        applDocuments: applData.applDocuments,
                        certificateList: applData.certificateList,
                        status: applData.status,
                        statusDescr: applData.statusDescr,
                        isPaymentComplete: hasPendingPayment(applData.feeAmount, applData.feePaid),
                    }));
                });
            }
        }
        initializeApplicationDetails();
    }, []);

    
    function saveApplication(event: any) {
        event.preventDefault();
        showMessageBox({
            action: 'Confirmation',
            message: 'Do you want to save this application?',
            yesAction: saveApplicationDetails,
            noAction: () => closeMessagePrompt(setMessageBox),
        }, setMessageBox);
    }

    async function saveApplicationDetails() {
        const response = await fetch(`http://localhost:8081/api/v1/application/create`, {
            method: 'POST',
            body: JSON.stringify(application),
            headers: {
                'Content-type': 'application/json',
                // 'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        if (response.ok) {
            const json = await response.json();
            closeMessageBox({
                action: 'Success', 
                message: 'Application has been saved!',
            }, setMessageBox, () => router.push(`/dashboard/application/get/${json.data.id}`));
        }
    }

    function submitApplication() {
        showMessageBox({
            action: 'Confirmation',
            message: 'Do you want to submit this application?',
            yesAction: confirmSubmitApplication,
            noAction: () => closeMessagePrompt(setMessageBox),
        }, setMessageBox);
    }

    async function confirmSubmitApplication() {
        const response = await fetch(`http://localhost:8081/api/v1/application/submit/${applId}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                // 'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        if (response.ok) {
            closeMessageBox({
                action: 'Success', 
                message: 'Application has been submitted!',
            }, setMessageBox, () => router.push(`/dashboard`));
        }
    }

    function savePaymentDetails() {
        showMessageBox({
            action: 'Confirmation',
            message: 'Do you want to save the payment details?',
            yesAction: confirmSavePaymentDetails,
            noAction: () => closeMessagePrompt(setMessageBox),
        }, setMessageBox);
    }

    async function confirmSavePaymentDetails() {
        const response = await fetch(`http://localhost:8081/api/v1/admin/application/savePayment/${applId}`, {
            method: 'PUT',
            body: JSON.stringify(application),
            headers: {
                'Content-type': 'application/json',
                // 'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        if (response.ok) {
            closeMessageBox({
                action: 'Success', 
                message: 'Payment details have been successfully saved!',
            }, setMessageBox, updatePaymentState);
        }
    }

    function updatePaymentState() {
        console.log('prevState.feeAmount - prevState.feePaid', application.feeAmount - application.feePaid);
        setApplication(prevState => ({
            ...prevState,
            isPaymentComplete: prevState.feeAmount == 0 || (prevState.feeAmount - prevState.feePaid <= 0)
        }));
    }

    function approveRejectApplication(action) {
        showMessageBox({
            action: 'Confirmation',
            message: `Do you want to ${action} this application?`,
            yesAction: () => confirmApproveRejectApplication(action),
            noAction: () => closeMessagePrompt(setMessageBox),
        }, setMessageBox);
    }

    async function confirmApproveRejectApplication(action) {
        const response = await fetch(`http://localhost:8081/api/v1/admin/application/${action}/${applId}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                // 'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        if (response.ok) {
            closeMessageBox({
                action: 'Success', 
                message: 'Application has been ' + (action == 'approve' ? 'approved' : 'rejected') + '!',
            }, setMessageBox, () => router.reload(`/admin/dashboard/application/${applId}`));
        }
    }

    function formatDateFieldValue(fieldName: any, newValue: any) {
        const dateFieldEl: HTMLElement | null = document.getElementsByName(fieldName)[0];
        if (dateFieldEl && newValue) {
            dateFieldEl.value = dayjs(newValue).format('DD/MM/YYYY');
        }
        setApplication(fieldName, dateFieldEl.value);
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
                        { isUpdate ? 'Application Details' : 'Submit New Application'}
                    </Typography>
                    
                    <Box component="form" onSubmit={saveApplication} noValidate sx={{ mt: 1 }} encType='multipart/form-data'>
                    
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
                            disabled={isUpdate}
                            value={application.purpose}
                            onChange={(e) => { setApplicationState(e.target.name, e.target.value) }}
                            label="Purpose"
                        >
                            {purposeList.map((option) => (
                                <MenuItem key={option.code} value={option.code}>{option.codeDescription}</MenuItem>    
                            ))}
                        </Select>
                    </FormControl>

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
                            name={application.paymentMode}
                            defaultValue="OTC"
                            onChange={(e) => { setApplicationState(e.target.name, e.target.value) }}
                        >
                            {paymentModeList.map((option) => (
                                <FormControlLabel disabled={option.code != 'OTC'} key={option.code} value={option.code} control={<Radio />} label={option.codeDescription} />
                            ))}
                            {!isAdmin && <FormControlLabel control={<Button disabled type="button" variant="contained" sx={{ marginLeft: '40px' }}>Pay</Button>} label="" />}
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        type="number"
                        margin="normal"
                        fullWidth
                        disabled={!isAdmin || isReadOnly(application.status) || application.feeAmount == 0}
                        id="feePaid"
                        label="Fee Paid"
                        name="feePaid"
                        value={application.feePaid}
                        onChange={(e) => { setApplicationState(e.target.name, e.target.value) }}
                    />

                        <FormControl fullWidth margin="normal">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker 
                                    disabled={!isAdmin || isReadOnly(application.status) || application.feeAmount == 0} 
                                    format='DD/MM/YYYY' label="Payment Date" 
                                    value={!isUpdate ? todayStartOfTheDay : dayjs(application.paymentDate).format('DD/MM/YYYY')} 
                                    onChange={(newValue) => { formatDateFieldValue('paymentDate', newValue); }} 
                                />
                                <input type="hidden" id="paymentDate" name="paymentDate" />
                            </LocalizationProvider>
                        </FormControl>
                   
                    {(!isAdmin && !isUpdate) && (
                        <Box sx={{ width: '100%', margin: '20px auto' }}>
                            <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
                                <Button variant="contained" type='submit'>
                                    Save
                                </Button>
                                <Button variant="contained" type='button' onClick={cancelApplication}>
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    )}

                    {isAdmin && !isReadOnly(application.status) && application.feeAmount > 0 && (
                        <>
                            <Box sx={{ width: '100%', margin: '20px auto' }}>
                                <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
                                    <Button variant="contained" type='button' onClick={savePaymentDetails}>
                                        Save Payment
                                    </Button>
                                </Stack>
                            </Box>
                        </>
                    )}

                    {(isAdmin || isUpdate) && (
                    <ApplicationDocumentsGrid applId={applId} isAdmin={isAdmin} />
                    )}

                    {(!isAdmin && isUpdate) && (
                    <>
                        <FormControlLabel sx={{ mt: 2, mb: 2 }}
                            control={
                            <Checkbox 
                                id="consent" 
                                name="consent"
                                checked={application.consent}
                                onChange={(e) => { setApplicationState(e.target.name, e.target.checked) }}
                            />}
                            label="I hereby confirm that the information provided in this application is true and accurate to the best of my knowledge. I understand that any false or misleading information may result in the rejection of my application or the revocation of the certificate granted." 
                        />

                        <Box sx={{ width: '100%', margin: '20px auto' }}>
                            <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
                                <Button variant="contained" type='button' onClick={submitApplication} disabled={!application.consent}>
                                    Submit Application
                                </Button>
                                <Button variant="contained" type='button' onClick={cancelApplication}>
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    </>
                    )}
                    
                    {isAdmin &&  (
                        <Box sx={{ width: '100%', margin: '20px auto' }}>
                            <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
                                {application.status == 'O' && (
                                    <>
                                        <Button variant="contained" type='button' onClick={() => approveRejectApplication('approve')} disabled={!application.isPaymentComplete}>
                                            Approve
                                        </Button>
                                        <Button variant="contained" type='button' onClick={() => approveRejectApplication('reject')}>
                                            Reject
                                        </Button>
                                    </>
                                )}
                                {application.status == 'A' && <CertificateMenu applId={applId} />}
                                <Button variant="contained" type='button' onClick={() => router.push('/admin/dashboard')}>
                                    Back
                                </Button>
                            </Stack>
                        </Box>
                    )}
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