'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '../../utils/superbase/client';

type UserStateType = {
    name: string |'';
    curLocation: string |'';
    email: string;
    picURL: string |'';
    updateName: (newName: string |'') => void;
    updateCurLocation: (newCurLocation: string |'') => void;
    updateEmail: (newEmail: string) => void;
    updatePicURL: (newPicURL: string |'') => void;
};

const UserStateContext = createContext<UserStateType | undefined>(undefined);

export const useUserState = () => {
  const context =  useContext(UserStateContext);
  if (!context) {
    throw new Error('useChildState must be used within a SearchStateProvider');
    }
    return context;
};

export const UserStateProvider = ({ children }: {children : React.ReactNode}) => {
    const [name, setName] = useState<string | ''>('');
    const [curLocation, setCurLocation] = useState<string | ''>('');
    const [email, setEmail] = useState<string>('');
    const [picURL, setPicURL] = useState<string | ''>('');
    const [user, setUser] = useState<User|null>(null);
    const supabase = createClient();  
    
    useEffect(()=>{
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
        const savedName = localStorage.getItem('storedName');
        const savedCurLocation = localStorage.getItem('storedCurLocation');
        const savedEmail = localStorage.getItem('storedEmail');
        const savedPicURL = localStorage.getItem('storedPicURL');

        if (savedName) setName(savedName);
        if (savedCurLocation) setCurLocation(savedCurLocation);
        if (savedEmail) setEmail(savedEmail);
        if (savedPicURL) setPicURL(savedPicURL);
        }
    }, [user]); 

    useEffect(() => {
        if (user && typeof window !== 'undefined') {
        localStorage.setItem('storedName', name);
        localStorage.setItem('storedCurLocation', curLocation);
        localStorage.setItem('storedEmail', email);
        localStorage.setItem('savedPicURL', picURL);
        }
    }, [name, curLocation, email, picURL, user]);

    const updateName = (newName: string | '') => setName(newName);
    const updateCurLocation = (newCurLocation: string | '') => setCurLocation(newCurLocation);
    const updateEmail = (newEmail: string) => setEmail(newEmail);
    const updatePicURL = (newPicURL: string | '') => setPicURL(newPicURL);
    
    return (
        <UserStateContext.Provider value={{name, curLocation, email, picURL, updateName, updateCurLocation, updateEmail, updatePicURL }}>
        {children}
        </UserStateContext.Provider>
    );
};

