import { cookies } from 'next/headers';
import { AdminLoginForm } from './_components/AdminLoginForm';
import { AdminDashboard } from './_components/AdminDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Access',
    description: 'Restricted Area',
};

export default function AdminPage() {
    return <AdminDashboard />;
}
