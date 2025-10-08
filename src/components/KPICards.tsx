import { Card } from '@/components/ui/card';
import { TrendingUp, Mail, AlertCircle, CheckCircle } from 'lucide-react';

interface KPICardsProps {
  totalSent: number;
  delivered: number;
  bounces: number;
  bounceRate: number;
}

export const KPICards = ({ totalSent, delivered, bounces, bounceRate }: KPICardsProps) => {
  const kpis = [
    {
      title: 'Total Sent',
      value: totalSent.toLocaleString(),
      icon: Mail,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Delivered',
      value: delivered.toLocaleString(),
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Bounces',
      value: bounces.toLocaleString(),
      icon: AlertCircle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Bounce %',
      value: `${bounceRate.toFixed(2)}%`,
      icon: TrendingUp,
      color: bounceRate > 5 ? 'text-destructive' : 'text-info',
      bgColor: bounceRate > 5 ? 'bg-destructive/10' : 'bg-info/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="p-6 shadow-card hover:shadow-md transition-all hover:-translate-y-0.5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
