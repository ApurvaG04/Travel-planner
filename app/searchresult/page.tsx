'use client';
import Searchbar from '../component/searchbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Weatherhandle from '../component/weatherhandler';
import Flighthandler from '../component/flighthandler';
import Restauranthandler from '../component/restauranthandler';
import Attractionshandler from '../component/attractionshandler';
import GoogleMapComponent from '../component/maphandler';
import Hotelhandler from '../component/hotelhandler';
import { useState } from 'react';
  
  // const TABS_STORAGE_KEY = 'lastSelectedTab';
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||'';

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
  

export default function Searchresult() { // props: TabPanelProps

    const [value, setValue] = useState<number>(0
  // () => {
  //     const savedTab = localStorage.getItem(TABS_STORAGE_KEY);
  //     return savedTab !== null ? parseInt(savedTab, 10) : 0;
  // }
  );

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        // localStorage.setItem(TABS_STORAGE_KEY, newValue.toString());
    };
  
    return (
      
            <Container maxWidth={false} sx={{  display:'flex', flexDirection: 'column',  alignItems:'center' , height: 'inherit', width: 'inherit', isplay: 'flex', py: 10, px: 100}}>
                <Searchbar color={'#cfd8dc'} contrast={'white'}/>
                <Box sx={{width: '80%'}}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider',my:10 }}>
                      <Tabs value={value} onChange={handleChange} textColor="primary"
        indicatorColor="primary" aria-label="basic tabs example" variant="fullWidth">
                          <Tab label="Tools" {...a11yProps(0)} />
                          <Tab label="Flights"{...a11yProps(1)} />
                          <Tab label="Hotels" {...a11yProps(2)} />
                          <Tab label="Restaurants" {...a11yProps(3)} />
                          <Tab label="Attractions" {...a11yProps(4)} />
                      </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <Weatherhandle/>
                        <GoogleMapComponent apiKey={GOOGLE_MAPS_API_KEY}/>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                      <Flighthandler />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                      <Hotelhandler />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={3}>
                      <Restauranthandler />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={4}>
                      <Attractionshandler />
                    </CustomTabPanel>
                </Box>
            </Container>
    );
}