import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useItineraryState } from './tripcontext';
import { useState } from 'react';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

export default function Itinerary() {
    const [open, setOpen] = useState<{[key: string]: boolean}>({});
    const {itineraries, deleteItineraries} = useItineraryState();

    const handleClick = (loc: string) => {
        setOpen((prev) => ({
            ...prev,
            [loc]: !prev[loc], // Toggle only the clicked item
        }));
    };

    const handleDelete = (loc: string) => {
        delete open[loc];
        deleteItineraries(loc);
    };

    return (
        <Box sx={{  display: 'flex', flexDirection:'column', borderRadius: 10, gap: 1, my: 4, px: 4, py: 5, }}>                
            {Object.entries(itineraries).map(([key, value]) => (
                <Box key={key} sx={{display: 'flex'}}>
                    <List  sx={{flex: 1.5, px:5, gap: 2}}>
                        
                        <ListItemButton onClick={()=>handleClick(key)} sx={{display: 'flex',gap:5, bgcolor: '#e0e0e0'}} >
                            <ListItemText primary={
                                <Typography variant="h6" color="primary" fontWeight="bold">{key}</Typography>
                            } />
                            {open[key] ? <ExpandLess /> : <ExpandMore />}                           
                        </ListItemButton>                                         
                        <Collapse in={open[key]} timeout='auto' unmountOnExit sx={{mt: 1, ml: 6}}>    
                            <Box sx={{border: '2px solid black', borderRadius: 10, display: 'flex', flexDirection: 'column',  p: 5}}>                                   
                                <ListItemText primary={
                                    <Typography variant="body1" color="primary" fontWeight="bold">Flights: </Typography>
                                } />
                                <Grid2 sx={{mx: 15}}>                                   
                                    {(value.flight.onewayFlight?.itineraries[0] && value.flight.onewayFlight?.itineraries[0].segments.length > 1)?(
                                        <>
                                        <ListItemText 
                                        primary={`Oneway: ${value.flight.onewayFlight?.itineraries[0].segments[0].departure.iataCode} - 
                                        ${value.flight.onewayFlight?.itineraries[0].segments[1].arrival.iataCode}`}/>
                                        <ListItemText 
                                        primary={`Dates: ${value.flight.onewayFlight?.itineraries[0].segments[0].departure.at.slice(0, 10)} - 
                                        ${value.flight.onewayFlight?.itineraries[0].segments[1].arrival.at.slice(0, 10)}`}/>
                                        </>
                                    ):(
                                        <>
                                        <ListItemText 
                                        primary={`Oneway: ${value.flight.onewayFlight?.itineraries[0].segments[0].departure.iataCode} - 
                                        ${value.flight.onewayFlight?.itineraries[0].segments[0].arrival.iataCode}`}/>
                                            <ListItemText 
                                        primary={`Dates: ${value.flight.onewayFlight?.itineraries  [0].segments[0].departure.at.slice(0, 10)} - 
                                        ${value.flight.onewayFlight?.itineraries[0].segments[0].arrival.at.slice(0, 10)}`}/>
                                        </>
                                    )}
                                    {(value.flight.returnFlight?.itineraries[0] && value.flight.returnFlight?.itineraries[0].segments.length > 1)?(
                                    <>
                                        <ListItemText 
                                        primary={`Return: ${value.flight.returnFlight?.itineraries[0].segments[0].departure.iataCode} - 
                                        ${value.flight.returnFlight?.itineraries[0].segments[1].arrival.iataCode}`}/>
                                        <ListItemText 
                                        primary={`Dates: ${value.flight.returnFlight?.itineraries[0].segments[0].departure.at.slice(0, 10)} - 
                                        ${value.flight.returnFlight?.itineraries[0].segments[1].arrival.at.slice(0, 10)}`}/>
                                    </>
                                    ):(
                                    <>
                                        <ListItemText 
                                        primary={`Return: ${value.flight.returnFlight?.itineraries[0].segments[0].departure.iataCode} - 
                                        ${value.flight.returnFlight?.itineraries[0].segments[0].arrival.iataCode}`}/>
                                        <ListItemText 
                                        primary={`Dates: ${value.flight.returnFlight?.itineraries[0].segments[0].departure.at.slice(0, 10)} - 
                                        ${value.flight.returnFlight?.itineraries[0].segments[0].arrival.at.slice(0, 10)}`}/>
                                    </>
                                    )}
                                </Grid2>
                                <ListItemText primary={
                                    <Typography variant="body1" color="primary" fontWeight="bold">Hotels: </Typography>
                                } />
                                <List sx={{mx: 15}}>
                                    {value.hotel.map((place, index)=>(
                                        <ListItemText key={index} primary={`${place.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}></ListItemText>
                                    ))}
                                </List>
                                <ListItemText primary={
                                    <Typography variant="body1" color="primary" fontWeight="bold">Restaurants: </Typography>
                                } />
                                <List sx={{mx: 15}}>
                                    {value.restaurants.map((place, index)=>(
                                        <ListItemText key={index} primary={`${place}`}></ListItemText>
                                    ))}
                                </List>
                                <ListItemText primary={
                                    <Typography variant="body1" color="primary" fontWeight="bold">Attractions: </Typography>
                                } />
                                <List sx={{mx: 15}}>
                                    {value.attractions.map((place, index)=>(
                                        <ListItemText key={index} primary={`${place}`}></ListItemText>
                                    ))}
                                </List>
                            </Box>                       
                        </Collapse>
                        
                            
                    </List> 
                    <Button onClick={()=>handleDelete(key)}>Delete</Button> 
                </Box>
            ))}                         
        </Box> 
    );
}