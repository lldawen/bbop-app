import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  height: 60,
  lineHeight: '30px',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  width: '60%',
  margin: '50px 0 50px 30px',
  color: '#fff',
  textShadow: '5px 2px 3px #000, 5px 2px 3px #000',
  flexGrow: 1,
  textAlignLast: 'center',
  position: 'absolute',
}));

export default function OverviewSection() {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        backgroundImage: `url(/images/bg.jpg)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        maxWidth: 'auto',
        height: '600px',
        margin: '20px auto',
        position: 'relative'
      }}
    >
      <Item elevation={0}>
          <h1>Bagong Pook is a barangay in the city of Lipa, in the province of Batangas.</h1>
          <h1>Its population as determined by the 2020 Census was 7,081.</h1>
          <h1>This represented 1.90% of the total population of Lipa.</h1>
      </Item>
    </Box>
  );
}