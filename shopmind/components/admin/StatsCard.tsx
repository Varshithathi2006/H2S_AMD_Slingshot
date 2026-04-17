import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export default function StatsCard({ title, value, icon, description, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("border-none shadow-sm rounded-2xl", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-white">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-400">
          {title}
        </CardTitle>
        <div className="p-2 bg-gray-50 rounded-xl text-gray-900">
            {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
        <div className="flex items-center gap-2">
            {trend && (
                <span className={cn("text-xs font-bold", trend.isUp ? "text-green-500" : "text-red-500")}>
                    {trend.isUp ? "+" : "-"}{trend.value}%
                </span>
            )}
            <p className="text-xs text-gray-400 font-medium">
                {description}
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
