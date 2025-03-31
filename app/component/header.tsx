'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Link from 'next/link';
import theme from './theme';
import { ThemeProvider } from '@emotion/react';
import Grid2 from '@mui/material/Grid2';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import { createClient } from '../../utils/superbase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useUserState } from './usercontext';
import Image from 'next/image';

const pages = ['Home', 'About', 'Explore'];

function Header () {
    const {picURL} = useUserState();
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
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

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElNav(event.currentTarget as HTMLElement);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElUser(event.currentTarget as HTMLElement);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    
    const handleSignout = async () => {
        try {
            await supabase.auth.signOut();
            console.log('session logged out');
            window.location.href = '/';             
            
        } catch (err) {
            console.error('Error during signout:', err);
        }
    };

  return (
    <ThemeProvider theme={theme} >
        <AppBar position="static" sx={{  bgcolor: 'primary.light'}}>
            <Container maxWidth="xl">
                <Toolbar>
                    <AirplaneTicketIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}/>
                    <Typography variant="h6" noWrap component={Link} href="/" sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace',
                        fontWeight: 700, letterSpacing: '.3rem', color: 'black', textDecoration: 'none', flexGrow: 0.5}} > 
                        TRAVEL </Typography>
                    <Box sx={{ display: { xs: 'flex', md: 'none' }}}  >
                        <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu}
                            color="inherit" sx={{color: 'black'}}>
                            <MenuIcon />
                        </IconButton>
                        <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'left', }} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} sx={{display: 'flex' }}  > 
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography component={Link} href={page==='Home'?'/':`/${page.toLowerCase()}` } sx={{ textAlign: 'center', textDecoration: 'none', color: 'black' }}>
                                        {page}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography variant="h5" noWrap component={Link} href="/" sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, flexGrow: 1,
                        fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'black', textDecoration: 'none', }}>
                        TRAVEL
                    </Typography>
                    <Box sx={{ flexGrow: 4, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                        <Button key={page} component={Link} href={page==='Home'?'/':`/${page.toLowerCase()}` } onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'black', display: 'block' }}>
                            {page}
                        </Button>
                        ))}
                    </Box>
                    {(user)? (<>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                {picURL ? (
                                    <Image  src={picURL} alt="Profile" width='50' height='50' style={{ borderRadius: '50%' }}/>
                                ) : (
                                    <Avatar alt="Remy Sharp" src="" />
                                )}
                            </IconButton>
                            </Tooltip>
                            <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right',}}
                                keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right', }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <List>
                                    <ListItemButton href='/profile'>
                                        <ListItemText primary='Profile'/>
                                    </ListItemButton>
                                    <ListItemButton>
                                        <ListItemText primary='Signout' onClick={handleSignout} />
                                    </ListItemButton>                           
                                </List>
                            </MenuItem>
                            </Menu>
                        </Box></>
                    ):( 
                        <Box sx={{ flexGrow: 0.5 }}>
                            <Grid2 container gap={1} >
                                <Grid2 size={{ xs: 6, md: 5 }} sx={{bgcolor: 'primary.main', borderRadius: 5, textAlign: 'center'}}>
                                    <Button sx={{textTransform: 'none'}} href="/auth/signup"><Typography sx={{color: 'white'}}>Signup</Typography></Button> 
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: 5 }} sx={{bgcolor: 'primary.main', borderRadius: 5, textAlign: 'center'}}>
                                    <Button sx={{textTransform: 'none'}} href="/auth/signin"><Typography sx={{color: 'white', textAlign: 'center'}}>Signin</Typography></Button>    
                                </Grid2>
                            </Grid2>
                        </Box> 
                    )}                
                </Toolbar>
            </Container>
        </AppBar>
    </ThemeProvider>
  );
}

export default Header;
