
import { Metadata } from 'next';
import { AdminDashboard } from './_components/AdminDashboard';

export const metadata: Metadata = {
    title: 'Admin Access',
    description: 'Restricted Area',
};

export default function AdminPage() {
    return <AdminDashboard />;
}
