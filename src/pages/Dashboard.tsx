import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, Zap, FolderKanban, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { KPICard } from '@/components/KPICard';
import { useTaskStore } from '@/store/taskStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const activityData = [
  { day: 'Mon', completed: 4, created: 6 },
  { day: 'Tue', completed: 7, created: 3 },
  { day: 'Wed', completed: 5, created: 8 },
  { day: 'Thu', completed: 9, created: 4 },
  { day: 'Fri', completed: 6, created: 7 },
  { day: 'Sat', completed: 3, created: 2 },
  { day: 'Sun', completed: 2, created: 1 },
];

const teamData = [
  { name: 'Sarah', tasks: 12 },
  { name: 'Alex', tasks: 9 },
  { name: 'Maya', tasks: 8 },
  { name: 'Jordan', tasks: 6 },
];

export default function Dashboard() {
  const tasks = useTaskStore((s) => s.tasks);
  const projects = useTaskStore((s) => s.projects);
  const setSelectedTask = useTaskStore((s) => s.setSelectedTask);

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const overdue = tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const dueToday = tasks.filter((t) => {
    const d = new Date(t.dueDate);
    const today = new Date();
    return d.toDateString() === today.toDateString() && t.status !== 'completed';
  }).length;

  const upcomingTasks = [...tasks]
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <AppLayout title="Dashboard">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Total Tasks" value={tasks.length} change="+3 this week" changeType="positive" icon={Zap} accentColor="hsl(265, 90%, 65%)" delay={0} />
        <KPICard title="Completed" value={completed} change={`${Math.round((completed / tasks.length) * 100)}% rate`} changeType="positive" icon={CheckCircle2} accentColor="hsl(150, 80%, 50%)" delay={0.1} />
        <KPICard title="In Progress" value={inProgress} change={`${dueToday} due today`} changeType="neutral" icon={Clock} accentColor="hsl(220, 90%, 60%)" delay={0.2} />
        <KPICard title="Overdue" value={overdue} change="Needs attention" changeType={overdue > 0 ? 'negative' : 'neutral'} icon={AlertTriangle} accentColor="hsl(0, 72%, 55%)" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Weekly Activity</h3>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Completed</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-neon-cyan" /> Created</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(265, 90%, 65%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(265, 90%, 65%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(190, 90%, 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(190, 90%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 20%, 18%)" />
              <XAxis dataKey="day" tick={{ fill: 'hsl(260, 15%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(260, 15%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(260, 25%, 12%)', border: '1px solid hsl(260, 30%, 22%)', borderRadius: '8px', color: 'hsl(260, 20%, 92%)' }} />
              <Area type="monotone" dataKey="completed" stroke="hsl(265, 90%, 65%)" fill="url(#gradPurple)" strokeWidth={2} />
              <Area type="monotone" dataKey="created" stroke="hsl(190, 90%, 55%)" fill="url(#gradCyan)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Team Workload */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Team Workload</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={teamData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 20%, 18%)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'hsl(260, 15%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(260, 15%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip contentStyle={{ background: 'hsl(260, 25%, 12%)', border: '1px solid hsl(260, 30%, 22%)', borderRadius: '8px', color: 'hsl(260, 20%, 92%)' }} />
              <Bar dataKey="tasks" fill="hsl(265, 90%, 65%)" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Upcoming Tasks</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            {upcomingTasks.map((task) => {
              const isOverdue = new Date(task.dueDate) < new Date();
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <div className={`h-2 w-2 rounded-full shrink-0 ${
                    task.priority === 'critical' ? 'bg-destructive' : task.priority === 'high' ? 'bg-neon-magenta' : 'bg-neon-blue'
                  }`} />
                  <span className="text-sm text-foreground flex-1 truncate group-hover:text-primary transition-colors">{task.title}</span>
                  <span className="text-[11px] text-muted-foreground">{task.assigneeAvatar}</span>
                  <span className={`text-[11px] ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Projects */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Projects</h3>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: project.color }} />
                    <span className="text-sm text-foreground">{project.name}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{project.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
