'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';

interface PlaceAutocompleteProps {
  apiKey: string;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const libraries: ('places')[] = ['places'];

export default function PlaceAutocomplete({ onPlaceSelect, apiKey }: PlaceAutocompleteProps): JSX.Element {
  const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries,
  });

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setPlaceAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (!placeAutocomplete) return;
      const place = placeAutocomplete.getPlace();
      if (place?.formatted_address) {
        setSelectedAddress(place.formatted_address);
      }
      onPlaceSelect(place);
  };

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const options = {
      fields: ['geometry', 'name', 'formatted_address']
    };
    const autocomplete = new places.Autocomplete(inputRef.current, options);
    setPlaceAutocomplete(autocomplete);

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [places]);

  return isLoaded ? (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <TextField variant="standard" value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)} placeholder="City" inputRef={inputRef} required>
      </TextField> 
    </Autocomplete>
  ) : (
    <p>Loading...</p>
  );
};