import { motion } from 'framer-motion';
import { MessageSquare, Paperclip, Calendar } from 'lucide-react';
import { Task, useTaskStore } from '@/store/taskStore';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const priorityStyles: Record<string, { dot: string; label: string }> = {
  critical: { dot: 'bg-destructive', label: 'Critical' },
  high: { dot: 'bg-neon-magenta', label: 'High' },
  medium: { dot: 'bg-neon-blue', label: 'Medium' },
  low: { dot: 'bg-muted-foreground', label: 'Low' },
};

const labelColors: Record<string, string> = {
  design: 'bg-neon-purple/15 text-neon-purple',
  ui: 'bg-neon-cyan/15 text-neon-cyan',
  backend: 'bg-neon-blue/15 text-neon-blue',
  security: 'bg-destructive/15 text-destructive',
  docs: 'bg-neon-green/15 text-neon-green',
  devops: 'bg-neon-magenta/15 text-neon-magenta',
  automation: 'bg-neon-cyan/15 text-neon-cyan',
  ux: 'bg-neon-purple/15 text-neon-purple',
  feature: 'bg-neon-blue/15 text-neon-blue',
  mobile: 'bg-neon-magenta/15 text-neon-magenta',
  bug: 'bg-destructive/15 text-destructive',
  performance: 'bg-neon-green/15 text-neon-green',
  analytics: 'bg-neon-cyan/15 text-neon-cyan',
};

export function TaskCard({ task }: { task: Task }) {
  const setSelectedTask = useTaskStore((s) => s.setSelectedTask);
  const priority = priorityStyles[task.priority];
  const completedSubtasks = task.subtasks.filter((s) => s.done).length;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && task.status !== 'completed';
  const dueLabel = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      onClick={() => setSelectedTask(task)}
      className="glass-card cursor-pointer group"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`h-2 w-2 rounded-full ${priority.dot}`} />
        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{priority.label}</span>
      </div>

      <h4 className="text-sm font-medium text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
        {task.title}
      </h4>

      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.labels.map((label) => (
            <span key={label} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${labelColors[label] || 'bg-muted text-muted-foreground'}`}>
              {label}
            </span>
          ))}
        </div>
      )}

      {task.subtasks.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
            <span>Subtasks</span>
            <span>{completedSubtasks}/{task.subtasks.length}</span>
          </div>
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(completedSubtasks / task.subtasks.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-semibold">
            {task.assigneeAvatar}
          </div>
          <span className={`text-[11px] flex items-center gap-1 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
            <Calendar className="h-3 w-3" />
            {dueLabel}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          {task.comments > 0 && (
            <span className="flex items-center gap-0.5 text-[11px]">
              <MessageSquare className="h-3 w-3" /> {task.comments}
            </span>
          )}
          {task.attachments > 0 && (
            <span className="flex items-center gap-0.5 text-[11px]">
              <Paperclip className="h-3 w-3" /> {task.attachments}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
