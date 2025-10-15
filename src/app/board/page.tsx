import { DndBoard } from '@/components/dnd-board';
import { AppLayout } from '@/components/layout/app-layout';

export default function BoardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-headline text-3xl">Interactive Board</h2>
          <p className="text-muted-foreground">Drag kana from the palette to build words or practice writing.</p>
        </div>
        <DndBoard />
      </div>
    </AppLayout>
  );
}
