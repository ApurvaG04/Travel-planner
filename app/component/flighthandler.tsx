'use client';

import { useSearchState } from './searchcontext';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useItineraryState } from './tripcontext';

interface Flight {
    itineraries: {
        duration: string;
        segments: {
            departure: {
                at: string; iataCode: string 
};
            arrival: {
                at: string; iataCode: string 
};
        }[];
    }[];
    price: { total: string };
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
}

export default function Flighthandler() {
    const {itineraries, updateItineraries} = useItineraryState();
    const {toLocation, fromLocation, checkIn, checkOut} = useSearchState();
    const [onewayFlights, setOnewayFlights] = useState<Flight[]>([]);
    const [returnFlights, setReturnFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [trip, setTrip] = useState<number>(0);

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatRespTime = (time: string) => {
        const HH = time.slice(0, 2);
        const hh = parseInt(time.slice(0, 2));
        
        if (HH === '00') {
            return `12${time.slice(2, 8)} AM`;
        } else if (HH === '12') {
            return `${HH}${time.slice(2, 8)} PM`;
        } else if (hh > 12 ) {
            if( hh - 12 < 10 && hh -12 !== 0) {
                return `0${(hh - 12).toString()}${time.slice(2, 8)} PM`;
            } else {
                return `${(hh - 12).toString()}${time.slice(2, 8)} PM`;
            }
        }
        return `${HH}${time.slice(2, 8)} AM`;
    };

    const saveOnewayFlight = (onewayFlight: Flight) => {
        const location = toLocation?.name || '';
        updateItineraries(location, {
            ...itineraries.location,
            flight: {
                ...(itineraries[location]?.flight || { onewayFlight: null, returnFlight: null }),
                onewayFlight,
            }
        });
    };


    const saveReturnFlight = (returnFlight: Flight) => {
        const location = toLocation?.name || '';
        updateItineraries(location, {
            ...itineraries.location, 
            flight: {
                ...(itineraries[location]?.flight || { onewayFlight: null, returnFlight: null }),
                returnFlight
            }
        });
    };

    useEffect(()=>{
        const searchFlights = async (origin: string | undefined, destination: string | undefined) => {
            setLoading(true);
            setError(null);            
            try {
                const response = await fetch(`/api/flightresult?originKeyword=${origin}&destinationKeyword=${destination}&dateOfDeparture=${checkIn?formatDate(checkIn):null}`);
                const data = await response.json();   
                if (response.ok) {
                    setOnewayFlights(data.data);
                } else {
                    setError(data.error || 'Failed to fetch flights');
                }
            } catch (err) {
                if(err) {
                    setError('Something went wrong in flight component');
                }
            } finally {
                setLoading(false);
                console.log(error);
            }
    
            try {
                const response = await fetch(`/api/flightresult?originKeyword=${destination}&destinationKeyword=${origin}&dateOfDeparture=${checkOut?formatDate(checkOut):null}`);
                const data = await response.json();    
                if (response.ok) {
                    setReturnFlights(data.data);
                } else {
                    setError(data.error || 'Failed to fetch flights');
                }
            } catch (err) {
                if(err) {
                    setError('Something went wrong in flight component');
                }
            } finally {
                setLoading(false);
                console.log('Oneway flights', onewayFlights);
                console.log('Return flights',returnFlights);
            }
        };
        if(checkIn && fromLocation && toLocation) {
        searchFlights(fromLocation?.name, toLocation?.name);
        }
    }, [toLocation, fromLocation, checkIn, checkOut, error]);

    const handleOnewaySearch = async () => {           
            setTrip(0);
            console.log(onewayFlights);  
    };

    const handleReturnSearch = async () => {
        setTrip(1);
    };

    return (
        <Box>
            <Typography variant='h4' sx={{textAlign:'start'}}>Flights</Typography>          
            <Grid2 sx={{display: 'flex', bgcolor:'#42a5f5', justifyContent:'space-evenly', my:5}} gap={10}>
                    <Button onClick={handleOnewaySearch} disabled={loading} sx={{flex:1}}>
                        <Typography color='white'>One way Flights</Typography>
                    </Button>
                <Box sx={{color: 'white', alignSelf:'center', width: 0, height: 50, border: '1px solid white', mx: 1 }}></Box>
                    <Button onClick={handleReturnSearch} disabled={loading} sx={{flex:1}}>
                    <Typography color='white'>Return Flights</Typography>
                    </Button>
            </Grid2>
            {!loading? (
                <Box sx={{   border: '1px solid black', borderRadius: 10, my: 4, px: 3, py: 5}}>                                   
                    {trip?(
                        <Box sx={{display: 'flex', flexDirection:'column', p:5}}>
                            <Grid2 sx={{display: 'flex', }}>
                                <Typography variant='h6'sx={{flex: 0.5}}>No.</Typography>
                                <Typography variant='h6'sx={{flex: 1}}>Duration</Typography>
                                <Typography variant='h6'sx={{flex: 0.7}}>To</Typography>
                                <Typography variant='h6'sx={{flex: 1.7}}>Time</Typography>
                                <Typography variant='h6'sx={{flex: 0.7}}>From</Typography>
                                <Typography variant='h6'sx={{flex: 1.7}}>Time</Typography>
                                <Typography variant='h6'sx={{flex: 1}}>Price</Typography>
                                <Button sx={{flex: 1}}></Button>                       
                            </Grid2>
                            <Grid2>
                                {returnFlights.map((flight, index) => (
                                    <Grid2 key={index} sx={{my:5}}>                                 
                                    <Grid2 display={'flex'}>      
                                        <Typography sx={{flex: 0.5}}>{index + 1}</Typography>   
                                        <Typography sx={{flex: 1}}>{flight.itineraries[0].duration.slice(2).replace(/[HM]/g, match => match.toLowerCase())}</Typography>                                                                                   
                                        <Typography sx={{flex: 0.7}}>{flight.itineraries[0].segments[0].departure.iataCode}</Typography>
                                        <Typography sx={{flex: 1.7}}>{flight.itineraries[0].segments[0].departure.at.slice(0, 10)} - {formatRespTime(flight.itineraries[0].segments[0].departure.at.slice(11, 19))}</Typography>
                                        <Typography sx={{flex: 0.7}}>{flight.itineraries[0].segments[0].arrival.iataCode}</Typography>
                                        <Typography sx={{flex: 1.7}}>{flight.itineraries[0].segments[0].arrival.at.slice(0, 10)} - {formatRespTime(flight.itineraries[0].segments[0].arrival.at.slice(11, 19))}</Typography>
                                        <Typography sx={{flex: 1}}>{flight.price.total}</Typography>
                                        <Button sx={{flex: 1}} onClick={()=>saveReturnFlight(flight)}>Save</Button> 
                                    </Grid2>                                   
                                    {(flight.itineraries[0].segments.length > 1)?(
                                        <Grid2 display={'flex'}>     
                                            <Typography sx={{flex: 0.5}}></Typography>     
                                            <Typography sx={{flex: 1}}></Typography>                              
                                            <Typography sx={{flex: 0.7}}>{flight.itineraries[0].segments[1].departure.iataCode}</Typography>
                                            <Typography sx={{flex: 1.7}}>{flight.itineraries[0].segments[1].departure.at.slice(0, 10)} - {formatRespTime(flight.itineraries[0].segments[1].departure.at.slice(11, 19))}</Typography>
                                            <Typography sx={{flex: 0.7}}>{flight.itineraries[0].segments[1].arrival.iataCode}</Typography>
                                            <Typography sx={{flex: 1.7}}>{flight.itineraries[0].segments[1].arrival.at.slice(0, 10)} - {formatRespTime(flight.itineraries[0].segments[1].arrival.at.slice(11, 19))}</Typography>
                                            <Typography sx={{flex: 1}}>{flight.price.total}</Typography>
                                            <Button sx={{flex: 1}}></Button>
                                        </Grid2>
                                    ):(
                                        <></>
                                    )}                                                                   
                                </Grid2>
                                ))}                     
                            </Grid2>
                        </Box>
                    ):(
                        <Box sx={{display: 'flex', flexDirection:'column', p:5}}>
                            <Grid2 sx={{display: 'flex', }}>
                                <Typography variant='h6'sx={{flex: 0.5}}>No.</Typography>
                                <Typography variant='h6'sx={{flex: 1}}>Duration</Typography>
                                <Typography variant='h6'sx={{flex: 0.7}}>To</Typography>
                                <Typography variant='h6'sx={{flex: 1.7}}>Time</Typography>
                                <Typography variant='h6'sx={{flex: 0.7}}>From</Typography>
                                <Typography variant='h6'sx={{flex: 1.7}}>Time</Typography>
                                <Typography variant='h6'sx={{flex: 1}}>Price</Typography>
                                <Button sx={{flex: 1}}></Button>                       
                            </Grid2>
                            <Grid2>
                                {onewayFlights.map((flight, index) => (
                                    <Grid2 key={index} sx={{my:5}}>                                 
                                        <Grid2 display={'flex'}>      
                                            <Typography sx={{flex: 0.5}}>{index + 1}</Typography>   
                                            <Typography sx={{flex: 1}}>{flight.itineraries[0].duration.slice(2).replace(/[HM]/g, match => match.toLowerCase())}</Typography>                                                                                   
                                            <Typography sx={{flex: 0.7}}>{flight.itineraries[0].segments[0].departure.iataCode}</Typography>
                                            <Typography sx={{flex: 1.7}}>{flight.itineraries[0].segments[0].departure.at.slice(0, 10)} - {formatRespTime(flight.itineraries[0].segments[0].departure.at.slice(11, 19))}</Typography>
                                            <Typography sx={{flex: 0.7}}>{flight.itineraries[0].segments[0].arrival.iataCode}</Typography>
                                            <Typography sx={{flex: 1.7}}>{flight.itineraries[0].segments[0].arrival.at.slice(0, 10)} - {formatRespTime(flight.itineraries[0].segments[0].arrival.at.slice(11, 19))}</Typography>
                                            <Typography sx={{flex: 1}}>{flight.price.total}</Typography>
                                            <Button sx={{flex: 1}} onClick={()=>saveOnewayFlight(flight)}>Save</Button> 
                                        </Grid2>                                   
                                        {(flight.itineraries[0].segments.length > 1)?(
                                            <Grid2 display={'flex'}>     
                                                <Typography sx={{flex: 0.5}}></Typography>     
                                                <Typography sx={{flex: 1}}></Typography>                              
                                                <Typography sx={{flex: 0.7}}>{flight.itineraries[0].segments[1].departure.iataCode}</Typography>
                                                <Typography sx={{flex: 1.7}}>{flight.itineraries[0].segments[1].departure.at.slice(0, 10)} - {formatRespTime(flight.itineraries[0].segments[1].departure.at.slice(11, 19))}</Typography>
                                                <Typography sx={{flex: 0.7}}>{flight.itineraries[0].segments[1].arrival.iataCode}</Typography>
                                                <Typography sx={{flex: 1.7}}>{flight.itineraries[0].segments[1].arrival.at.slice(0, 10)} - {formatRespTime(flight.itineraries[0].segments[1].arrival.at.slice(11, 19))}</Typography>
                                                <Typography sx={{flex: 1}}>{flight.price.total}</Typography>
                                                <Button sx={{flex: 1}} ></Button>
                                            </Grid2>
                                        ):(
                                            <></>
                                        )}
                                                                        
                                    </Grid2>
                                ))}                     
                            </Grid2>
                        </Box>
                    )}              
                </Box>  
            ) : (
                <Box sx={{  display: 'flex', justifyContent:'center', alignItems: 'center', border: '2px solid black', borderRadius: 10, my: 4, p: 3, height:500}}>
                    <CircularProgress size={65} thickness={6} />
                </Box>
            )}
        </Box>
    );
}