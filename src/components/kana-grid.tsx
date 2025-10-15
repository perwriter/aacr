import type { Kana } from '@/lib/kana';
import { Card, CardContent } from '@/components/ui/card';

type KanaGridProps = {
  kanaList: Kana[];
};

export function KanaGrid({ kanaList }: KanaGridProps) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 md:gap-4">
      {kanaList.map((kana) => (
        <Card
          key={kana.romaji}
          className="flex transform flex-col items-center justify-center p-2 transition-transform duration-200 hover:scale-105 hover:shadow-lg"
        >
          <CardContent className="flex flex-col items-center justify-center p-0">
            <span className="text-4xl font-bold text-primary md:text-5xl">
              {kana.kana}
            </span>
            <span className="mt-1 text-sm text-muted-foreground">
              {kana.romaji}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
