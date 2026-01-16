import { AdminOrderForm } from '../../_components/AdminOrderForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Order',
  description: 'Create a new order',
};

export default function CreateOrderPage() {
  return (
    <main className="min-h-screen bg-bg-grouped">
      <AdminOrderForm />
    </main>
  );
}
