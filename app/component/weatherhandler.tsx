'use client';
import { useEffect, useState } from 'react';
import { useSearchState } from './searchcontext';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import { ListItemText } from '@mui/material';
import Image from 'next/image';

interface WeatherResponse {
    humidity: number;
    sunrise: number;
    sunset: number;
    temp: {
        min: number;
        max: number;
    };
    weather: {
        description: string;
        icon: string;
    }[];
}

export default function Weatherhandler() {
    const {toLocation} = useSearchState();
    const [weather, setWeather] = useState<WeatherResponse[]>([]);
    const [outputIndex, setOutputIndex] = useState<number>(0);
    const today = new Date();
    const dayIndex = today.getDay(); 
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];  

    function convertUnixToEST(unixTimestamp: number) {
        const estTime = new Date((unixTimestamp ) * 1000); // Convert to milliseconds      
        return estTime.toLocaleTimeString(); // Format as time string      
    }

    useEffect(()=>{
        const handleWeather = async () => {
            try {
                const weatherResult = await fetch('api/weatherresult', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }           
                });
                
                if (weatherResult.status !== 200) {
                    throw new Error(`HTTP error! Status: ${weatherResult.status}`);
                } else {
                    const data = await weatherResult.json(); 
                    setWeather(data.props.weatherResponse.list);
                }               
            } catch (error) {
                console.error('Error', error);
            }
        };
        handleWeather();
    },[toLocation]);
     console.log(weather);
    return(
        <>
        <Typography variant='h4' sx={{textAlign:'start'}}>Weather</Typography>
        <Box sx={{  display: 'flex', flexDirection:'column', border: '3px solid black', borderRadius: 10, gap: 5, my: 5, p: 3}}>
            <Grid2 key={'weather-tile'} sx={{ border: '3px solid grey', borderRadius: 5,  display: 'flex', justifyContent: 'space-between', gap: 2}}>
                <Grid2 sx={{m: 5}}>
                    <Typography variant='h5'>{daysOfWeek[(dayIndex+outputIndex)%7]}</Typography>
                    <Typography>{today.toJSON().slice(0, 8)}{parseInt(today.toJSON().slice(8, 10)) + ((outputIndex)%7)}</Typography>
                    <Typography>{toLocation?.name}</Typography>
                </Grid2>
                <Grid2 sx={{ flex: 0.5, display: 'flex', justifyContent: 'right', my: 5}}>
                {weather?
                    (<List style={{listStyle: 'none', padding: '0'}}>
                        <ListItemText key={'maxtemp'}>H: {weather[outputIndex]?.temp.max}°C</ListItemText>
                        <ListItemText key={'mintemp'}>L: {weather[outputIndex]?.temp.min}°C</ListItemText>
                        <ListItemText key={'humidity'}>Humidity: {weather[outputIndex]?.humidity}g/m^{3}</ListItemText>
                        <ListItemText key={'sunrise'}>Sunrise: {convertUnixToEST(weather[outputIndex]?.sunrise)}</ListItemText>
                        <ListItemText key={'sunset'}>Sunset: {convertUnixToEST(weather[outputIndex]?.sunset)}</ListItemText>
                    </List>):(<></>)}
                </Grid2>
                <Grid2 sx={{ flex: 0.5}}>
                    {weather?                       
                        (<Tooltip key={outputIndex} title={weather[outputIndex]?.weather[0].description}>
                            <Image  src={`https://openweathermap.org/img/wn/${weather[outputIndex]?.weather[0].icon}@2x.png`} alt='Weather' height={200} width={200}/>
                        </Tooltip>):(<></>)}
                </Grid2>
            </Grid2>
            <Grid2 key={'weather-list'} sx={{ display: 'flex', justifyContent:'space-between', alignItems:'center', gap: 1,}}>
                {weather?.map((value, index)=> (
                    <Grid2 key={`weather-item-${index}`} sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', border: '3px solid grey', borderRadius: 5}}>
                        <Tooltip key={`tooltip-${index}`} title={weather[index].weather[0].description}>
                        <Button key={`button-${index}`} onClick={()=>{setOutputIndex(index);}}>
                            <List style={{listStyle: 'none', padding: '0'}}>
                                <ListItemText key={`day-${index}`}><Typography key={`${daysOfWeek[(dayIndex+index)%7]}`}>{daysOfWeek[(dayIndex+index)%7]}</Typography></ListItemText>
                                <ListItemText key={`Htemp-${index}`}><Typography>H: {value?.temp.max}°C</Typography></ListItemText>
                                <ListItemText key={`Ltemp-${index}`}><Typography> L: {value?.temp.min}°C</Typography></ListItemText>
                                <ListItemText key={`img-${index}`}><Image  src={`https://openweathermap.org/img/wn/${weather[index].weather[0].icon}@2x.png`} alt='Weather' height={100} width={100}/></ListItemText>
                            </List>                           
                        </Button>
                        </Tooltip>
                    </Grid2>
                ))}
            </Grid2>
        </Box>
        </>
    );
}