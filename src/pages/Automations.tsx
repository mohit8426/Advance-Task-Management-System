import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Plus, Trash2, ArrowRight, Clock, Tag, UserPlus, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  enabled: boolean;
  icon: typeof Zap;
  runsCount: number;
  lastRun: string;
}

const SAMPLE_AUTOMATIONS: Automation[] = [
  { id: 'a1', name: 'Auto-assign by category', description: 'Automatically assign tasks to team members based on their label category.', trigger: 'Task created with label "backend"', action: 'Assign to Alex Rivera', enabled: true, icon: UserPlus, runsCount: 24, lastRun: '2 hours ago' },
  { id: 'a2', name: 'Move completed tasks', description: 'Automatically move tasks to the Completed column when all subtasks are done.', trigger: 'All subtasks completed', action: 'Move to Completed', enabled: true, icon: CheckCircle2, runsCount: 18, lastRun: '1 hour ago' },
  { id: 'a3', name: 'Due date reminder', description: 'Send a notification 24 hours before a task is due.', trigger: '24 hours before due date', action: 'Send notification to assignee', enabled: true, icon: Clock, runsCount: 45, lastRun: '30 min ago' },
  { id: 'a4', name: 'Escalate overdue tasks', description: 'Change priority to Critical and notify manager for overdue tasks.', trigger: 'Task becomes overdue', action: 'Set priority to Critical, notify manager', enabled: false, icon: AlertTriangle, runsCount: 6, lastRun: '3 days ago' },
  { id: 'a5', name: 'Auto-tag by keyword', description: 'Automatically add labels based on keywords in task title or description.', trigger: 'Task title contains "bug"', action: 'Add label "bug"', enabled: true, icon: Tag, runsCount: 12, lastRun: '5 hours ago' },
  { id: 'a6', name: 'Recurring weekly standup', description: 'Create a recurring task for weekly standup notes every Monday.', trigger: 'Every Monday at 9:00 AM', action: 'Create task "Weekly Standup Notes"', enabled: false, icon: RefreshCw, runsCount: 8, lastRun: '7 days ago' },
];

export default function Automations() {
  const [automations, setAutomations] = useState(SAMPLE_AUTOMATIONS);

  const toggleAutomation = (id: string) => {
    setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  };

  const deleteAutomation = (id: string) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
  };

  const enabledCount = automations.filter((a) => a.enabled).length;
  const totalRuns = automations.reduce((a, r) => a + r.runsCount, 0);

  return (
    <AppLayout title="Automations">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Rules', value: automations.length, color: 'hsl(265, 90%, 65%)' },
          { label: 'Active', value: enabledCount, color: 'hsl(150, 80%, 50%)' },
          { label: 'Total Runs', value: totalRuns, color: 'hsl(220, 90%, 60%)' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-display font-bold text-foreground mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Automations list */}
      <div className="space-y-4">
        {automations.map((automation, i) => {
          const Icon = automation.icon;
          return (
            <motion.div
              key={automation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className={`glass-card group ${!automation.enabled ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl shrink-0 ${automation.enabled ? 'bg-primary/15' : 'bg-muted/50'}`}>
                  <Icon className={`h-5 w-5 ${automation.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground">{automation.name}</h3>
                    {automation.enabled && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-green/15 text-neon-green font-medium">Active</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{automation.description}</p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] px-2.5 py-1 rounded-lg bg-muted/50 text-muted-foreground">{automation.trigger}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] px-2.5 py-1 rounded-lg bg-primary/10 text-primary">{automation.action}</span>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-[11px] text-muted-foreground">
                    <span>{automation.runsCount} runs</span>
                    <span>Last run: {automation.lastRun}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleAutomation(automation.id)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${automation.enabled ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform ${automation.enabled ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                  <button
                    onClick={() => deleteAutomation(automation.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/15 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </AppLayout>
  );
}
