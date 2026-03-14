import { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  value: string | number | undefined ;
  icon: LucideIcon;
  description?: string;
}

export function StatCard({ title, value, icon: Icon, description }: CardProps) {
  return (
    <div className="p-6 bg-base-100 border border-base-300 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-base-content/60 uppercase">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-base-content">{value}</p>
          {description && <p className="text-xs text-success font-medium">{description}</p>}
        </div>
        <div className="p-3 bg-base-200 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
