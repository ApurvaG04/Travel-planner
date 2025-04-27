'use client';

import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { JSX, useEffect, useState } from 'react';
import theme from './theme';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Container } from '@mui/material';
import { useSearchState } from './searchcontext';
import { User } from '@supabase/supabase-js';
import { createClient } from '../../utils/superbase/client';
import PlaceAutocomplete from './placeautocomplete';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||'';

export default function Searchbar({color, contrast}: {color: string, contrast: string}): JSX.Element{
  const {checkIn, checkOut, guests, updateFromLocation, updateToLocation, updateCheckIn, updateCheckOut, updateGuests} = useSearchState();
  const [toPlace, setToPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [fromPlace, setFromPlace] = useState<google.maps.places.PlaceResult | null>(null);
  // const [localLocation, setLocalLocation] = useState<string|''>(place?.name || 'Unknown Place');
  const [localCheckIn, setLocalCheckIn] = useState<Date | null>(checkIn);
  const [localCheckOut, setLocalCheckOut] = useState<Date | null>(checkOut);
  const [localGuests, setLocalGuests] = useState<number>(guests);
   const [user, setUser] = useState<User|null>(null);   
  const supabase = createClient();


  useEffect(() => { 
      const getUser = async () => {  // Get user from session
          const {data: { user }, } = await supabase.auth.getUser();
          if (user) {
              setUser(user);
          }
      }; 
      getUser(); 
  },[supabase.auth]);

  const incrementGuests = () => {
    setLocalGuests(guests + 1);
    if (user) {
      updateGuests(localGuests);
    }    
  };

  const decrementGuests = () => {
    setLocalGuests(guests - 1);
    if (user) {
      updateGuests(localGuests);
    }
  };

  const handleWeather = async () => {
    try {
      const weatherResult = await fetch('api/weatherresult', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify ({ toPlace }),
      });
      
      if (weatherResult.status !== 200) {
          throw new Error(`HTTP error! Status: ${weatherResult.status}`);
      }
    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleSearchClick = async () => {
    console.log(location, checkIn, checkOut, guests);
    // setLocalLocation(place?.formatted_address || 'Unknown Place');
    updateFromLocation(fromPlace);
    updateToLocation(toPlace);
    updateCheckIn(localCheckIn);
    updateCheckOut(localCheckOut);

    handleWeather();
    window.location.href = '/searchresult'
    // if (user) {
    //   window.location.href = '/searchresult';
    // } else {
    //   window.location.href = '/auth/signin';
    // }     
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>            
        <Container maxWidth='xl'>
          <Grid2 display={'flex'} gap={2}>
            <Box  sx={{ flex:1.5, height: 80, bgcolor: color, border: '2px solid black', borderRadius: 10, minWidth: '800px'}}>
              <Grid2 container spacing={1} >
                <Grid2 size={{ xs: 6, sm: 1, md: 2 }} sx={{ display:'flex', gap: 1, my: 3, ml: 4}}>
                    <Typography>From:</Typography><PlaceAutocomplete onPlaceSelect={setFromPlace} apiKey={GOOGLE_MAPS_API_KEY} />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 1, md: 2 }}  sx={{ display:'flex', gap: 1, my: 3, ml: 2}} >
                  <Typography>To:</Typography><PlaceAutocomplete onPlaceSelect={setToPlace} apiKey={GOOGLE_MAPS_API_KEY} />
                </Grid2>
                <Box sx={{color: contrast, alignSelf:'center', width: 0, height: 50, border: `1px solid ${contrast}`, mx: 1 }}></Box>                    
                <Grid2 size={{ xs: 6, sm: 1, md: 2 }}  >
                  <DatePicker label="Check-in" value={localCheckIn} onChange={(newValue: Date | null) => {setLocalCheckIn(newValue);}}
                    slots={{ textField: (props) => <TextField {...props} variant="standard" />, }}
                    slotProps={{ textField: { InputProps: { disableUnderline: true }, sx: {my: 2 }, required: true }, }}  />
                </Grid2>
                <Box sx={{color: contrast, alignSelf:'center', width: 0, height: 50, border: `1px solid ${contrast}`, mx: 1 }}></Box>
                <Grid2 size={{ xs: 6, sm: 1, md: 2 }} >
                  <DatePicker label="Check-out" value={localCheckOut} onChange={(newValue: Date | null) => {setLocalCheckOut(newValue);}}
                      slots={{ textField: (props) => <TextField {...props} variant="standard" />, }}
                      slotProps={{ textField: { InputProps: { disableUnderline: true }, sx: { my: 2 }, required: true }, }} />
                </Grid2>
                <Box sx={{color: contrast, alignSelf:'center', width: 0, height: 50, border: `1px solid ${contrast}`, mx: 1 }}></Box>
                <Grid2 size={{ xs: 6, sm: 1, md: 2 }} sx={{ml: 1}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 2, flex: 1, m: 3, justifyContent: 'center', }}>
                    <Typography>Guests:</Typography>
                    <IconButton onClick={decrementGuests} sx={{ border: '1px solid #ddd', borderRadius: '50%' }}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ width: '30px', textAlign: 'center', fontSize: '1rem', }} > {guests} </Typography>
                    <IconButton onClick={incrementGuests} sx={{ border: '1px solid #ddd', borderRadius: '50%' }}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Grid2>
              </Grid2>
            </Box>             
            <Button sx={{flex:0.3, bgcolor: 'primary.main', borderRadius: 10, textTransform: 'none'}} onClick={handleSearchClick}>
              <Typography variant='body1' color='white' fontSize={20}>  Search </Typography>
            </Button>
          </Grid2>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}