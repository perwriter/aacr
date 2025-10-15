'use client';

import { useState, useRef, useMemo } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, GripVertical, LayoutGrid, List, MoreHorizontal, Phone, Trello, ChevronLeft, ChevronRight, User, Calendar, FileText, ChevronDown, AtSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

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
    status: 'Prospect',
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
type Status = { id: string; title: string; color: string };

const getStatusInfo = (statuses: Status[], status: string) => {
    return statuses.find(s => s.id === status) || { title: status, color: '#808080' };
}

const ProspectCard = ({ prospect, statuses, isOverlay = false, ...props }: { prospect: Prospect, statuses: Status[], isOverlay?: boolean, [key: string]: any }) => {
    const statusInfo = getStatusInfo(statuses, prospect.status);
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

const SortableProspectCard = ({ prospect, statuses }: { prospect: Prospect, statuses: Status[] }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: prospect.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style}>
            <div className="flex items-start">
                <div {...attributes} {...listeners} className="cursor-grab p-2 pt-4 text-muted-foreground hover:bg-accent rounded-l-md">
                    <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-grow">
                     <ProspectSheet prospect={prospect} statuses={statuses}>
                        <div className="cursor-pointer">
                            <ProspectCard prospect={prospect} statuses={statuses} />
                        </div>
                    </ProspectSheet>
                </div>
            </div>
        </div>
    )
}

const KanbanColumn = ({ status, prospects, statuses }: { status: Status, prospects: Prospect[], statuses: Status[]}) => {
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
                <CardContent className="flex-1 p-4 pt-2 overflow-y-auto min-h-[200px]">
                    <SortableContext items={prospects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                        {prospects.map(p => <SortableProspectCard key={p.id} prospect={p} statuses={statuses} />)}
                    </SortableContext>
                </CardContent>
            </Card>
        </div>
    );
};

const ProspectSheet = ({ prospect, statuses, children }: { prospect: Prospect, statuses: Status[], children: React.ReactNode }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-full sm:max-w-4xl overflow-y-auto p-0">
                <div className="p-6">
                    <SheetHeader className="mb-6">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="text-2xl font-bold">{prospect.name}</SheetTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        {getStatusInfo(statuses, prospect.status).title}
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Un-Assign</DropdownMenuItem>
                                    <Separator />
                                    {statuses.map(s => <DropdownMenuItem key={s.id}>{s.title}</DropdownMenuItem>)}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </SheetHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                           {/* Main content */}
                           <div>
                                <h3 className="font-semibold mb-4 text-lg">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="font-medium text-muted-foreground">Phone</span><p>{prospect.phone}</p></div>
                                    <div><span className="font-medium text-muted-foreground">Email</span><p>{prospect.email}</p></div>
                                    <div><span className="font-medium text-muted-foreground">Address</span><p>N/A</p></div>
                                    <div><span className="font-medium text-muted-foreground">Date of Birth</span><p>N/A</p></div>
                                    <div><span className="font-medium text-muted-foreground">Social Security Number</span><p>N/A</p></div>
                                    <div><span className="font-medium text-muted-foreground">Gold IRA Account Number</span><p>N/A</p></div>
                                </div>
                           </div>

                           <div>
                               <h3 className="font-semibold mb-4 text-lg">Lead Ownership</h3>
                               <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                      <Avatar>
                                        <AvatarFallback>LO</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-semibold">Lead Owner</p>
                                        <Button variant="link" className="p-0 h-auto">Takeover</Button>
                                      </div>
                                   </div>
                                    <Input placeholder="Add user..." className="max-w-xs"/>
                               </div>
                                <div className="mt-4 text-sm">
                                    <span className="font-medium text-muted-foreground">Source</span>
                                    <p>{prospect.leadSource}</p>
                                </div>
                           </div>

                           <div>
                               <h3 className="font-semibold mb-4 text-lg">Notes</h3>
                               <div className="space-y-4">
                                   <Textarea placeholder="Add a new note..." />
                                   <Button>Add Note</Button>
                                   <div className="text-sm space-y-3">
                                       <p className="text-muted-foreground">Recent Notes</p>
                                       <div className="p-3 bg-muted rounded-md">
                                           <p>NA - No Answer</p>
                                           <p className="text-xs text-muted-foreground">gabegreenofficial@gmail.com - Oct 1, 2025 12:06 AM</p>
                                       </div>
                                   </div>
                               </div>
                           </div>
                        </div>

                        <div className="space-y-8">
                           {/* Sidebar content */}
                           <div>
                                <h3 className="font-semibold mb-4 text-lg flex items-center gap-2"><Calendar className="h-5 w-5" /> Appointments (0)</h3>
                                <p className="text-sm text-muted-foreground">No appointments scheduled</p>
                           </div>
                           <Separator />
                           <div>
                                <h3 className="font-semibold mb-2 text-lg">Create Invoice</h3>
                                <div className="space-y-3">
                                    <Card className="bg-muted/50">
                                        <CardContent className="p-4">
                                            <h4 className="font-semibold">Cash Purchase</h4>
                                            <p className="text-xs text-muted-foreground mb-2">Standard cash transaction</p>
                                            <p className="text-xs font-semibold">Required Documents:</p>
                                            <ul className="text-xs list-disc pl-4 text-muted-foreground">
                                                <li>Invoice</li>
                                                <li>Transaction Agreement</li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-muted/50">
                                        <CardContent className="p-4">
                                            <h4 className="font-semibold">IRA Purchase</h4>
                                            <p className="text-xs text-muted-foreground mb-2">Individual Retirement Account</p>
                                            <p className="text-xs font-semibold">Required Documents:</p>
                                            <ul className="text-xs list-disc pl-4 text-muted-foreground">
                                                <li>Invoice</li>
                                                <li>Transaction Agreement</li>
                                                <li>AET Buy Sell Form</li>
                                                <li>AET Hold Harmless Form</li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>
                           </div>

                           <Separator />

                            <div>
                               <h3 className="font-semibold mb-4 text-lg flex items-center gap-2"><FileText className="h-5 w-5" /> Deals</h3>
                               <p className="text-sm text-muted-foreground">No signed deals yet</p>
                           </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
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
    const overIsColumn = statuses.some(s => s.id === overId);

    if (overIsColumn && activeProspect.status !== overId) {
        handleStatusChange(active.id as string, overId);
        return;
    }

    const overProspect = prospects.find(p => p.id === overId);
    if (overProspect) {
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
    } else { // dropped on a column
      const overColumnId = over.id;
      if (activeProspect.status !== overColumnId) {
        handleStatusChange(active.id as string, overColumnId as string);
      }
    }
  };

  const activeProspect = useMemo(() => {
    return activeId ? prospects.find(p => p.id === activeId) : null;
  }, [activeId, prospects]);
  
  const scrollKanban = (direction: 'left' | 'right') => {
    if (kanbanContainerRef.current) {
        const scrollAmount = direction === 'left' ? -320 : 320;
        kanbanContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-headline text-3xl">Prospects</h2>
            <p className="text-muted-foreground">Manage your potential clients.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">
                  <Calendar className="mr-2 h-4 w-4" /> Create Meeting
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Meeting</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-title">Meeting Title</Label>
                    <Input id="meeting-title" placeholder="e.g. Quarterly Review" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-date">Date</Label>
                    <Input id="meeting-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-time">Time</Label>
                    <Input id="meeting-time" type="time" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Schedule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">
                  <AtSign className="mr-2 h-4 w-4" /> Send Email
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Email</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-recipient">Recipient</Label>
                    <Input id="email-recipient" placeholder="client@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-subject">Subject</Label>
                    <Input id="email-subject" placeholder="e.g. Follow-up" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-body">Body</Label>
                    <Textarea id="email-body" placeholder="Hi there," />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Send</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4">
            <div className={`flex flex-wrap items-center gap-2 ${view === 'kanban' ? 'hidden' : ''}`}>
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
                    <Button variant="outline" size="icon" onClick={() => scrollKanban('left')} className="hidden md:inline-flex"><ChevronLeft /></Button>
                    <Button variant="outline" size="icon" onClick={() => scrollKanban('right')} className="hidden md:inline-flex"><ChevronRight /></Button>
                  </>
                )}
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
            <div
              ref={kanbanContainerRef}
              className="flex gap-4 pb-4 overflow-x-auto"
            >
              <SortableContext
                items={statuses.map((s) => s.id)}
                strategy={horizontalListSortingStrategy}
              >
                {statuses.map((status) => (
                  <KanbanColumn
                    key={status.id}
                    status={status}
                    statuses={statuses}
                    prospects={prospects.filter((p) => p.status === status.id)}
                  />
                ))}
              </SortableContext>

              <DragOverlay>
                {activeProspect ? (
                  <ProspectCard
                    prospect={activeProspect}
                    statuses={statuses}
                    isOverlay
                  />
                ) : null}
              </DragOverlay>
            </div>
          )}
        </DndContext>


        {view === 'list' && (
            <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
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
                                <ProspectSheet prospect={prospect} statuses={statuses}>
                                    <div className="font-medium cursor-pointer hover:underline">{prospect.name}</div>
                                </ProspectSheet>
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
                  </div>
                </CardContent>
            </Card>
        )}
        
        {view === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {prospects.map(prospect => (
                   <ProspectSheet key={prospect.id} prospect={prospect} statuses={statuses}>
                        <div className="cursor-pointer">
                            <ProspectCard prospect={prospect} statuses={statuses} />
                        </div>
                   </ProspectSheet>
                ))}
            </div>
        )}

      </div>
    </AppLayout>
  );
}
