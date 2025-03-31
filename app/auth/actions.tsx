'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../utils/superbase/server';

export async function signin(formData: { email: string; password: string }) {
    const supabase = await createClient();

    const data = {
        email: formData.email,
        password: formData.password,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        console.log(error);
    } else {
        console.log('Signed in with superbase.');
    }
    revalidatePath('/', 'layout');
}

export async function signup(formData: { name: string; curLocation: string; email: string; password: string }) {
    const supabase = await createClient();
    const data = {
        updated_at: new Date().toISOString(),
        name: formData.name,
        cur_location: formData.curLocation,
        email: formData.email,
        password: formData.password,
    };
    console.log(data);
    const { error } = await supabase.auth.signUp(data);

    if (error) {
        console.log(error);
    } else {
        console.log('Signed up with superbase.');
    }
    revalidatePath('/', 'layout');
}
