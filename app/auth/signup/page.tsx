'use client';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { JSX, useState } from 'react';
import theme from '../../component/theme';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid2 from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';
import {signup}  from '../actions';
import { createClient } from '../../../utils/superbase/client';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Signup(): JSX.Element {
    const [name, setName] = useState<string>('');
    const [curLocation, setCurLocation] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const supabase = createClient();

    async function createProfile({email, name, curLocation }: {
        email: string | null
        name: string | null
        curLocation: string | null        
    }) {
        try {
            const { error } = await supabase.from('profiles').upsert({
                email, name, cur_location: curLocation });
            if (error) throw error; 
                alert('Profile created!');
        } catch (error) {
            console.log(error);
        }
    }

    const handleSignup = async () => {
        const data = { name: name, curLocation: curLocation, email: email, password: password };
        await signup(data);

        createProfile({email:email, name:name, curLocation: curLocation});
    };
    const handleGoogleSignin = () => {
        supabase.auth.signInWithOAuth({
            provider: 'google',
        });
    };
    const handleClickShowPassword = () => setShowPassword((show) => !show); 

    return (
        <ThemeProvider theme={theme}>
            <div className="pages-background">
                <Container maxWidth={false} disableGutters sx={{display: 'flex', height: 'inherit', margin: 0}}>
                    <Box component="form" sx={{ display: 'flex', width: '60%', justifyContent:'center', alignItems: 'center' }} noValidate autoComplete="off">
                        <Grid2 >
                            <Typography variant="h3" sx={{color: 'black'}}>Create New Account</Typography>
                            <Typography variant="h6" sx={{color: 'black'}}>Already registered? <Link href="/auth/signin">signin</Link></Typography>
                            <Container disableGutters sx={{width:'300px', margin:0}}>
                                <FormControl sx={{ isplay: 'block', my: 2}} variant="outlined" required fullWidth defaultValue="" >
                                    <InputLabel htmlFor="outlined-basic">Full name</InputLabel>
                                    <OutlinedInput id="outlined-basic" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                                </FormControl>
                                <FormControl sx={{ isplay: 'block', my: 2 }} variant="outlined" required fullWidth defaultValue="" >
                                    <InputLabel htmlFor="outlined-basic">Current Location</InputLabel>
                                    <OutlinedInput id="outlined-basic" label="Current Location" value={curLocation} onChange={(e) => setCurLocation(e.target.value)} />
                                </FormControl>
                                <FormControl sx={{ isplay: 'block', my: 2 }} variant="outlined" required fullWidth defaultValue="" >
                                    <InputLabel htmlFor="outlined-basic">Email</InputLabel>
                                    <OutlinedInput id="outlined-basic" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </FormControl>
                                <FormControl sx={{ isplay: 'block', my: 2 }} variant="outlined" required fullWidth defaultValue="" >
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput id="outlined-adornment-password" type={showPassword ? 'text' : 'password'} value={password} 
                                        onChange={(e) => setPassword(e.target.value)} endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton aria-label={ showPassword ? 'hide the password' : 'display the password' }
                                                onClick={handleClickShowPassword} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>}
                                        label="Password"/>                               
                                </FormControl>
                                <Button sx={{width: 100, bgcolor: 'black', borderRadius: 10, textTransform: 'none', display: 'block', my: 5}} onClick={handleSignup}>
                                    <Typography variant='body1' color='white' fontSize={20}> Sign up </Typography>
                                </Button>
                                <Button variant="contained" startIcon={<GoogleIcon />} onClick={handleGoogleSignin}
                                    sx={{backgroundColor: 'white', color: '#4285F4', textTransform: 'none',}}> Sign in with Google </Button>                           
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