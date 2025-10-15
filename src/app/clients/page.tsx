'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, FileText, DollarSign, BarChart, Star } from 'lucide-react';

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const clients = [
  {
    name: 'David Wilson',
    deals: 10,
    email: 'david.wilson@corp.com',
    lastDeal: 'Oct 2, 2025',
    totalValue: '$916,850',
    reviewed: true,
    avatar: '/avatars/01.png',
  },
  {
    name: 'John Calendar',
    deals: 4,
    email: 'john.calendar@example.com',
    lastDeal: 'Oct 2, 2025',
    totalValue: '$46,395',
    reviewed: true,
    avatar: '/avatars/02.png',
  },
  {
    name: 'Emily Davis',
    deals: 4,
    email: 'emily.davis@startup.io',
    lastDeal: 'Sep 29, 2025',
    totalValue: '$396,494',
    reviewed: true,
    avatar: '/avatars/03.png',
  },
    {
    name: 'Sarah Miller',
    deals: 8,
    email: 'sarah.miller@example.com',
    lastDeal: 'Sep 28, 2025',
    totalValue: '$620,110',
    reviewed: false,
    avatar: '/avatars/04.png',
  },
  {
    name: 'Michael Brown',
    deals: 5,
    email: 'michael.brown@example.com',
    lastDeal: 'Sep 25, 2025',
    totalValue: '$467,895',
    reviewed: false,
    avatar: '/avatars/05.png',
  },
];

const ClientCard = ({ client }: { client: (typeof clients)[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={client.avatar} alt={client.name} />
            <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{client.name}</p>
            <p className="text-sm text-muted-foreground">{client.email}</p>
            <p className="text-xs text-muted-foreground">{client.deals} deals (last: {client.lastDeal})</p>
          </div>
        </div>
        <div className="text-center md:text-left">
          <p className="text-lg font-bold">{client.totalValue}</p>
          <p className="text-xs text-muted-foreground">Total Value</p>
        </div>
        <div className="flex justify-center md:justify-end">
            {client.reviewed ? (
                <div className="flex items-center gap-2 text-sm text-yellow-500">
                    <Star className="h-5 w-5" />
                    <span>Left a Review</span>
                </div>
            ) : (
                <Button variant="outline" size="sm">Request Review</Button>
            )}
        </div>
      </CardContent>
    </Card>
  );

export default function ClientsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-headline text-3xl">Clients</h2>
          <p className="text-muted-foreground">View and manage your existing clients.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Clients" value="5" description="Total Number of Clients" icon={Users} />
          <StatCard title="Total Invoices" value="31" description="Cash: 18 / IRA: 13" icon={FileText} />
          <StatCard title="Total Revenue" value="$2,445,744" description="Total Revenue All Time" icon={DollarSign} />
          <StatCard title="Avg Deal Size" value="$489,149" description="Per client average" icon={BarChart} />
        </div>

        <div className="flex items-center gap-2">
            <Button variant="default">All Clients (5)</Button>
            <Button variant="outline">Left a Review (3)</Button>
            <Button variant="outline">Has not left a review (2)</Button>
        </div>

        <div className="space-y-4">
            {clients.map((client) => (
                <ClientCard key={client.email} client={client} />
            ))}
        </div>

      </div>
    </AppLayout>
  );
}
