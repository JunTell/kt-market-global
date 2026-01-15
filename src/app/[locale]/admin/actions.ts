'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAdmin(prevState: any, formData: FormData) {
    const password = formData.get('password');

    if (password === '0000') {
        const cookieStore = await cookies();

        // Set cookie for 1 day
        cookieStore.set('admin_access', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return { success: true, message: 'Welcome back!' };
    }

    return { success: false, message: 'Invalid passcode.' };
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_access');
    redirect('/');
}
