import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  accentColor: string;
  delay?: number;
}

export function KPICard({ title, value, change, changeType = 'neutral', icon: Icon, accentColor, delay = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl -translate-y-6 translate-x-6 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: accentColor }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-display font-bold mt-1 text-foreground">{value}</p>
          {change && (
            <p className={`text-xs mt-2 font-medium ${
              changeType === 'positive' ? 'text-neon-green' : changeType === 'negative' ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${accentColor}20` }}>
          <Icon className="h-5 w-5" style={{ color: accentColor }} />
        </div>
      </div>
    </motion.div>
  );
}
