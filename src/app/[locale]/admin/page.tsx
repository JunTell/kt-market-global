import { cookies } from 'next/headers';
import { AdminLoginForm } from './_components/AdminLoginForm';
import { AdminDashboard } from './_components/AdminDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Access',
    description: 'Restricted Area',
};

export default async function AdminPage() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_access')?.value === 'true';

    if (isAdmin) {
        return <AdminDashboard />;
    }

    return <AdminLoginForm />;
}
