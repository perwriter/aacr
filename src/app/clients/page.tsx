import { AppLayout } from '@/components/layout/app-layout';

export default function ClientsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-headline text-3xl">Clients</h2>
          <p className="text-muted-foreground">View and manage your existing clients.</p>
        </div>
      </div>
    </AppLayout>
  );
}
