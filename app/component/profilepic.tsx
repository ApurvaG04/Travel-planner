'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '../../utils/superbase/client';
import Image from 'next/image';
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useUserState } from './usercontext';

export default function ProfilePic({ uid, url, onUpload, }: {
                                      uid: string | null
                                      url: string | ''
                                      onUpload: (url: string) => void }) {
  const supabase = createClient();
  const {updatePicURL} = useUserState();
  const [localPicURL, setLocalPicURL] = useState<string | ''>(url);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setLocalPicURL(url);
        updatePicURL(url);
        console.log('downloaded picurl', localPicURL);
        
      } catch (error) {
        console.log('Error downloading image: ', error);
      }
    }

  if (url) downloadImage(url);
    
}, [url]);

  const uploadPic: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      onUpload(filePath);
      updatePicURL(localPicURL);
    } catch (error) {
      alert(error);
    } finally {
      setUploading(false);
      window.location.href = '/profile'; 
    }
  };

  return (
    <Box sx={{height: 'inherit', width: 'inherit',alignContent:'center', justifyContent:'center'}}>
      {localPicURL ? (
        <Image  src={localPicURL} alt="Profile" width='200' height='200'/>
      ) : (
        <PersonIcon color='disabled' sx={{height:'inherit', width:'inherit'}}/>
      )}
      <Box >
        <label htmlFor="single">
            <IconButton component='span' sx={{ color: 'primary.main', fontWeight: 'bold', fontSize: '1rem', 
                display: 'flex',justifyContent: 'center',alignItems: 'center',textAlign: 'center',}} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
            </IconButton>
        </label>
        <input style={{ visibility: 'hidden', position: 'absolute',}} type="file" id="single" accept="image/*" onChange={uploadPic} disabled={uploading} />
      </Box>
    </Box>
  );
}
