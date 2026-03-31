import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Diamond, ArrowRight } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { useTaskStore } from '@/store/taskStore';

const DAY_WIDTH = 44;
const ROW_HEIGHT = 44;
const HEADER_HEIGHT = 56;

const priorityBarColors: Record<string, string> = {
  critical: 'hsl(0, 72%, 55%)',
  high: 'hsl(320, 80%, 55%)',
  medium: 'hsl(220, 90%, 60%)',
  low: 'hsl(260, 15%, 55%)',
};

export default function Timeline() {
  const tasks = useTaskStore((s) => s.tasks);
  const setSelectedTask = useTaskStore((s) => s.setSelectedTask);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { days, startDate, taskRows } = useMemo(() => {
    const allDates = tasks.flatMap((t) => [new Date(t.startDate), new Date(t.dueDate)]);
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

    minDate.setDate(minDate.getDate() - 2);
    maxDate.setDate(maxDate.getDate() + 3);

    const dayCount = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const days: Date[] = [];
    for (let i = 0; i <= dayCount; i++) {
      const d = new Date(minDate);
      d.setDate(d.getDate() + i);
      days.push(d);
    }

    // Group tasks by project
    const grouped = new Map<string, typeof tasks>();
    tasks.forEach((t) => {
      if (!grouped.has(t.project)) grouped.set(t.project, []);
      grouped.get(t.project)!.push(t);
    });

    const taskRows: { type: 'header' | 'task'; project?: string; task?: (typeof tasks)[0] }[] = [];
    grouped.forEach((projectTasks, project) => {
      taskRows.push({ type: 'header', project });
      projectTasks.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      projectTasks.forEach((t) => taskRows.push({ type: 'task', task: t }));
    });

    return { days, startDate: minDate, taskRows };
  }, [tasks]);

  const getDayOffset = (dateStr: string) => {
    const d = new Date(dateStr);
    return Math.round((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const today = new Date();
  const todayOffset = Math.round((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Build a map of task id -> row index (for dependency arrows)
  const taskRowMap = new Map<string, number>();
  taskRows.forEach((row, i) => {
    if (row.type === 'task' && row.task) taskRowMap.set(row.task.id, i);
  });

  return (
    <AppLayout title="Timeline">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card !p-0 overflow-hidden">
        <div className="flex">
          {/* Left panel - task names */}
          <div className="w-[240px] shrink-0 border-r border-border/50 z-10 bg-card/80 backdrop-blur-sm">
            <div className="h-[56px] flex items-center px-4 border-b border-border/50">
              <span className="text-sm font-semibold text-foreground font-display">Tasks</span>
            </div>
            {taskRows.map((row, i) =>
              row.type === 'header' ? (
                <div key={`h-${i}`} className="h-[44px] flex items-center px-4 bg-muted/30 border-b border-border/30">
                  <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">{row.project}</span>
                </div>
              ) : (
                <div
                  key={row.task!.id}
                  onClick={() => setSelectedTask(row.task!)}
                  className="h-[44px] flex items-center px-4 border-b border-border/20 hover:bg-muted/30 cursor-pointer transition-colors group"
                >
                  {row.task!.isMilestone && <Diamond className="h-3 w-3 mr-2 text-neon-cyan shrink-0" />}
                  <span className="text-sm text-foreground truncate group-hover:text-primary transition-colors">{row.task!.title}</span>
                </div>
              )
            )}
          </div>

          {/* Right panel - timeline chart */}
          <div ref={scrollRef} className="flex-1 overflow-x-auto">
            <div style={{ width: days.length * DAY_WIDTH, minWidth: '100%' }}>
              {/* Date headers */}
              <div className="flex border-b border-border/50 h-[56px]">
                {days.map((day, i) => {
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  const isToday = day.toDateString() === today.toDateString();
                  return (
                    <div
                      key={i}
                      className={`flex flex-col items-center justify-center shrink-0 text-center ${
                        isToday ? 'bg-primary/10' : isWeekend ? 'bg-muted/20' : ''
                      }`}
                      style={{ width: DAY_WIDTH }}
                    >
                      <span className="text-[9px] text-muted-foreground uppercase">
                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                        {day.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Rows */}
              <div className="relative">
                {/* Today line */}
                {todayOffset >= 0 && todayOffset < days.length && (
                  <div
                    className="absolute top-0 bottom-0 w-px bg-primary/60 z-20"
                    style={{ left: todayOffset * DAY_WIDTH + DAY_WIDTH / 2 }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-primary" />
                  </div>
                )}

                {/* Dependency arrows (SVG overlay) */}
                <svg className="absolute inset-0 pointer-events-none z-10" style={{ width: days.length * DAY_WIDTH, height: taskRows.length * ROW_HEIGHT }}>
                  {taskRows.map((row) => {
                    if (row.type !== 'task' || !row.task) return null;
                    return row.task.dependencies.map((depId) => {
                      const depTask = tasks.find((t) => t.id === depId);
                      if (!depTask) return null;
                      const fromRow = taskRowMap.get(depId);
                      const toRow = taskRowMap.get(row.task!.id);
                      if (fromRow === undefined || toRow === undefined) return null;

                      const fromX = getDayOffset(depTask.dueDate) * DAY_WIDTH + DAY_WIDTH / 2;
                      const fromY = fromRow * ROW_HEIGHT + ROW_HEIGHT / 2;
                      const toX = getDayOffset(row.task!.startDate) * DAY_WIDTH + DAY_WIDTH / 2;
                      const toY = toRow * ROW_HEIGHT + ROW_HEIGHT / 2;
                      const midX = (fromX + toX) / 2;

                      return (
                        <g key={`${depId}-${row.task!.id}`}>
                          <path
                            d={`M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`}
                            fill="none"
                            stroke="hsl(265, 90%, 65%)"
                            strokeWidth="1.5"
                            strokeDasharray="4 3"
                            opacity="0.5"
                          />
                          <circle cx={toX} cy={toY} r="3" fill="hsl(265, 90%, 65%)" opacity="0.6" />
                        </g>
                      );
                    });
                  })}
                </svg>

                {taskRows.map((row, i) => {
                  if (row.type === 'header') {
                    return (
                      <div key={`hrow-${i}`} className="h-[44px] bg-muted/15 border-b border-border/20 flex">
                        {days.map((_, j) => (
                          <div key={j} className="shrink-0 border-r border-border/10" style={{ width: DAY_WIDTH }} />
                        ))}
                      </div>
                    );
                  }

                  const task = row.task!;
                  const startOff = getDayOffset(task.startDate);
                  const endOff = getDayOffset(task.dueDate);
                  const barWidth = Math.max((endOff - startOff + 1) * DAY_WIDTH - 8, DAY_WIDTH - 8);
                  const barLeft = startOff * DAY_WIDTH + 4;
                  const completedSubtasks = task.subtasks.filter((s) => s.done).length;
                  const progress = task.subtasks.length > 0 ? (completedSubtasks / task.subtasks.length) * 100 : task.status === 'completed' ? 100 : 0;

                  return (
                    <div key={task.id} className="h-[44px] relative border-b border-border/20 flex">
                      {days.map((day, j) => {
                        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                        return (
                          <div key={j} className={`shrink-0 border-r border-border/10 ${isWeekend ? 'bg-muted/10' : ''}`} style={{ width: DAY_WIDTH }} />
                        );
                      })}

                      {/* Task bar or milestone */}
                      {task.isMilestone ? (
                        <div
                          className="absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                          style={{ left: barLeft + barWidth / 2 - 8 }}
                          onClick={() => setSelectedTask(task)}
                        >
                          <Diamond className="h-5 w-5 text-neon-cyan drop-shadow-[0_0_6px_hsl(190,90%,55%)]" fill="hsl(190, 90%, 55%)" />
                        </div>
                      ) : (
                        <motion.div
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          transition={{ duration: 0.5, delay: i * 0.03 }}
                          className="absolute top-1/2 -translate-y-1/2 h-7 rounded-md cursor-pointer z-10 group/bar overflow-hidden"
                          style={{
                            left: barLeft,
                            width: barWidth,
                            backgroundColor: `${priorityBarColors[task.priority]}30`,
                            border: `1px solid ${priorityBarColors[task.priority]}50`,
                            transformOrigin: 'left',
                          }}
                          onClick={() => setSelectedTask(task)}
                        >
                          {/* Progress fill */}
                          {progress > 0 && (
                            <div
                              className="absolute inset-y-0 left-0 rounded-md opacity-40"
                              style={{ width: `${progress}%`, backgroundColor: priorityBarColors[task.priority] }}
                            />
                          )}
                          <div className="relative z-10 flex items-center h-full px-2">
                            <span className="text-[10px] font-medium text-foreground truncate">{task.title}</span>
                          </div>
                          <div
                            className="absolute inset-0 opacity-0 group-hover/bar:opacity-100 transition-opacity"
                            style={{ boxShadow: `0 0 12px ${priorityBarColors[task.priority]}40` }}
                          />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
