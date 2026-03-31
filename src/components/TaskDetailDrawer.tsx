import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Tag, Paperclip, MessageSquare, Clock, CheckSquare, Square } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';

const priorityLabels: Record<string, { color: string; label: string }> = {
  critical: { color: 'bg-destructive text-destructive-foreground', label: 'Critical' },
  high: { color: 'bg-neon-magenta/20 text-neon-magenta', label: 'High' },
  medium: { color: 'bg-neon-blue/20 text-neon-blue', label: 'Medium' },
  low: { color: 'bg-muted text-muted-foreground', label: 'Low' },
};

const statusLabels: Record<string, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'In Review',
  completed: 'Completed',
};

export function TaskDetailDrawer() {
  const selectedTask = useTaskStore((s) => s.selectedTask);
  const setSelectedTask = useTaskStore((s) => s.setSelectedTask);
  const toggleSubtask = useTaskStore((s) => s.toggleSubtask);

  return (
    <AnimatePresence>
      {selectedTask && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            onClick={() => setSelectedTask(null)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg z-50 glass-panel border-l border-glass-border overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${priorityLabels[selectedTask.priority].color}`}>
                      {priorityLabels[selectedTask.priority].label}
                    </span>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-primary/15 text-primary font-medium">
                      {statusLabels[selectedTask.status]}
                    </span>
                  </div>
                  <h2 className="text-xl font-display font-bold text-foreground">{selectedTask.title}</h2>
                </div>
                <button onClick={() => setSelectedTask(null)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedTask.description}</p>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass-card !p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <User className="h-3.5 w-3.5" />
                    <span className="text-[11px] uppercase tracking-wider">Assignee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-semibold">
                      {selectedTask.assigneeAvatar}
                    </div>
                    <span className="text-sm text-foreground">{selectedTask.assignee}</span>
                  </div>
                </div>
                <div className="glass-card !p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-[11px] uppercase tracking-wider">Due Date</span>
                  </div>
                  <span className="text-sm text-foreground">
                    {new Date(selectedTask.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="glass-card !p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Tag className="h-3.5 w-3.5" />
                    <span className="text-[11px] uppercase tracking-wider">Project</span>
                  </div>
                  <span className="text-sm text-foreground">{selectedTask.project}</span>
                </div>
                <div className="glass-card !p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-[11px] uppercase tracking-wider">Created</span>
                  </div>
                  <span className="text-sm text-foreground">
                    {new Date(selectedTask.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Labels */}
              {selectedTask.labels.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Labels</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.labels.map((label) => (
                      <span key={label} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtasks */}
              {selectedTask.subtasks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Subtasks ({selectedTask.subtasks.filter((s) => s.done).length}/{selectedTask.subtasks.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedTask.subtasks.map((subtask) => (
                      <button
                        key={subtask.id}
                        onClick={() => toggleSubtask(selectedTask.id, subtask.id)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                      >
                        {subtask.done ? (
                          <CheckSquare className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                          <Square className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <span className={`text-sm ${subtask.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {subtask.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-muted-foreground border-t border-border pt-4">
                <span className="flex items-center gap-1.5 text-sm">
                  <MessageSquare className="h-4 w-4" /> {selectedTask.comments} comments
                </span>
                <span className="flex items-center gap-1.5 text-sm">
                  <Paperclip className="h-4 w-4" /> {selectedTask.attachments} files
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
