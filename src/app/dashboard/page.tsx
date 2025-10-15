import Link from 'next/link';
import { ArrowRight, BookOpen, Columns, PenSquare } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/app-layout';

const features = [
  {
    title: 'Hiragana Chart',
    description: 'Explore all the basic hiragana characters.',
    href: '/hiragana',
    icon: BookOpen,
  },
  {
    title: 'Katakana Chart',
    description: 'Dive into the world of katakana for foreign words.',
    href: '/katakana',
    icon: PenSquare,
  },
  {
    title: 'Interactive Board',
    description: 'Practice by dragging and dropping kana characters.',
    href: '/board',
    icon: Columns,
  },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="grid gap-2">
          <h1 className="font-headline text-3xl md:text-4xl">Welcome to KanaFlow</h1>
          <p className="text-lg text-muted-foreground">
            Your personal space to master Japanese kana.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <span className="font-headline text-2xl">{feature.title}</span>
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <div className="flex items-center p-6 pt-0">
                <Button asChild>
                  <Link href={feature.href}>
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
