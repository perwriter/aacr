import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/app-layout';
import { Calendar, Users, Briefcase, TrendingUp, DollarSign } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon,
  description,
  color = 'bg-background',
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  color?: string;
}) => {
  const Icon = icon;
  return (
    <Card className={`${color} transition-shadow hover:shadow-lg`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-full bg-foreground/10 p-2">
            <Icon className="h-5 w-5 text-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const AppointmentCard = ({ title }: { title: string }) => (
  <Card className="col-span-1 lg:col-span-2">
    <CardHeader className="flex flex-row items-center justify-between">
      <div className='flex items-center gap-2'>
        <Calendar className="h-5 w-5 text-primary" />
        <CardTitle className="text-xl">{title}</CardTitle>
      </div>
      <button className="p-1 rounded-full hover:bg-muted">
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </button>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center pt-8 pb-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
            <Calendar className="h-10 w-10 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No today's appointments</p>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Live Metal Prices
                </h2>
                <p className="text-xs text-muted-foreground">Updates every 30 seconds</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <StatCard
                title="Gold"
                value="$4,196.62"
                description="Per Troy Ounce"
                icon={DollarSign}
                color="bg-yellow-100/50 dark:bg-yellow-900/30"
                />
                <StatCard
                title="Silver"
                value="$52.58"
                description="Per Troy Ounce"
                icon={DollarSign}
                color="bg-slate-200/50 dark:bg-slate-800/30"
                />
            </div>
        </div>

        <div className="space-y-4">
          <AppointmentCard title="Today's Appointments" />
        </div>

        <div className="space-y-4">
          <AppointmentCard title="Upcoming Appointments" />
        </div>

      </div>
    </AppLayout>
  );
}
