import { AppLayout } from '@/components/layout/app-layout';

export default function ProspectsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-headline text-3xl">Prospects</h2>
          <p className="text-muted-foreground">Manage your potential clients.</p>
        </div>
      </div>
    </AppLayout>
  );
}
