'use client';

import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, FileText, DollarSign, BarChart, Star, List, LayoutGrid, Trello, MoreHorizontal, Phone, Mail, Calendar, ChevronDown, Edit, Archive } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


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

const initialClients = [
  {
    id: 'c1',
    name: 'David Wilson',
    deals: 10,
    email: 'david.wilson@corp.com',
    lastDeal: 'Oct 2, 2025',
    totalValue: '$916,850',
    status: 'Reviewed',
    avatar: '/avatars/01.png',
  },
  {
    id: 'c2',
    name: 'John Calendar',
    deals: 4,
    email: 'john.calendar@example.com',
    lastDeal: 'Oct 2, 2025',
    totalValue: '$46,395',
    status: 'Reviewed',
    avatar: '/avatars/02.png',
  },
  {
    id: 'c3',
    name: 'Emily Davis',
    deals: 4,
    email: 'emily.davis@startup.io',
    lastDeal: 'Sep 29, 2025',
    totalValue: '$396,494',
    status: 'Reviewed',
    avatar: '/avatars/03.png',
  },
    {
    id: 'c4',
    name: 'Sarah Miller',
    deals: 8,
    email: 'sarah.miller@example.com',
    lastDeal: 'Sep 28, 2025',
    totalValue: '$620,110',
    status: 'Needs Review',
    avatar: '/avatars/04.png',
  },
  {
    id: 'c5',
    name: 'Michael Brown',
    deals: 5,
    email: 'michael.brown@example.com',
    lastDeal: 'Sep 25, 2025',
    totalValue: '$467,895',
    status: 'Needs Review',
    avatar: '/avatars/05.png',
  },
];

type Client = typeof initialClients[0];

const statuses = [
    { id: 'Reviewed', title: 'Reviewed', color: '#3CB371' },
    { id: 'Needs Review', title: 'Needs Review', color: '#FFA500' },
];

const ClientSheet = ({ client, children }: { client: Client, children: React.ReactNode }) => (
    <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
             <SheetHeader>
                <SheetTitle className="text-2xl font-bold">{client.name}</SheetTitle>
                <p className="text-sm text-muted-foreground">{client.email}</p>
            </SheetHeader>
            <div className="py-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={client.avatar} alt={client.name} />
                        <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-2xl font-bold">{client.totalValue}</p>
                        <p className="text-sm text-muted-foreground">Total Value from {client.deals} deals</p>
                    </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> <span>{client.email}</span></div>
                    <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> <span>(555) 123-4567</span></div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> <span>Last deal: {client.lastDeal}</span></div>
                </div>
                 <Separator />
                 <div>
                    <h3 className="font-semibold mb-2">Review Status</h3>
                    {client.status === 'Reviewed' ? (
                        <div className="flex items-center gap-2 text-green-600">
                            <Star className="h-5 w-5" />
                            <span>Review collected</span>
                        </div>
                    ) : (
                        <Button variant="outline">Request Review</Button>
                    )}
                </div>
            </div>
        </SheetContent>
    </Sheet>
)


const ClientCard = ({ client, isOverlay = false }: { client: Client, isOverlay?: boolean }) => (
    <Card className={`hover:shadow-md transition-shadow ${isOverlay ? 'shadow-lg' : ''}`}>
        <ClientSheet client={client}>
            <CardContent className="p-4 grid grid-cols-1 items-center gap-4 cursor-pointer">
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
                <div className="text-left">
                <p className="text-lg font-bold">{client.totalValue}</p>
                <p className="text-xs text-muted-foreground">Total Value</p>
                </div>
                <div className="flex justify-start">
                    {client.status === 'Reviewed' ? (
                        <Badge variant="outline" className="text-green-600 border-green-600 flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            Left a Review
                        </Badge>
                    ) : (
                         <Badge variant="outline" className="text-yellow-600 border-yellow-600">Needs Review</Badge>
                    )}
                </div>
            </CardContent>
        </ClientSheet>
    </Card>
);

const SortableClientCard = ({ client }: { client: Client }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: client.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ClientCard client={client} />
        </div>
    )
}

const KanbanColumn = ({ status, clients }: { status: {id: string, title: string, color: string }, clients: Client[] }) => {
    const { setNodeRef } = useSortable({ id: status.id });

    return (
        <div ref={setNodeRef} className="w-[300px] flex-shrink-0">
            <Card className="bg-muted/50 h-full flex flex-col">
                <CardHeader className="pb-2 border-b">
                     <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <span
                          className="h-3 w-3 rounded-full inline-block"
                          style={{ backgroundColor: status.color }}
                        ></span>
                        {status.title}
                      </CardTitle>
                      <div
                        className="text-xs font-semibold text-white rounded-full px-2 py-0.5"
                        style={{ backgroundColor: status.color }}
                      >
                        {clients.length}
                      </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-4 overflow-y-auto min-h-[200px]">
                    <SortableContext items={clients.map(p => p.id)} strategy={verticalListSortingStrategy}>
                        {clients.map(p => <SortableClientCard key={p.id} client={p} />)}
                    </SortableContext>
                </CardContent>
            </Card>
        </div>
    );
};


export default function ClientsPage() {
  const [view, setView] = useState('grid');
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(useSensor(PointerSensor));

  const handleStatusChange = (id: string, status: string) => {
    setClients(clients.map(p => p.id === id ? { ...p, status } : p));
  }

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
  
    const activeClient = clients.find(p => p.id === active.id);
    if (!activeClient) return;

    const overId = over.id as string;
    const overIsColumn = statuses.some(s => s.id === overId);

    if (overIsColumn && activeClient.status !== overId) {
        handleStatusChange(active.id as string, overId);
        return;
    }
  
    const overClient = clients.find(p => p.id === overId);
    if (overClient) {
      if (active.id !== over.id) {
          const oldIndex = clients.findIndex(p => p.id === active.id);
          const newIndex = clients.findIndex(p => p.id === over.id);

          if (activeClient.status === overClient.status) {
              setClients(items => arrayMove(items, oldIndex, newIndex));
          } else {
              const movedClients = clients.map(p => p.id === active.id ? { ...p, status: overClient.status } : p);
              const reorderedClients = arrayMove(movedClients, oldIndex, newIndex);
              setClients(reorderedClients);
          }
      }
    } else { 
      const overColumnId = over.id;
      if (activeClient.status !== overColumnId) {
        handleStatusChange(active.id as string, overColumnId as string);
      }
    }
  };

  const activeClient = useMemo(() => {
    return activeId ? clients.find(p => p.id === activeId) : null;
  }, [activeId, clients]);


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

        <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
                <Button variant="default">All Clients (5)</Button>
                <Button variant="outline">Reviewed (3)</Button>
                <Button variant="outline">Needs Review (2)</Button>
            </div>
            <div className="flex items-center gap-2">
                <Button variant={view === 'kanban' ? 'default' : 'outline'} size="icon" onClick={() => setView('kanban')}><Trello/></Button>
                <Button variant={view === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setView('list')}><List/></Button>
                <Button variant={view === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setView('grid')}><LayoutGrid/></Button>
            </div>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
            {view === 'kanban' && (
                 <div className="flex gap-4 pb-4 overflow-x-auto">
                    {statuses.map(status => (
                        <KanbanColumn 
                            key={status.id} 
                            status={status} 
                            clients={clients.filter(c => c.status === status.id)}
                        />
                    ))}
                 </div>
            )}
             <DragOverlay>
                {activeClient ? <ClientCard client={activeClient} isOverlay /> : null}
            </DragOverlay>
        </DndContext>

        {view === 'list' && (
             <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Total Value</TableHead>
                            <TableHead>Deals</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map(client => (
                            <TableRow key={client.id}>
                                <TableCell>
                                     <ClientSheet client={client}>
                                        <div className="font-medium cursor-pointer hover:underline">{client.name}</div>
                                     </ClientSheet>
                                    <div className="text-sm text-muted-foreground">{client.email}</div>
                                </TableCell>
                                <TableCell>{client.totalValue}</TableCell>
                                <TableCell>{client.deals}</TableCell>
                                <TableCell>
                                     {client.status === 'Reviewed' ? (
                                        <Badge variant="outline" className="text-green-600 border-green-600">Reviewed</Badge>
                                     ) : (
                                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">Needs Review</Badge>
                                     )}
                                </TableCell>
                                <TableCell className="text-right">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600"><Archive className="mr-2 h-4 w-4" /> Archive</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </Card>
        )}

        {view === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {clients.map((client) => (
                    <ClientCard key={client.email} client={client} />
                ))}
            </div>
        )}

      </div>
    </AppLayout>
  );
}
