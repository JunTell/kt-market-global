'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


interface ActionState {
    success: boolean;
    message: string;
}

export async function loginAdmin(prevState: ActionState, formData: FormData) {
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




import { OrderSchema } from './schema';

export async function createOrder(prevState: ActionState, formData: FormData) {
    const rawData = {
        openingDate: formData.get('openingDate'),
        shippingDate: formData.get('shippingDate'),
        deposit: formData.get('deposit'),
        depositDate: formData.get('depositDate'),
        collection: formData.get('collection'),
        accessories: formData.get('accessories'),
        termination: formData.get('termination') === 'on',
        basePlan: formData.get('basePlan'),
        changedPlan: formData.get('changedPlan'),
        combination: formData.get('combination'),
        memo: formData.get('memo'),
    };

    const validatedFields = OrderSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.issues[0].message,
        };
    }

    // Mock DB Insertion
    console.log('Inserting into DB:', validatedFields.data);

    // In a real app, use Supabase client here:
    // const cookieStore = await cookies();
    // const supabase = createServerClient(..., { cookies: { ... } });
    // const { error } = await supabase.from('orders').insert(validatedFields.data);

    // if (error) return { success: false, message: error.message };

    return { success: true, message: 'Order created successfully!' };
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_access');
    redirect('/');
}
