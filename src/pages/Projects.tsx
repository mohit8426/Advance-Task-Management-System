import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderKanban, Users, Calendar, ArrowUpRight } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { useTaskStore } from '@/store/taskStore';

export default function Projects() {
  const projects = useTaskStore((s) => s.projects);
  const tasks = useTaskStore((s) => s.tasks);

  return (
    <AppLayout title="Projects">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map((project, i) => {
          const projectTasks = tasks.filter((t) => t.project === project.name);
          const completed = projectTasks.filter((t) => t.status === 'completed').length;
          const assignees = [...new Set(projectTasks.map((t) => t.assignee))];
          const upcoming = projectTasks.filter((t) => t.status !== 'completed').sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/projects/${encodeURIComponent(project.name)}`} className="block">
                <div className="glass-card group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-10 blur-3xl -translate-y-8 translate-x-8 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: project.color }} />

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center font-display font-bold text-base" style={{ backgroundColor: `${project.color}20`, color: project.color }}>
                        {project.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
                        <p className="text-[11px] text-muted-foreground">{projectTasks.length} tasks</p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-muted-foreground">Progress</span>
                      <span className="text-[11px] font-medium text-foreground">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><FolderKanban className="h-3 w-3" /> {completed}/{projectTasks.length} done</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {assignees.length} members</span>
                  </div>

                  {/* Assignee avatars */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {assignees.slice(0, 4).map((name) => {
                        const avatar = projectTasks.find((t) => t.assignee === name)?.assigneeAvatar || '';
                        return (
                          <div key={name} className="h-6 w-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-[9px] text-primary font-semibold">
                            {avatar}
                          </div>
                        );
                      })}
                      {assignees.length > 4 && (
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[9px] text-muted-foreground font-semibold">+{assignees.length - 4}</div>
                      )}
                    </div>
                    {upcoming && (
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(upcoming.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </AppLayout>
  );
}
