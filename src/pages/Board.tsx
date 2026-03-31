import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { TaskCard } from '@/components/TaskCard';
import { useTaskStore, TaskStatus } from '@/store/taskStore';
import {
  DndContext, DragEndEvent, DragOverEvent, closestCorners,
  PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'backlog', title: 'Backlog', color: 'hsl(260, 15%, 55%)' },
  { id: 'todo', title: 'To Do', color: 'hsl(220, 90%, 60%)' },
  { id: 'in_progress', title: 'In Progress', color: 'hsl(265, 90%, 65%)' },
  { id: 'review', title: 'Review', color: 'hsl(190, 90%, 55%)' },
  { id: 'completed', title: 'Completed', color: 'hsl(150, 80%, 50%)' },
];

function Column({ id, title, color, children, count }: { id: string; title: string; color: string; children: React.ReactNode; count: number }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex-1 min-w-[260px] max-w-[320px]">
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{count}</span>
        <button className="ml-auto p-1 rounded hover:bg-muted text-muted-foreground transition-colors">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <div
        ref={setNodeRef}
        className={`space-y-3 min-h-[200px] p-2 rounded-xl transition-colors ${isOver ? 'bg-primary/5 ring-1 ring-primary/20' : ''}`}
      >
        {children}
      </div>
    </div>
  );
}

export default function Board() {
  const tasks = useTaskStore((s) => s.tasks);
  const moveTask = useTaskStore((s) => s.moveTask);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const column = columns.find((c) => c.id === overId);
    if (column) {
      moveTask(taskId, column.id);
      return;
    }

    // Check if dropped on another task - move to that task's column
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
      moveTask(taskId, overTask.status);
    }
  };

  const activeTask = tasks.find((t) => t.id === activeId);

  return (
    <AppLayout title="Board">
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-5 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <Column key={col.id} id={col.id} title={col.title} color={col.color} count={colTasks.length}>
                <SortableContext items={colTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  {colTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </SortableContext>
              </Column>
            );
          })}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="glass-card opacity-90 rotate-2 scale-105">
              <h4 className="text-sm font-medium text-foreground">{activeTask.title}</h4>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </AppLayout>
  );
}
