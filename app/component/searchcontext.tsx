'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '../../utils/superbase/client';
import { User } from '@supabase/supabase-js';

type SearchStateType = {
    fromLocation: google.maps.places.PlaceResult | null;
    toLocation: google.maps.places.PlaceResult | null;
    checkIn: Date | null;
    checkOut: Date | null;
    guests: number;
    listOfRestaurants: google.maps.places.PlaceResult[];
    listOfAttractions: google.maps.places.PlaceResult[];
    updateFromLocation: (newFromLocation: google.maps.places.PlaceResult | null) => void;
    updateToLocation: (newToLocation: google.maps.places.PlaceResult | null) => void;
    updateCheckIn: (newCheckIn: Date | null) => void;
    updateCheckOut: (newCheckOut: Date | null) => void;
    updateGuests: (newGuests: number) => void;
    updateListOfRestaurants: (newListOfRestaurants: google.maps.places.PlaceResult[]) => void;
    updateListOfAttractions: (newListOfAttractions: google.maps.places.PlaceResult[]) => void;
};

const SearchStateContext = createContext<SearchStateType|undefined>(undefined);

export const useSearchState = () => {
  const context =  useContext(SearchStateContext);
  if (!context) {
    throw new Error('useChildState must be used within a SearchStateProvider');
    }
    return context;
};

export const SearchStateProvider = ({ children }: {children : React.ReactNode}) => {
    const [fromLocation, setFromLocation] = useState<google.maps.places.PlaceResult | null>(null);
    const [toLocation, setToLocation] = useState<google.maps.places.PlaceResult | null>(null);
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [guests, setGuests] = useState<number>(1);
    const [listOfRestaurants, setListOfRestaurants] = useState<google.maps.places.PlaceResult[]>([]);
    const [listOfAttractions, setListOfAttractions] = useState<google.maps.places.PlaceResult[]>([]);
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

    useEffect(() => {
        if (user && typeof window !== 'undefined') {
        const savedFromLocation = localStorage.getItem('storedFromLocation');
        const savedToLocation = localStorage.getItem('storedToLocation');
        const savedCheckIn = localStorage.getItem('storedCheckIn');
        const savedCheckOut = localStorage.getItem('storedCheckOut');
        const savedGuests = localStorage.getItem('storedGuests');
        const savedRestaurants = localStorage.getItem('storedRestaurants');
        const savedAttractions = localStorage.getItem('storedAttractions');

        if (savedFromLocation) setFromLocation(JSON.parse(savedFromLocation));
        if (savedToLocation ) setToLocation(JSON.parse(savedToLocation));
        if (savedCheckIn && !isNaN(Date.parse(savedCheckIn))) setCheckIn(new Date(savedCheckIn));
        if (savedCheckOut&& !isNaN(Date.parse(savedCheckOut))) setCheckOut(new Date(savedCheckOut));
        if (savedGuests) setGuests(parseInt(savedGuests, 10));
        if (savedRestaurants) setListOfRestaurants(JSON.parse(savedRestaurants));
        if (savedAttractions) setListOfAttractions(JSON.parse(savedAttractions));
        }
    }, [user]); 

    useEffect(() => {
        if (user && typeof window !== 'undefined') {
        localStorage.setItem('storedFromLocation', JSON.stringify(fromLocation));
        localStorage.setItem('storedToLocation', JSON.stringify(toLocation));
        localStorage.setItem('storedCheckIn', checkIn ? checkIn.toISOString() : '');
        localStorage.setItem('storedCheckOut', checkOut ? checkOut.toISOString() : '');
        localStorage.setItem('storedGuests', guests.toString());
        localStorage.setItem('storedRestaurants', JSON.stringify(listOfRestaurants));
        localStorage.setItem('storedAttractions', JSON.stringify(listOfAttractions));
        }
    }, [toLocation, fromLocation, checkIn, checkOut, guests, user, listOfRestaurants, listOfAttractions]);

    const updateFromLocation = (newFromLocation: google.maps.places.PlaceResult | null) => setFromLocation(newFromLocation);
    const updateToLocation = (newToLocation: google.maps.places.PlaceResult | null) => setToLocation(newToLocation);    
    const updateCheckIn = (newCheckIn: Date | null) => setCheckIn(newCheckIn ? new Date(newCheckIn) : null);
    const updateCheckOut = (newCheckOut: Date | null) => setCheckOut(newCheckOut ? new Date(newCheckOut) : null);
    const updateGuests = (newGuests: number) => setGuests(newGuests);
    const updateListOfRestaurants = (newRestaurants: google.maps.places.PlaceResult[]) => setListOfRestaurants(newRestaurants);
    const updateListOfAttractions = (newAttractions: google.maps.places.PlaceResult[]) => setListOfAttractions(newAttractions);

    return (
        <SearchStateContext.Provider value={{toLocation, fromLocation, checkIn, checkOut, guests, listOfRestaurants, listOfAttractions, 
            updateFromLocation, updateToLocation, updateCheckIn, updateCheckOut, updateGuests, updateListOfRestaurants, updateListOfAttractions}}>
            {children}
        </SearchStateContext.Provider>
    );
};