import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { useTaskStore } from '@/store/taskStore';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const setSelectedTask = useTaskStore((s) => s.setSelectedTask);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2)); // March 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getTasksForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter((t) => t.dueDate === dateStr);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  const priorityDot: Record<string, string> = {
    critical: 'bg-destructive',
    high: 'bg-neon-magenta',
    medium: 'bg-neon-blue',
    low: 'bg-muted-foreground',
  };

  return (
    <AppLayout title="Calendar">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-foreground">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[11px] text-muted-foreground font-medium py-2 uppercase tracking-wider">{d}</div>
          ))}
          {days.map((day, i) => {
            const dayTasks = day ? getTasksForDay(day) : [];
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            return (
              <div
                key={i}
                className={`min-h-[100px] p-2 border border-border/30 rounded-lg ${
                  day ? 'hover:bg-muted/30 transition-colors' : ''
                } ${isToday ? 'ring-1 ring-primary/40 bg-primary/5' : ''}`}
              >
                {day && (
                  <>
                    <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>{day}</span>
                    <div className="mt-1 space-y-1">
                      {dayTasks.slice(0, 3).map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTask(t)}
                          className="text-[10px] px-1.5 py-1 rounded bg-primary/10 text-foreground truncate cursor-pointer hover:bg-primary/20 transition-colors flex items-center gap-1"
                        >
                          <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${priorityDot[t.priority]}`} />
                          {t.title}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <span className="text-[10px] text-muted-foreground px-1.5">+{dayTasks.length - 3} more</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </AppLayout>
  );
}
