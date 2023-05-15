import { TextField } from "@mui/material";

export default function ApplicantForm({ applicant }) {
    return (
        <>
            <TextField
                type="text"
                margin="normal"
                fullWidth
                disabled
                id="fullName"
                label="Full Name"
                name="fullName"
                value={applicant.fullName}
                InputLabelProps={{ shrink: true }}
            />
            <div>
                <TextField
                    type="text"
                    margin="normal"
                    sx={{ marginRight: '15px' }}
                    disabled
                    id="age"
                    label="Age"
                    name="age"
                    value={applicant.age}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    type="text"
                    margin="normal"
                    sx={{ minWidth: '73%' }}
                    disabled
                    id="contactNo"
                    label="Contact No"
                    name="contactNo"
                    value={applicant.contactNo}
                    InputLabelProps={{ shrink: true }}
                />
            </div>
            <TextField
                type="text"
                margin="normal"
                fullWidth
                disabled
                id="address"
                label="Address"
                name="address"
                value={applicant.address}
                InputLabelProps={{ shrink: true }}
            />
        </>
    );
}