'use client';

import { useState, type DragEvent } from 'react';
import { hiragana, type Kana } from '@/lib/kana';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const initialColumns: Record<string, Kana[]> = {
  'column-1': [],
  'column-2': [],
  'column-3': [],
};

function KanaCard({ kana, onDragStart }: { kana: Kana, onDragStart: (e: DragEvent<HTMLDivElement>, kana: Kana) => void }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, kana)}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card className="flex h-20 w-20 flex-col items-center justify-center p-2 transition-all hover:shadow-md">
        <span className="text-3xl font-bold text-primary">{kana.kana}</span>
        <span className="text-xs text-muted-foreground">{kana.romaji}</span>
      </Card>
    </div>
  );
}

export function DndBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, kana: Kana) => {
    e.dataTransfer.setData('application/json', JSON.stringify(kana));
    setDragging(true);
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    const kanaData = e.dataTransfer.getData('application/json');
    if (kanaData) {
      const kana = JSON.parse(kanaData) as Kana;
      setColumns((prev) => ({
        ...prev,
        [columnId]: [...prev[columnId], kana],
      }));
    }
    setDragging(false);
  };

  const clearColumn = (columnId: string) => {
    setColumns(prev => ({ ...prev, [columnId]: [] }));
  };

  return (
    <div className="flex flex-col gap-8" onDragEnd={handleDragEnd}>
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-4 font-headline text-xl">Kana Palette</h3>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-4 pb-4">
              {hiragana.map((kana) => (
                <KanaCard key={kana.romaji} kana={kana} onDragStart={handleDragStart} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(columns).map(([id, kanas]) => (
          <div key={id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between rounded-t-lg bg-muted p-2">
                <h4 className="font-headline text-lg">
                {`Column ${id.split('-')[1]}`}
                </h4>
                <Button variant="ghost" size="icon" onClick={() => clearColumn(id)} aria-label="Clear column">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            <Card
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, id)}
              className={`min-h-[200px] flex-1 rounded-b-lg rounded-t-none border-2 border-dashed transition-colors ${
                dragging ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <CardContent className="flex flex-wrap gap-2 p-4">
                {kanas.length > 0 ? (
                  kanas.map((kana, index) => (
                     <div key={`${kana.romaji}-${index}`} className="cursor-grab active:cursor-grabbing">
                        <Card className="flex h-20 w-20 flex-col items-center justify-center p-2 transition-all">
                            <span className="text-3xl font-bold text-primary">{kana.kana}</span>
                            <span className="text-xs text-muted-foreground">{kana.romaji}</span>
                        </Card>
                     </div>
                  ))
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    Drop here
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
