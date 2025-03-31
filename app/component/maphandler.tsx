'use client';

import { GoogleMap, useJsApiLoader} from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { useSearchState } from './searchcontext';
import { Box, Typography } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '500px',
};

interface GoogleMapComponentProps {
  apiKey: string;
}
const libraries: ('places')[] = ['places'];
const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ apiKey }) => {
  const { toLocation, updateListOfAttractions, updateListOfRestaurants }  = useSearchState();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  // const marker = new google.maps.Marker({
  //   position: { lat: toLocation?.geometry?.location?, lng: toLocation?.geometry?.location? },
  //   map: map,
  // });


  // const infowindow = new google.maps.InfoWindow({
  //   content: '<p>Marker Location:' + marker.getPosition() + '</p>',
  // });

  useEffect(() => {
      if (map) {
        const service = new window.google.maps.places.PlacesService(map);
        const resRequest: google.maps.places.PlaceSearchRequest = {
          location: toLocation?.geometry?.location,
          radius: 1000, 
          type: 'restaurant', 
        };
          service.nearbySearch(resRequest, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              updateListOfRestaurants(results);
            }
          });

        const attrRequest: google.maps.places.PlaceSearchRequest = {
          location: toLocation?.geometry?.location,
          radius: 1000,
          type: 'tourist_attraction',
        };
          service.nearbySearch(attrRequest, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              updateListOfAttractions(results);
            }
          });
      }
  }, [map, toLocation?.geometry?.location]);

  return (
    <>
    <Typography variant='h4' sx={{textAlign:'start'}}>Map</Typography>
    <Box sx={{  display: 'flex', flexDirection:'column', border: '3px solid black', borderRadius: 10, gap: 5, my: 5, p: 3}}>
      {isLoaded ? (
        <GoogleMap mapContainerStyle={containerStyle} center={toLocation?.geometry?.location} zoom={15} onLoad={(mapInstance) => setMap(mapInstance)} >
          {/* Show Specific Location Marker */}

           {/* <Marker position={{lat: toLocation?.geometry?.location?.lat || 0, lng: toLocation?.geometry?.location?.lng || 0}} label="📍" />  */}

          {/* {places.map((place, index) => {
            if (!place.geometry?.location) return null;

            const position: google.maps.LatLngLiteral = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            return <Marker key={index} position={position} />;
          })} */}
        </GoogleMap>
      ) : (
        <p>Loading...</p>
      )}
    </Box>
    </>
  
  );
};

export default GoogleMapComponent;