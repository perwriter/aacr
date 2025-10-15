'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, GripVertical, LayoutGrid, List, Phone, Trello } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const initialStatuses = [
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

const initialProspects = [
  {
    id: '1',
    name: 'Monica Bing',
    email: 'monica.bing@example.com',
    leadSource: 'Website',
    phone: '555-5003',
    status: 'Qualified',
    lastContacted: 'Oct 1, 2025',
    followUp: true,
  },
  {
    id: '2',
    name: 'Rachel Green',
    email: 'rachel.green@example.com',
    leadSource: 'Referral',
    phone: '555-5001',
    status: 'Warm',
    lastContacted: 'Oct 1, 2025',
    followUp: true,
  },
  {
    id: '3',
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    leadSource: 'Website',
    phone: '555-7003',
    status: 'Ghosted',
    lastContacted: 'Oct 1, 2025',
    followUp: true,
  },
  {
    id: '4',
    name: 'Chandler Bing',
    email: 'chandler.bing@example.com',
    leadSource: 'Cold Call',
    phone: '555-6002',
    status: 'Hot',
    lastContacted: 'Oct 1, 2025',
    followUp: false,
  },
];

type Prospect = typeof initialProspects[0];

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

const ProspectCard = ({ prospect, onStatusChange }: { prospect: Prospect, onStatusChange: (id: string, status: string) => void }) => {
    return (
        <Card className="mb-4">
            <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-medium">{prospect.name}</p>
                        <p className="text-sm text-muted-foreground">{prospect.email}</p>
                    </div>
                     <Select value={prospect.status} onValueChange={(value) => onStatusChange(prospect.id, value)}>
                        <SelectTrigger className="w-[120px] text-xs h-8">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {initialStatuses.map(s => <SelectItem key={s} value={s}><Badge className="w-full" variant={getStatusBadgeVariant(s)}>{s}</Badge></SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="text-xs text-muted-foreground">Lead Source: {prospect.leadSource}</div>

                {prospect.followUp && (
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">Two Weeks No Contact, Follow Up Now?</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

const SortableProspectCard = ({ prospect, onStatusChange }: { prospect: Prospect, onStatusChange: (id: string, status: string) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: prospect.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ProspectCard prospect={prospect} onStatusChange={onStatusChange} />
        </div>
    )
}

const KanbanColumn = ({ status, prospects, onStatusChange }: { status: string, prospects: Prospect[], onStatusChange: (id: string, status: string) => void }) => {
    const { setNodeRef } = useSortable({ id: status });
    return (
        <div ref={setNodeRef} className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5 shrink-0">
            <Card className="bg-muted/50">
                <CardContent className="p-4">
                     <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                        <span>{status}</span>
                        <Badge variant={getStatusBadgeVariant(status)}>{prospects.length}</Badge>
                    </h3>
                    <SortableContext items={prospects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                        {prospects.map(p => <SortableProspectCard key={p.id} prospect={p} onStatusChange={onStatusChange} />)}
                    </SortableContext>
                </CardContent>
            </Card>
        </div>
    );
};


export default function ProspectsPage() {
  const [view, setView] = useState('kanban');
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [statuses, setStatuses] = useState(initialStatuses);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleStatusChange = (id: string, status: string) => {
    setProspects(prospects.map(p => p.id === id ? { ...p, status } : p));
  }
  
  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
        setActiveId(null);
        return;
    }

    if (active.id !== over.id) {
        const isColumn = statuses.includes(over.id as string);
        if (isColumn) {
            const newStatus = over.id as string;
            setProspects(prev => prev.map(p => p.id === active.id ? { ...p, status: newStatus } : p));
        } else {
            const overIsProspect = prospects.some(p => p.id === over.id);
            if (overIsProspect) {
                const activeProspect = prospects.find(p => p.id === active.id);
                const overProspect = prospects.find(p => p.id === over.id);
                if (activeProspect && overProspect && activeProspect.status === overProspect.status) {
                     setProspects((items) => {
                        const oldIndex = items.findIndex(p => p.id === active.id);
                        const newIndex = items.findIndex(p => p.id === over.id);
                        return arrayMove(items, oldIndex, newIndex);
                    });
                } else if (activeProspect && overProspect && activeProspect.status !== overProspect.status) {
                    setProspects(prev => prev.map(p => p.id === active.id ? { ...p, status: overProspect.status } : p));
                }
            } else {
                 const newStatus = over.id as string;
                 setProspects(prev => prev.map(p => p.id === active.id ? { ...p, status: newStatus } : p));
            }
        }
    }
    setActiveId(null);
  };

  const activeProspect = activeId ? prospects.find(p => p.id === activeId) : null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-headline text-3xl">Prospects</h2>
          <p className="text-muted-foreground">Manage your potential clients.</p>
        </div>

        <div className="flex justify-between items-center">
            <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline">ALL ({prospects.length})</Button>
                {initialStatuses.map((status) => (
                    <Button key={status} variant="outline">
                        {status} ({prospects.filter(p => p.status === status).length})
                    </Button>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <Button variant={view === 'kanban' ? 'default' : 'outline'} size="icon" onClick={() => setView('kanban')}><Trello/></Button>
                <Button variant={view === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setView('list')}><List/></Button>
                <Button variant={view === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setView('grid')}><LayoutGrid/></Button>
            </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd}>
            {view === 'kanban' && (
                 <div className="flex gap-4 overflow-x-auto pb-4">
                    <SortableContext items={statuses} strategy={horizontalListSortingStrategy}>
                        {statuses.map(status => (
                            <KanbanColumn 
                                key={status} 
                                status={status} 
                                prospects={prospects.filter(p => p.status === status)}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </SortableContext>
                    <DragOverlay>
                        {activeProspect ? <ProspectCard prospect={activeProspect} onStatusChange={handleStatusChange} /> : null}
                    </DragOverlay>
                </div>
            )}
        </DndContext>

        {view === 'list' && (
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
                                    <Select value={prospect.status} onValueChange={(value) => handleStatusChange(prospect.id, value)}>
                                        <SelectTrigger className="w-[120px] text-xs h-8">
                                            <Badge variant={getStatusBadgeVariant(prospect.status)}>{prospect.status}</Badge>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {initialStatuses.map(s => <SelectItem key={s} value={s}><Badge className="w-full" variant={getStatusBadgeVariant(s)}>{s}</Badge></SelectItem>)}
                                        </SelectContent>
                                    </Select>
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
        )}
        
        {view === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {prospects.map(prospect => (
                    <ProspectCard key={prospect.id} prospect={prospect} onStatusChange={handleStatusChange} />
                ))}
            </div>
        )}

      </div>
    </AppLayout>
  );
}
