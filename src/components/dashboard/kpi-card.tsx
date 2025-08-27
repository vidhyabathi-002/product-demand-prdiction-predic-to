import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
}

export function KpiCard({ title, value, change }: KpiCardProps) {
  return (
    <Card className="animate-slide-up hover-lift bg-card shadow-card transition-smooth">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && <p className="text-xs text-primary">{change}</p>}
      </CardContent>
    </Card>
  );
}