import { cookies } from 'next/headers';
import { AdminLoginForm } from './_components/AdminLoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Admin',
    default: 'Admin Access',
  },
  description: 'Restricted Area',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_access')?.value === 'true';

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-bg-grouped">
        <AdminLoginForm />
      </main>
    );
  }

  return <>{children}</>;
}
