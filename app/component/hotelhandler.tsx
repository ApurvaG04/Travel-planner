'use client';

import { useSearchState } from './searchcontext';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import CircularProgress from '@mui/material/CircularProgress';
import { useItineraryState } from './tripcontext';

interface Hotel {
    available: boolean
    offers: {
        price: {total: string };
        room: {
            typeEstimated: { 
                bedType: string,
                beds: number,
                category: string
            };
        };
    }[];
}

export default function Hotelhandler() {
    const {toLocation, checkIn, checkOut} = useSearchState();
    const [hotelIds, setHotelIds] = useState<string[]>([]);
    const [hotelNames, setHotelNames] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string >('');
    const [open, setOpen] = useState<{[key: string]: boolean}>({});
    const [hotelOffers, setHotelOffers] = useState<{[key: string]: Hotel}>({});
    const {itineraries, updateItineraries} = useItineraryState();

    const handleClick = (id: string) => {
        searchHotelOffers(id);
        setOpen((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle only the clicked item
          }));
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const saveHotel = (newhotel: string) => {
        const location = toLocation?.name || '';
        const existingAttractions = itineraries[location]?.hotel || [];
        const isDuplicate = existingAttractions.some(existing => existing === newhotel);  
        if (!isDuplicate) {
            updateItineraries(location, {
                ...itineraries.location, 
                hotel: [...(itineraries[location]?.hotel || []), newhotel]
            });
        }
    };

    useEffect(()=>{
        const searchHotelList = async () => {
            setLoading(true);
            setError('');          
            try {
                const response = await fetch(`/api/hotelresult/hotellist?keyword=${toLocation?.name}`);
                const data = await response.json();   
                if (response.ok) {
                    setHotelIds(data.hotelIdList);
                    setHotelNames(data.hotelNameList);
                } else {
                    setError(data.error || 'Failed to fetch hotel Id');
                }
            } catch (err) {
                if(err) {
                    setError('Something went wrong');
                }
            } finally {
                setLoading(false);
            }
        };
        searchHotelList();
    }, [checkIn, checkOut, toLocation]);

    const searchHotelOffers = async (id: string) => {
        try {
            const response = await fetch(`/api/hotelresult?hotelId='MCLONGHM'&checkIn=${checkIn?formatDate(checkIn):null}&checkOut=${checkOut?formatDate(checkOut):null}`);
            const data = await response.json();  
            if (response.ok) {               
                setHotelOffers(hotelOffers[id] = data.data[0]);
            } else {               
                setError(data.message);
                console.log(data);
            }
        } catch (err) {
            if(err) {
                setError(JSON.stringify(err));
            }
        } finally {
            setLoading(false);
            console.log(hotelOffers?.[hotelIds[0]]);
        }
    };

    return (
        <Box>
            <Typography variant='h4' sx={{textAlign:'start', mb:7}}>Hotels</Typography>   
            {!loading? (
                <Box sx={{  display: 'flex', flexDirection:'column', border: '2px solid black', borderRadius: 10, gap: 5, my: 4, px: 4, py: 5}}>                
                    {hotelNames?.map((hotel, index) => (
                        <Box key={hotelIds[index]} sx={{display: 'flex', }}>
                            <List  sx={{flex: 1.5}}>
                                <ListItemButton onClick={()=>handleClick(hotelIds[index])} sx={{display: 'flex',gap:10}} >
                                    <ListItemText primary={hotel} />
                                    {open[hotelIds[index]] ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                {hotelOffers ? (
                                    <Collapse in={open[hotelIds[index]]} timeout="auto" unmountOnExit sx={{mt: 3, ml: 6}}>    
                                        <Typography>{JSON.stringify(hotelOffers?.[hotelIds[index]]?.available)}</Typography>
                                        {hotelOffers?.[hotelIds[index]]?.offers?.map((offer, i)=>(
                                            <List key={i} component="div" disablePadding>
                                                <ListItemButton sx={{ pl: 4 }}> 
                                                    <ListItemText primary={offer.room.typeEstimated.bedType}/>                             
                                                    <ListItemText primary={offer.price.total} />
                                                </ListItemButton>
                                            </List>
                                        ))}                                                          
                                    </Collapse>
                                ):(
                                    <Collapse in={open[hotelIds[index]]} timeout="auto" unmountOnExit>
                                        <Typography>...</Typography>
                                        <Typography>{error.toString()}</Typography>                                   
                                    </Collapse>
                                )}                    
                            </List> 
                            <Button sx={{flex: 1}} onClick={()=>saveHotel(hotel)}>Save</Button>
                        </Box>               
                    ))}                         
                </Box>   
            ) : (
                <Box sx={{  display: 'flex', justifyContent:'center', alignItems: 'center', border: '2px solid black', borderRadius: 10, my: 4, p: 3, height:500}}>
                    <CircularProgress size={65} thickness={6} />
                </Box>   
            )}     
        </Box>
    );
}