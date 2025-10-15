'use client';

import { useState, useRef } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, GripVertical, LayoutGrid, List, MoreHorizontal, Phone, Trello, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const initialStatuses = [
  {id: 'NEW', title: 'NEW', color: '#8A2BE2'},
  {id: 'Prospect', title: 'Prospect', color: '#4169E1'},
  {id: 'Qualified', title: 'Qualified', color: '#3CB371'},
  {id: 'Warm', title: 'Warm', color: '#FFA500'},
  {id: 'Hot', title: 'Hot', color: '#FF4500'},
  {id: 'Canceled', title: 'Canceled', color: '#696969'},
  {id: 'Ghosted', title: 'Ghosted', color: '#A9A9A9'},
  {id: 'Hold', title: 'Hold', color: '#D2B48C'},
  {id: 'Client In Process', title: 'Client In Process', color: '#008080'},
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
    dealValue: 50000,
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
    dealValue: 75000,
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
    dealValue: 20000,
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
    dealValue: 120000,
  },
];

type Prospect = typeof initialProspects[0];

const getStatusInfo = (status: string) => {
    return initialStatuses.find(s => s.id === status) || { title: status, color: '#808080' };
}

const ProspectCard = ({ prospect, isOverlay = false, ...props }: { prospect: Prospect, isOverlay?: boolean, [key: string]: any }) => {
    const statusInfo = getStatusInfo(prospect.status);
    return (
        <Card className={`mb-4 bg-background ${isOverlay ? 'shadow-lg' : 'shadow-sm hover:shadow-md transition-shadow'}`} {...props}>
            <CardContent className="p-4 space-y-3 relative">
                <div className="absolute top-2 right-2 flex items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem>Edit Prospect</DropdownMenuItem>
                            <DropdownMenuItem>Archive Prospect</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-start gap-3">
                    <div className="space-y-1 pr-8 flex-grow">
                        <p className="font-bold text-base leading-tight truncate" title={prospect.name}>{prospect.name}</p>
                        <p className="text-sm text-muted-foreground">{prospect.email}</p>
                    </div>
                </div>
                
                <div className="text-xs text-muted-foreground">Lead Source: <span className="font-medium text-foreground">{prospect.leadSource}</span></div>

                {prospect.followUp && (
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/50 p-2 rounded-md">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-xs font-semibold">Two Weeks No Contact, Follow Up Now?</span>
                    </div>
                )}
                 <div className="flex items-center justify-between text-sm pt-2">
                    <span className="font-semibold">
                        ${prospect.dealValue?.toLocaleString()}
                    </span>
                    <Badge variant="outline" style={{ borderColor: statusInfo.color, color: statusInfo.color }}>{prospect.status}</Badge>
                </div>
            </CardContent>
        </Card>
    )
}

const SortableProspectCard = ({ prospect }: { prospect: Prospect }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: prospect.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style}>
            <div className="flex items-start">
                <div {...attributes} {...listeners} className="cursor-grab p-2 pt-4 text-muted-foreground hover:bg-accent rounded-l-md">
                    <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-grow">
                    <ProspectCard prospect={prospect} />
                </div>
            </div>
        </div>
    )
}

const KanbanColumn = ({ status, prospects }: { status: {id: string, title: string, color: string}, prospects: Prospect[]}) => {
    const { setNodeRef } = useSortable({ id: status.id });
    const totalValue = prospects.reduce((sum, p) => sum + (p.dealValue || 0), 0);

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
                        {prospects.length}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground pt-1 pb-2">
                      ${totalValue.toLocaleString()} in this stage
                    </p>
                </CardHeader>
                <CardContent className="flex-1 space-y-3 p-4 pt-2 overflow-y-auto min-h-[200px]">
                    <SortableContext items={prospects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                        {prospects.map(p => <SortableProspectCard key={p.id} prospect={p} />)}
                    </SortableContext>
                </CardContent>
            </Card>
        </div>
    );
};


export default function ProspectsPage() {
  const [view, setView] = useState('kanban');
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [statuses] = useState(initialStatuses);
  const [activeId, setActiveId] = useState<string | null>(null);
  const kanbanContainerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleStatusChange = (id: string, status: string) => {
    setProspects(prospects.map(p => p.id === id ? { ...p, status } : p));
  }
  
  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeProspect = prospects.find(p => p.id === active.id);
    if (!activeProspect) return;

    const overId = over.id as string;

    if (statuses.some(s => s.id === overId) && activeProspect.status !== overId) {
        setProspects(prev => arrayMove(prev.map(p => p.id === active.id ? { ...p, status: overId } : p), prev.findIndex(p => p.id === active.id), prev.length -1 ));
        return;
    }

    const overProspect = prospects.find(p => p.id === overId);
    if (!overProspect) return;

    if (active.id !== over.id) {
        const oldIndex = prospects.findIndex(p => p.id === active.id);
        const newIndex = prospects.findIndex(p => p.id === over.id);

        if (activeProspect.status === overProspect.status) {
            setProspects(items => arrayMove(items, oldIndex, newIndex));
        } else {
             const movedProspects = prospects.map(p => p.id === active.id ? { ...p, status: overProspect.status } : p);
             const reorderedProspects = arrayMove(movedProspects, oldIndex, newIndex);
             setProspects(reorderedProspects);
        }
    }
  };

  const activeProspect = activeId ? prospects.find(p => p.id === activeId) : null;
  
  const scrollKanban = (direction: 'left' | 'right') => {
    if (kanbanContainerRef.current) {
        const scrollAmount = direction === 'left' ? -340 : 340;
        kanbanContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl">
        <div>
          <h2 className="font-headline text-3xl">Prospects</h2>
          <p className="text-muted-foreground">Manage your potential clients.</p>
        </div>

        <div className="flex justify-between items-center">
            <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline">ALL ({prospects.length})</Button>
                {statuses.map((status) => (
                    <Button key={status.id} variant="outline">
                        {status.title} ({prospects.filter(p => p.status === status.id).length})
                    </Button>
                ))}
            </div>
            <div className="flex items-center gap-2">
                {view === 'kanban' && (
                  <>
                    <Button variant="outline" size="icon" onClick={() => scrollKanban('left')}><ChevronLeft /></Button>
                    <Button variant="outline" size="icon" onClick={() => scrollKanban('right')}><ChevronRight /></Button>
                  </>
                )}
                <Button variant={view === 'kanban' ? 'default' : 'outline'} size="icon" onClick={() => setView('kanban')}><Trello/></Button>
                <Button variant={view === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setView('list')}><List/></Button>
                <Button variant={view === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setView('grid')}><LayoutGrid/></Button>
            </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd}>
            {view === 'kanban' && (
                 <div ref={kanbanContainerRef} className="flex gap-4 pb-4 overflow-x-auto">
                    <SortableContext items={statuses.map(s => s.id)} strategy={horizontalListSortingStrategy}>
                        {statuses.map(status => (
                            <KanbanColumn 
                                key={status.id} 
                                status={status} 
                                prospects={prospects.filter(p => p.status === status.id)}
                            />
                        ))}
                    </SortableContext>
                    <DragOverlay>
                        {activeProspect ? <ProspectCard prospect={activeProspect} isOverlay /> : null}
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
                                        <SelectTrigger className="w-[130px] text-xs h-8">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
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
                    <ProspectCard key={prospect.id} prospect={prospect} />
                ))}
            </div>
        )}

      </div>
    </AppLayout>
  );
}
