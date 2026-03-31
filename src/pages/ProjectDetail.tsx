import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Clock, CheckCircle2, AlertTriangle, Users, Calendar } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { useTaskStore } from '@/store/taskStore';

const statusLabels: Record<string, { label: string; color: string }> = {
  backlog: { label: 'Backlog', color: 'text-muted-foreground' },
  todo: { label: 'To Do', color: 'text-neon-blue' },
  in_progress: { label: 'In Progress', color: 'text-neon-purple' },
  review: { label: 'Review', color: 'text-neon-cyan' },
  completed: { label: 'Completed', color: 'text-neon-green' },
};

export default function ProjectDetail() {
  const { projectName } = useParams<{ projectName: string }>();
  const tasks = useTaskStore((s) => s.tasks);
  const projects = useTaskStore((s) => s.projects);
  const setSelectedTask = useTaskStore((s) => s.setSelectedTask);

  const decodedName = decodeURIComponent(projectName || '');
  const project = projects.find((p) => p.name === decodedName);
  const projectTasks = tasks.filter((t) => t.project === decodedName);

  const completed = projectTasks.filter((t) => t.status === 'completed').length;
  const inProgress = projectTasks.filter((t) => t.status === 'in_progress').length;
  const overdue = projectTasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
  const assignees = [...new Set(projectTasks.map((t) => t.assignee))];

  if (!project) {
    return (
      <AppLayout title="Project Not Found">
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <p className="text-lg mb-4">Project not found</p>
          <Link to="/projects" className="text-primary hover:underline">← Back to projects</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={project.name}>
      <div className="mb-6">
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> All Projects
        </Link>

        {/* Project header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center font-display font-bold text-lg" style={{ backgroundColor: `${project.color}20`, color: project.color }}>
                {project.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">{project.name}</h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {assignees.length} members</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {projectTasks.length} tasks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-muted-foreground">Overall Progress</span>
              <span className="text-sm font-medium text-foreground">{project.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: project.color }}
              />
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: projectTasks.length, icon: Plus, color: project.color },
            { label: 'In Progress', value: inProgress, icon: Clock, color: 'hsl(265, 90%, 65%)' },
            { label: 'Completed', value: completed, icon: CheckCircle2, color: 'hsl(150, 80%, 50%)' },
            { label: 'Overdue', value: overdue, icon: AlertTriangle, color: 'hsl(0, 72%, 55%)' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Team */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card mb-6">
          <h3 className="font-display font-semibold text-foreground mb-3">Team Members</h3>
          <div className="flex flex-wrap gap-3">
            {assignees.map((name) => {
              const memberTasks = projectTasks.filter((t) => t.assignee === name);
              const avatar = memberTasks[0]?.assigneeAvatar || name.split(' ').map((n) => n[0]).join('');
              return (
                <div key={name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30">
                  <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-semibold">{avatar}</div>
                  <div>
                    <p className="text-sm text-foreground">{name}</p>
                    <p className="text-[11px] text-muted-foreground">{memberTasks.length} tasks</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Task list */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Tasks</h3>
          <div className="space-y-1">
            {projectTasks.map((task) => {
              const status = statusLabels[task.status];
              const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/40 cursor-pointer transition-colors group"
                >
                  <div className={`h-2 w-2 rounded-full shrink-0 ${
                    task.priority === 'critical' ? 'bg-destructive' : task.priority === 'high' ? 'bg-neon-magenta' : task.priority === 'medium' ? 'bg-neon-blue' : 'bg-muted-foreground'
                  }`} />
                  <span className="text-sm text-foreground flex-1 truncate group-hover:text-primary transition-colors">{task.title}</span>
                  <span className={`text-[11px] font-medium ${status.color}`}>{status.label}</span>
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] text-primary font-semibold">{task.assigneeAvatar}</div>
                  <span className={`text-[11px] ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
