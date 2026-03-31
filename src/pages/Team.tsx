import { motion } from 'framer-motion';
import { Shield, Crown, User, Eye, Mail, FolderKanban, CheckCircle2, ListTodo, MoreHorizontal } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { useTaskStore } from '@/store/taskStore';

const roleConfig: Record<string, { icon: typeof Crown; label: string; badgeClass: string }> = {
  admin: { icon: Crown, label: 'Admin', badgeClass: 'bg-neon-purple/15 text-neon-purple' },
  manager: { icon: Shield, label: 'Manager', badgeClass: 'bg-neon-blue/15 text-neon-blue' },
  member: { icon: User, label: 'Member', badgeClass: 'bg-neon-cyan/15 text-neon-cyan' },
  viewer: { icon: Eye, label: 'Viewer', badgeClass: 'bg-muted text-muted-foreground' },
};

const statusColors: Record<string, string> = {
  online: 'bg-neon-green',
  away: 'bg-yellow-500',
  offline: 'bg-muted-foreground/40',
};

export default function Team() {
  const team = useTaskStore((s) => s.team);

  return (
    <AppLayout title="Team">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Members', value: team.length, color: 'hsl(265, 90%, 65%)' },
          { label: 'Online Now', value: team.filter((m) => m.status === 'online').length, color: 'hsl(150, 80%, 50%)' },
          { label: 'Avg. Capacity', value: `${Math.round(team.reduce((a, m) => a + m.capacity, 0) / team.length)}%`, color: 'hsl(220, 90%, 60%)' },
          { label: 'Total Tasks', value: team.reduce((a, m) => a + m.taskCount, 0), color: 'hsl(190, 90%, 55%)' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-display font-bold text-foreground mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {team.map((member, i) => {
          const role = roleConfig[member.role];
          const RoleIcon = role.icon;
          const capacityColor =
            member.capacity >= 80 ? 'bg-destructive' : member.capacity >= 50 ? 'bg-neon-blue' : 'bg-neon-green';

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="glass-card group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-display font-bold text-lg">
                      {member.avatar}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${statusColors[member.status]}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{member.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">{member.email}</span>
                    </div>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition-all">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              {/* Role badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-medium ${role.badgeClass}`}>
                  <RoleIcon className="h-3 w-3" />
                  {role.label}
                </span>
                <span className="text-[11px] text-muted-foreground capitalize">{member.status}</span>
              </div>

              {/* Task stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30">
                  <ListTodo className="h-3.5 w-3.5 text-neon-blue" />
                  <div>
                    <p className="text-xs text-muted-foreground">Active</p>
                    <p className="text-sm font-semibold text-foreground">{member.taskCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30">
                  <CheckCircle2 className="h-3.5 w-3.5 text-neon-green" />
                  <div>
                    <p className="text-xs text-muted-foreground">Done</p>
                    <p className="text-sm font-semibold text-foreground">{member.completedTasks}</p>
                  </div>
                </div>
              </div>

              {/* Capacity bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-muted-foreground">Capacity</span>
                  <span className={`text-[11px] font-medium ${
                    member.capacity >= 80 ? 'text-destructive' : 'text-muted-foreground'
                  }`}>{member.capacity}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${member.capacity}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.08 }}
                    className={`h-full rounded-full ${capacityColor}`}
                  />
                </div>
              </div>

              {/* Projects */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <FolderKanban className="h-3 w-3 text-muted-foreground" />
                {member.projects.map((p) => (
                  <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {p}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </AppLayout>
  );
}
