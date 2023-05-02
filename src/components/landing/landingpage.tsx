import * as React from 'react';
import OverviewSection from './overview';
import ServiceSection from './services';
import { Box } from '@mui/material';

const services = ['Residency', 'Indigency', 'Clearance'];

const LandingPage = () => {
    return (
        <>
            <OverviewSection />
            <Box
                sx={{
                    margin: '0 25%', 
                    display: 'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'center', 
                    border: '1px solid #000', 
                    padding: '2em'
                }}
            >
                {
                    services.map((name, index) => (
                        <ServiceSection key={index} filename={index + 1} name={name} />
                    ))
                }
            </Box>
        </>
    )
}

export default LandingPage;