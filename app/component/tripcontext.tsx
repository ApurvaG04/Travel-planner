'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '../../utils/superbase/client';
import { User } from '@supabase/supabase-js';

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

// interface Hotel {
//     available: boolean,
//     offers: {
//         price: {total: string };
//         room: {
//             typeEstimated: { 
//                 bedType: string,
//                 beds: number,
//                 category: string
//             };
//         };
//     }[];
// }

interface ItineraryStateType {
    itineraries: Record<string, {  // Key: location string, Value: itinerary object
        flight: {
            onewayFlight: Flight | null;
            returnFlight: Flight | null;
        };
        hotel: string[] | [];
        restaurants: string[] | [];
        attractions: string[] | [];
    }>;
    updateItineraries: (location: string, newItinerary: ItineraryStateType['itineraries'][string]) => void;
    deleteItineraries: (location: string) => void;
}

const ItineraryStateContext = createContext<ItineraryStateType | undefined>(undefined);

export const useItineraryState = () => {
  const context =  useContext(ItineraryStateContext);
  if (!context) {
    throw new Error('useItineraryState must be used within a ItineraryStateContext');
    }
    return context;
};

export const ItineraryStateProvider = ({ children }: {children : React.ReactNode}) => {
    const [itineraries, setItineraries] = useState<ItineraryStateType['itineraries']>({});
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
        const savedItineraries = localStorage.getItem('storedItineraries');

        if (savedItineraries) setItineraries(JSON.parse(savedItineraries));
        }
    }, [user]); 

    useEffect(() => {
        if (user && typeof window !== 'undefined') {
        localStorage.setItem('storedItineraries', JSON.stringify(itineraries));
        }
    }, [user, itineraries]);

    const updateItineraries = (location: string, newItineraries: Partial<ItineraryStateType['itineraries'][string]>) => {
        setItineraries(prev => ({
            ...prev,
        [location]: {
            ...prev[location] || {  // Initialize default values if location doesn't exist
                flight: { onewayFlight: null, returnFlight: null },
                hotel: [],
                restaurants: [],
                attractions: []
            },
            ...newItineraries, // Update only the provided fields
        }
        }));
    };   
    const deleteItineraries = (location: string) => {
        setItineraries((prev) => {
            const updatedItineraries = { ...prev };
            delete updatedItineraries[location]; // Remove the itinerary key for the location
            return updatedItineraries;
        });    
    }; 

    return (
        <ItineraryStateContext.Provider value={{itineraries, updateItineraries, deleteItineraries}}>
            {children}
        </ItineraryStateContext.Provider>
    );
};