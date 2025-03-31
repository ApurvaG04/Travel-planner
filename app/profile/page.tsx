'use client';
import { useEffect, useState } from 'react';
import { createClient } from '../../utils/superbase/client';
import { type User } from '@supabase/supabase-js';
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Fade from '@mui/material/Fade';
import List from '@mui/material/List';
import { ListItemText } from '@mui/material';
import ProfilePic from '../component/profilepic';
// import { useUserState } from '../component/usercontext';
import Itinerary from '../component/itinerary';
import { useUserState } from '../component/usercontext';

export default function AccountForm() {
    const supabase = createClient();
    const {name, curLocation, picURL, updateName, updateCurLocation, updatePicURL} = useUserState();
    const [localName, setLocalName] = useState<string | ''>('');
    const [localCurLocation, setLocalCurLocation] = useState<string | ''>('');
    const [localPicURL, setLocalPicURL] = useState<string | ''>('');
    const [user, setUser] = useState<User|null>(null);   
    const [anchorFormDisplay, setAnchorFormDisplay] = useState<true | false>(false);

    useEffect(() => { 
        const getUser = async () => {  // Get user from session
            const {data: { user }, } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
            }
        }; 
        getUser(); 
        console.log('picurl',localPicURL);
    },[localPicURL, supabase.auth]);

    useEffect(()=>{
        const getProfile = async () => {  // Get profile from database
            try {             
              const { data, error, status } = await supabase
                .from('profiles')
                .select('email, name, cur_location, pic_url')
                .eq('id', user?.id)
                .single();
        
              if (error && status !== 406) {
                console.log(error);
                throw error;
              }
        
              if (data) {
                setLocalName(data.name);
                setLocalCurLocation(data.cur_location);
                setLocalPicURL(data.pic_url);
              }
            } catch (error) {
              alert(error);
            }
        };
        if (user) {
            getProfile();
        }
    }, [user, supabase]);

    async function updateProfile({  // Update profile to the database
        name, curLocation, picURL
    }: {
        name: string | null
        curLocation: string | null
        picURL: string | null
    }) {
        try {
        // setLoading(true);
        const { error } = await supabase.from('profiles').upsert({
            id: user?.id as string,
            email: user?.email as string,
            updated_at: new Date().toISOString(),
            name,
            cur_location: curLocation,
            pic_url: picURL
        });
        if (error) throw error; 
            console.log('Profile updated!');
        } catch (error) {
            console.log(error);
        } finally {
            // setLoading(false);
        }
    }


    const handleFormDisplay = () => {
        setAnchorFormDisplay((prev) => !prev);
    };

    const handleFormSubmit = () => {
        updateProfile({name:localName, curLocation:localCurLocation, picURL:localPicURL});
        updateName(localName);
        updateCurLocation(localCurLocation);
        
        setAnchorFormDisplay((prev) => !prev);
    };

    const handlePicUpload = (url: string) => {
        setLocalPicURL(url);
        updatePicURL(url);
        updateProfile({ name, curLocation, picURL: url });
    };

    const updateForm = (        
        <Box sx={{width: '350px', px:5, pt:7}}>
            <Typography variant="h6" sx={{color: 'black'}}>Update profile</Typography>
            <TextField id="outlined-basic" label="Full name" variant="outlined" required fullWidth
                        defaultValue="" onChange={(e) => setLocalName(e.target.value)} sx={{display: 'block', width:'500', my: 5}}/>
            <TextField id="outlined-basic" label="Current location" variant="outlined" required fullWidth
                        defaultValue="" onChange={(e) => setLocalCurLocation(e.target.value)} sx={{display: 'block', my: 5}}/>  
            <Button sx={{width: 100, bgcolor: 'black', borderRadius: 10, textTransform: 'none', display: 'block', my: 5}} onClick={handleFormSubmit}>
                    <Typography variant='body1' color='white' fontSize={20}> Update </Typography>
            </Button>            
        </Box>        
    );

    const displayForm = (        
        <Box sx={{ width: '400px', px:5, pt:7}}>
            <List >
                <ListItemText primary={`Name: ${localName}`} slotProps={{primary: {sx:{fontSize: 20}}}}/>
                <ListItemText primary={`Email: ${user?.email}`} slotProps={{primary: {sx:{fontSize: 20}}}} />
                <ListItemText primary={`Current location: ${localCurLocation}`} slotProps={{primary: {sx:{fontSize: 20}}}} />
            </List>
            <Button sx={{width: 100, bgcolor: 'black', borderRadius: 10, textTransform: 'none', display: 'block', my: 5}} onClick={handleFormDisplay}>
                    <Typography variant='body1' color='white' fontSize={20}> Edit </Typography>
            </Button>
        </Box>                    
    );

    return (
        <Container maxWidth={false} sx={{ width: 'inherit', isplay: 'flex', py: 5, px: 5}}>
            <Typography variant='h2' sx={{display: 'flex', justifyContent:'center', p:2}}>Profile</Typography>
            <Grid2 sx={{display: 'flex',p:5, gap: 5}}>                
                <Grid2 sx={{display:'flex', maxHeight: 800, flex: 1, flexDirection: 'column', border: '1px solid Grey', alignContent:'center', px: 2, py: 5}}>
                    <Box sx={{height: '250px', width: '250px',  alignContent:'center', justifyContent:'center'}}>
                        <ProfilePic uid={user?.id ?? null} url={localPicURL} onUpload={(url)=>handlePicUpload(url)}/>
                    </Box>
                    <Grid2>
                        {anchorFormDisplay? 
                        (<Fade in={anchorFormDisplay}>{updateForm}</Fade>):
                        (<Fade in={!anchorFormDisplay}>{displayForm}</Fade>)}                   
                    </Grid2>
                </Grid2>
                <Grid2 sx={{display:'flex', flex:2, flexDirection: 'column', border: '1px solid Grey', alignContent:'center',}}>
                    <Box sx={{bgcolor: '#bdbdbd',height: 40, p:2, display:'flex', justifyContent: 'center'}}>
                        <Typography variant='h4' sx={{}}>Saved Itineraries</Typography>  
                    </Box>                 
                    <Itinerary />
                </Grid2>
            </Grid2>
        </Container>
    );
}
