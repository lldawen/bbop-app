import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const ServiceSection = ({ name, filename }) => {
  let intro = '';
  if (name == 'Clearance') {
    intro = 'Streamline your barangay clearance application process with our convenient online portal. Say goodbye to long queues and paperwork as you obtain your barangay clearance hassle-free and in just a few clicks.';
  } else if (name == 'Residency') {
    intro = 'Need a Certificate of Residency? Look no further! Our online portal simplifies the application process, allowing you to easily obtain your Certificate of Residency from the comfort of your own home. Save time and effort with our user-friendly platform.';
  } else if (name == 'Indigency') {
    intro = 'In need of a Certificate of Indigency? Our online portal revolutionizes the way you apply for this important document. Experience a seamless and efficient process, ensuring timely issuance of your Certificate of Indigency. Apply online today and get the support you deserve.';
  }

  return (
    <Card sx={{ maxWidth: 340, margin: '5px auto' }}>
      <CardMedia
        component="img"
        alt="icon"
        image={ `/images/${filename}.jpg` }
      />
      <CardContent>
        <Typography gutterBottom variant="h3" component="div">
          {name}
        </Typography>
        <Typography variant="h5" color="text.secondary">
          {intro}
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Apply</Button>
      </CardActions> */}
    </Card>
  );
}

export default ServiceSection;