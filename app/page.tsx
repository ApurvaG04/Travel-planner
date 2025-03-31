
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Searchbar from './component/searchbar';
import { JSX } from 'react';

export default function Home(): JSX.Element{
  
  return (
    <Container maxWidth={false} sx={{ backgroundImage: 'url(/background.png)', height: '94vh', width: 'inherit', isplay: 'flex', py: 10, px: 100}}>
      <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.3)', border: '4px solid white', width: 'md',  height: '80%', borderRadius: 11, p: 10, mx: 10}}>
          <Searchbar color={'white'} contrast={'#cfd8dc'} />
          <Typography variant='h1' sx={{my: 7, mx:15, color: 'white', textAlign: 'center'}}>
            Adventure Awaits: 
            Plan Your Perfect Trip
          </Typography>
          <Typography variant='h4' sx={{ color: 'white', textAlign: 'center'}}>
            Your journey starts here
          </Typography>
      </Box>
    </Container>
  );
}

