import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    // height: 60,
    // lineHeight: '60px',
}));

export default function OverviewSection() {
  return (
            <Box
              sx={{
                bgcolor: 'background.default',                
                height: 400,
                margin: '0 auto',
              }}
            >
                <Item>
                  <Typography gutterBottom variant="h5" component="div">
                  Barangay Bagongpook Online Portal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over 6,000
                  species, ranging across all continents except Antarctica
                </Typography>
                </Item>
            </Box>
  );
}