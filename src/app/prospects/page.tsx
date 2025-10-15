'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Phone } from 'lucide-react';

const statuses = [
  'ALL',
  'NEW',
  'Prospect',
  'Qualified',
  'Warm',
  'Hot',
  'Canceled',
  'Ghosted',
  'Hold',
  'Client In Process',
];

const prospects = [
  {
    name: 'Monica Bing',
    email: 'monica.bing@example.com',
    leadSource: 'Website',
    phone: '555-5003',
    status: 'Qualified',
    lastContacted: 'Oct 1, 2025',
    followUp: true,
  },
  {
    name: 'Rachel Green',
    email: 'rachel.green@example.com',
    leadSource: 'Referral',
    phone: '555-5001',
    status: 'Warm',
    lastContacted: 'Oct 1, 2025',
    followUp: true,
  },
  {
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    leadSource: 'Website',
    phone: '555-7003',
    status: 'Ghosted',
    lastContacted: 'Oct 1, 2025',
    followUp: true,
  },
  {
    name: 'Chandler Bing',
    email: 'chandler.bing@example.com',
    leadSource: 'Cold Call',
    phone: '555-6002',
    status: 'Hot',
    lastContacted: 'Oct 1, 2025',
    followUp: false,
  },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'hot':
      return 'destructive';
    case 'warm':
    case 'qualified':
      return 'default';
    case 'new':
    case 'prospect':
        return 'secondary'
    default:
      return 'outline';
  }
};


export default function ProspectsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-headline text-3xl">Prospects</h2>
          <p className="text-muted-foreground">Manage your potential clients.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
            {statuses.map((status, index) => (
                <Button key={status} variant={index === 0 ? 'default' : 'outline'}>
                {status}
                </Button>
            ))}
        </div>

        <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Showing 1-4 of 4</p>
        </div>

        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Contacted</TableHead>
                        <TableHead>Quick Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {prospects.map((prospect) => (
                        <TableRow key={prospect.email}>
                            <TableCell>
                                <div className="font-medium">{prospect.name}</div>
                                <div className="text-sm text-muted-foreground">{prospect.email}</div>
                                <div className="text-xs text-muted-foreground mt-1">Lead Source: {prospect.leadSource}</div>
                                {prospect.followUp && (
                                    <div className="mt-2 flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                                        <AlertCircle className="h-4 w-4" />
                                        <span className="text-xs font-medium">Two Weeks No Contact, Follow Up Now?</span>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="sm">
                                    <Phone className="mr-2 h-4 w-4" />
                                    {prospect.phone}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(prospect.status)}>{prospect.status}</Badge>
                            </TableCell>
                            <TableCell>{prospect.lastContacted}</TableCell>
                            <TableCell>
                                <Button variant="link" size="sm">N/A</Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
