import { katakana } from '@/lib/kana';
import { KanaGrid } from '@/components/kana-grid';
import { AppLayout } from '@/components/layout/app-layout';

export default function KatakanaPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-headline text-3xl">Katakana Chart</h2>
          <p className="text-muted-foreground">Used for foreign words, onomatopoeia, and emphasis.</p>
        </div>
        <KanaGrid kanaList={katakana} />
      </div>
    </AppLayout>
  );
}
