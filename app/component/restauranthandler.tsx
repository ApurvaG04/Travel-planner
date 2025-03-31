import { useEffect } from 'react';
import { useSearchState } from './searchcontext';
import Box from '@mui/material/Box';
import { Button, Grid2, Link, List, ListItem, Typography } from '@mui/material';
import { useItineraryState } from './tripcontext';
import Image from 'next/image';

// interface CustomPlaceResult extends google.maps.places.PlaceResult {
//     imageUrl?: string | null;
//     isOpen?: boolean | null;
// }

export default function Restauranthandler() {

    const { toLocation, listOfRestaurants }  = useSearchState();
    const {itineraries, updateItineraries} = useItineraryState();

    useEffect(() => {
        console.log('Updated listOfRestaurants:', listOfRestaurants);
    }, [listOfRestaurants]);

    const saveRestaurants = (newRestaurant: string) => {
        const location = toLocation?.name || '';
        const existingAttractions: string[] = itineraries[location]?.restaurants || [];
        if (!existingAttractions.includes(newRestaurant)) {
        updateItineraries(location, {
            ...itineraries.location, 
            restaurants: [...(itineraries[location]?.restaurants || []), newRestaurant]
        });
    }
    };

    
    return (       
        <Box >
            <Typography variant='h3'>Food Places</Typography>
            <Box sx={{ width: '100%', border: '2px solid black', borderRadius: 10, my: 5,}}>           
                {listOfRestaurants.slice(1, listOfRestaurants.length - 1).map((restaurant) => (
                    <Box key={restaurant.place_id} sx={{ mx: 6}}>
                        <Link href={`https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`} underline="none" >
                            <Typography variant='h6' sx={{my:2, py:3}}>{restaurant.name}</Typography> 
                        </Link>                       
                        <Grid2  sx={{display: 'flex', justifyContent: 'space-between'}}>                                                                 
                            <Box>
                                <Image src={`${restaurant?.photos?.[0].getUrl()}`} alt="" height={200} width={200}/>
                            </Box>
                            <Box>
                                <List>
                                    <ListItem>Address: {restaurant.vicinity}</ListItem>
                                    <ListItem>Ratings: {restaurant.rating}</ListItem>
                                    <ListItem>Total User Ratings: {restaurant.user_ratings_total}</ListItem>
                                </List>
                            </Box>
                            <Button sx={{alignSelf: 'end'}} onClick={()=>saveRestaurants(restaurant.name || '')}>Save</Button>
                        </Grid2>    
                        <Box sx={{alignSelf:'center', width: '100%', height: 0, border: '1px solid grey', my: 5 }}></Box>                
                    </Box>
                ))}
            </Box>
        </Box>
    ); 
}