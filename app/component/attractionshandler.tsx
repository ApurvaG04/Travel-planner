import { useSearchState } from './searchcontext';
import Box from '@mui/material/Box';
import { Button, Grid2, Link, List, ListItem, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useItineraryState } from './tripcontext';
import Image from 'next/image';

export default function Restauranthandler() {

    const {toLocation, listOfAttractions, listOfRestaurants }  = useSearchState();
    const {itineraries, updateItineraries} = useItineraryState();

    useEffect(() => {
        console.log('Updated listOfAttractions:', listOfAttractions);
        console.log(itineraries);
    }, [itineraries, listOfAttractions]);

    const savedAttractions = (attraction: string) => {
        const location = toLocation?.name || '';
        const existingAttractions: string[] = itineraries[location]?.attractions || [];
        if (!existingAttractions.includes(attraction)) {
            updateItineraries(location, {
                ...itineraries.location,
                attractions: [...(itineraries[location]?.attractions || []), attraction]
            });
        }
    };
      
    return (     
        <Box >
            <Typography variant='h3'>Tourist Attractions</Typography>
            <Box sx={{ width: '100%', border: '2px solid black', borderRadius: 10, my: 5,}}>               
                {listOfAttractions.slice(1, listOfRestaurants.length - 1).map((attraction) => (
                    <Box key={attraction.place_id} sx={{mx: 6}}>
                        <Link href={`https://www.google.com/maps/place/?q=place_id:${attraction.place_id}`} underline="none" >
                            <Typography variant='h6' sx={{my:2, py:3}}>{attraction.name}</Typography> 
                        </Link> 
                        <Grid2  sx={{display: 'flex', justifyContent: 'space-between'}}>                                                                 
                            <Box>
                                {attraction.photos?( <Image src={`${attraction?.photos[0].getUrl()}`} alt="" height={200} width={200}/>):(
                                    <Image src={`${attraction?.icon}`} alt="" height={200} width={200}/>
                                )}
                                
                            </Box>
                            <Box>
                                <List>
                                    <ListItem>Address: {attraction.vicinity}</ListItem>
                                    <ListItem>Ratings: {attraction.rating}</ListItem>
                                    <ListItem>Total User Ratings: {attraction.user_ratings_total}</ListItem>
                                </List>
                            </Box>
                            <Button sx={{alignSelf: 'end'}} onClick={()=>savedAttractions(attraction?.name || '')}>Save</Button>
                        </Grid2>    
                        <Box sx={{alignSelf:'center', width: '100%', height: 0, border: '1px solid grey', my: 5 }}></Box>               
                    </Box>
                ))}
            </Box>
        </Box>
    ); 
}
