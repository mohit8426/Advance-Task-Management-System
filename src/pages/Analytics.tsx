import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { useTaskStore } from '@/store/taskStore';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

const COLORS = ['hsl(265, 90%, 65%)', 'hsl(220, 90%, 60%)', 'hsl(190, 90%, 55%)', 'hsl(150, 80%, 50%)', 'hsl(0, 72%, 55%)'];

const velocityData = [
  { week: 'W1', velocity: 12 },
  { week: 'W2', velocity: 18 },
  { week: 'W3', velocity: 15 },
  { week: 'W4', velocity: 22 },
  { week: 'W5', velocity: 20 },
  { week: 'W6', velocity: 28 },
];

const burndownData = [
  { day: 'Day 1', remaining: 40, ideal: 40 },
  { day: 'Day 3', remaining: 35, ideal: 32 },
  { day: 'Day 5', remaining: 28, ideal: 24 },
  { day: 'Day 7', remaining: 22, ideal: 16 },
  { day: 'Day 9', remaining: 15, ideal: 8 },
  { day: 'Day 10', remaining: 10, ideal: 0 },
];

export default function Analytics() {
  const tasks = useTaskStore((s) => s.tasks);

  const statusData = [
    { name: 'Backlog', value: tasks.filter((t) => t.status === 'backlog').length },
    { name: 'To Do', value: tasks.filter((t) => t.status === 'todo').length },
    { name: 'In Progress', value: tasks.filter((t) => t.status === 'in_progress').length },
    { name: 'Review', value: tasks.filter((t) => t.status === 'review').length },
    { name: 'Completed', value: tasks.filter((t) => t.status === 'completed').length },
  ];

  const priorityData = [
    { name: 'Critical', value: tasks.filter((t) => t.priority === 'critical').length, color: 'hsl(0, 72%, 55%)' },
    { name: 'High', value: tasks.filter((t) => t.priority === 'high').length, color: 'hsl(320, 80%, 55%)' },
    { name: 'Medium', value: tasks.filter((t) => t.priority === 'medium').length, color: 'hsl(220, 90%, 60%)' },
    { name: 'Low', value: tasks.filter((t) => t.priority === 'low').length, color: 'hsl(260, 15%, 55%)' },
  ];

  const tooltipStyle = { background: 'hsl(260, 25%, 12%)', border: '1px solid hsl(260, 30%, 22%)', borderRadius: '8px', color: 'hsl(260, 20%, 92%)' };

  return (
    <AppLayout title="Analytics">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {statusData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                {item.name} ({item.value})
              </div>
            ))}
          </div>
        </motion.div>

        {/* Velocity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Team Velocity</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 20%, 18%)" />
              <XAxis dataKey="week" tick={{ fill: 'hsl(260, 15%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(260, 15%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="velocity" fill="hsl(265, 90%, 65%)" radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Burndown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Sprint Burndown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={burndownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 20%, 18%)" />
              <XAxis dataKey="day" tick={{ fill: 'hsl(260, 15%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(260, 15%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="ideal" stroke="hsl(260, 15%, 35%)" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="remaining" stroke="hsl(265, 90%, 65%)" strokeWidth={2} dot={{ fill: 'hsl(265, 90%, 65%)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Priority Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Priority Breakdown</h3>
          <div className="space-y-4 mt-6">
            {priorityData.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="text-sm text-muted-foreground">{item.value} tasks</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / tasks.length) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
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
