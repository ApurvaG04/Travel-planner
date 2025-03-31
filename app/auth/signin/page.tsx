'use client';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { JSX, useCallback, useState } from 'react';
import theme from '../../component/theme';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid2 from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';
import {signin} from '../actions';
import { createClient } from '../../../utils/superbase/client';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useUserState } from '../../component/usercontext';
import { User } from '@supabase/supabase-js';

export default function Signin(): JSX.Element {
    const {name, updateEmail} = useUserState();
    const [loginEmail, setLoginEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState<User|null>(null);
    const supabase = createClient();  

    const getUser = async () => {  // Get user from session
        const {data: { user }, } = await supabase.auth.getUser();
        if (user) {
            setUser(user);
        }
    }; 

    // const getProfile = useCallback(async () => {  // Get profile from database
    //     try {             
    //       const { data, error, status } = await supabase
    //         .from('profiles')
    //         .select('email, name, cur_location, pic_url')
    //         .eq('id', user?.id)
    //         .single();
    
    //       if (error && status !== 406) {
    //         console.log(error);
    //         throw error;
    //       }
    
    //       if (data) {
    //         updateName(data.name);
    //         updateEmail(data.email);
    //         updateCurLocation(data.cur_location);
    //         updatePicURL(data.pic_url);
    //       }
    //     } catch (error) {
    //       alert(error);
    //     }
    // }, [user, supabase, updateName, updateEmail, updateCurLocation, updatePicURL]);

    const handleSignin = async () => {        
        await signin({email: loginEmail, password: password });
        getUser();
        // if (user) {
        //     await getProfile();
        // }
        window.location.href = '/'; 
        console.log(name);
    };
        
    const handleGoogleSignin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'openid email profile', // Specify scopes explicitly if needed
            },
        });
        if (error) {
            console.error('Error during Google sign-in:', error.message);
        } else {
            console.log('Google sign-in successful');
            updateEmail(loginEmail);   
            getUser();        
        }
    };
    const handleClickShowPassword = () => setShowPassword((show) => !show); 

    return (
        <ThemeProvider theme={theme}>
            <div className="pages-background">
                <Container maxWidth={false} disableGutters sx={{display: 'flex', height: 'inherit', margin: 0}}>
                    <Box component="form" sx={{ display: 'flex', width: '60%', justifyContent:'center', alignItems: 'center' }} noValidate autoComplete="off">                   
                        <Grid2 >                       
                            <Typography variant="h3" sx={{color: 'black'}}>Sign in</Typography>
                            <Typography variant="h6" sx={{color: 'black'}}>Not registered? <Link href="/auth/signup">signup</Link></Typography>
                            <Container disableGutters sx={{width:'300px', margin:0}}>
                                <FormControl sx={{ isplay: 'block', my: 2 }} variant="outlined" required fullWidth defaultValue="" >
                                    <InputLabel htmlFor="outlined-basic">Email</InputLabel>
                                    <OutlinedInput id="outlined-basic" label="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                                </FormControl>
                                <FormControl sx={{ isplay: 'block', my: 2 }} variant="outlined" required fullWidth defaultValue="" >
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput id="outlined-adornment-password" type={showPassword ? 'text' : 'password'} value={password} 
                                        onChange={(e) => setPassword(e.target.value)} endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton aria-label={ showPassword ? 'hide the password' : 'display the password'} onClick={handleClickShowPassword} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>}
                                        label="Password"/>                                   
                                </FormControl>
                                <Button sx={{width: 100, bgcolor: 'black', borderRadius: 10, textTransform: 'none', display: 'block', my: 5}} onClick={handleSignin}>
                                    <Typography variant='body1' color='white' fontSize={20}> Sign in </Typography>
                                </Button>
                                <Typography variant='body1'>Note: Please verify email id for first time signing in.</Typography>
                                <Button variant="contained" startIcon={<GoogleIcon />} onClick={handleGoogleSignin}
                                    sx={{backgroundColor: 'white', color: '#4285F4', textTransform: 'none', my: 5}}>
                                    Sign in with Google
                                </Button>
                            </Container>                      
                        </Grid2>                                   
                    </Box>
                    <Box sx={{width: '40%', height: '94vh', backgroundImage: 'url(/mkw.jpg)'}}>               
                    </Box>
                </Container>
            </div>
        </ThemeProvider>
    );
}