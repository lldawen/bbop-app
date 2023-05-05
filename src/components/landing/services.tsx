import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const ServiceSection = ({ name, filename }) => {
  return (
    <Card sx={{ maxWidth: 400, margin: '10px auto' }}>
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
        Lorem ipsum dolor sit amet. Quo dolores laboriosam vel eligendi quibusdam aut neque debitis. Est porro reprehenderit et consequuntur adipisci aut neque officia aut doloribus veniam et saepe impedit.
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Apply</Button>
      </CardActions> */}
    </Card>
  );
}

export default ServiceSection;