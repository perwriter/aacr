import { hiragana } from '@/lib/kana';
import { KanaGrid } from '@/components/kana-grid';
import { AppLayout } from '@/components/layout/app-layout';

export default function HiraganaPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-headline text-3xl">Hiragana Chart</h2>
          <p className="text-muted-foreground">The basic Japanese phonetic script.</p>
        </div>
        <KanaGrid kanaList={hiragana} />
      </div>
    </AppLayout>
  );
}
