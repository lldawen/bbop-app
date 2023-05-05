import * as React from 'react';
import OverviewSection from './overview';
import ServiceSection from './services';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Divider, Typography } from '@mui/material';
import shadows from '@mui/material/styles/shadows';

const services = ['Residency', 'Indigency', 'Clearance'];

const LandingPage = () => {
    return (
        <Container maxWidth="xl">
            <OverviewSection />
            <Box
                sx={{
                    width: '100%',
                    justifyContent: 'center', 
                    backgroundColor: '#ffba8f',
                    padding: '2em',
                    display: 'flex',
                    flexWrap: 'wrap',
                }}
            >
                {
                    services.map((name, index) => (
                        <ServiceSection key={index} filename={index + 1} name={name} />
                    ))
                }
            </Box>
        </Container>
    )
}

export default LandingPage;