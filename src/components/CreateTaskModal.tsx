import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarIcon } from 'lucide-react';
import { useTaskStore, Priority, TaskStatus } from '@/store/taskStore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const PRIORITIES: { value: Priority; label: string; dot: string }[] = [
  { value: 'critical', label: 'Critical', dot: 'bg-destructive' },
  { value: 'high', label: 'High', dot: 'bg-neon-magenta' },
  { value: 'medium', label: 'Medium', dot: 'bg-neon-blue' },
  { value: 'low', label: 'Low', dot: 'bg-muted-foreground' },
];

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
];

const ASSIGNEES = [
  { name: 'Sarah Chen', avatar: 'SC' },
  { name: 'Alex Rivera', avatar: 'AR' },
  { name: 'Maya Patel', avatar: 'MP' },
  { name: 'Jordan Lee', avatar: 'JL' },
  { name: 'Priya Sharma', avatar: 'PS' },
  { name: 'Liam Foster', avatar: 'LF' },
];

const PROJECTS = ['Platform Redesign', 'Backend API', 'DevOps'];

const ALL_LABELS = ['design', 'ui', 'backend', 'security', 'docs', 'devops', 'automation', 'ux', 'feature', 'mobile', 'bug', 'performance', 'analytics'];

export function CreateTaskModal() {
  const isOpen = useTaskStore((s) => s.isCreateModalOpen);
  const setOpen = useTaskStore((s) => s.setCreateModalOpen);
  const addTask = useTaskStore((s) => s.addTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [assigneeIdx, setAssigneeIdx] = useState(0);
  const [project, setProject] = useState(PROJECTS[0]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) => prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const assignee = ASSIGNEES[assigneeIdx];
    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      assignee: assignee.name,
      assigneeAvatar: assignee.avatar,
      project,
      labels: selectedLabels,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0],
    });
    // Reset
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('todo');
    setAssigneeIdx(0);
    setProject(PROJECTS[0]);
    setSelectedLabels([]);
    setDueDate(undefined);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-50 glass-panel max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-display font-bold text-foreground">Create New Task</h2>
                <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Title *</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title..."
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe the task..."
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                  />
                </div>

                {/* Priority & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Priority</label>
                    <div className="flex flex-wrap gap-2">
                      {PRIORITIES.map((p) => (
                        <button
                          key={p.value}
                          onClick={() => setPriority(p.value)}
                          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            priority === p.value ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground hover:bg-muted/50'
                          }`}
                        >
                          <div className={`h-2 w-2 rounded-full ${p.dot}`} />
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as TaskStatus)}
                      className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Assignee & Project */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Assignee</label>
                    <select
                      value={assigneeIdx}
                      onChange={(e) => setAssigneeIdx(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      {ASSIGNEES.map((a, i) => <option key={i} value={i}>{a.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Project</label>
                    <select
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      {PROJECTS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Due Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className={cn(
                        "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/50 border border-border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/40",
                        dueDate ? "text-foreground" : "text-muted-foreground"
                      )}>
                        <CalendarIcon className="h-4 w-4" />
                        {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-glass-border" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Labels */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Labels</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_LABELS.map((label) => (
                      <button
                        key={label}
                        onClick={() => toggleLabel(label)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                          selectedLabels.includes(label)
                            ? 'border-primary bg-primary/15 text-primary'
                            : 'border-border text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={!title.trim()}
                    className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed neon-glow"
                  >
                    Create Task
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-6 py-2.5 rounded-lg border border-border text-muted-foreground text-sm hover:bg-muted/50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
