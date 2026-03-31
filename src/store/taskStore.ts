import { create } from 'zustand';

export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  assigneeAvatar: string;
  project: string;
  labels: string[];
  startDate: string;
  dueDate: string;
  subtasks: { id: string; title: string; done: boolean }[];
  comments: number;
  attachments: number;
  createdAt: string;
  dependencies: string[];
  isMilestone: boolean;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  taskCount: number;
  progress: number;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  email: string;
  taskCount: number;
  completedTasks: number;
  capacity: number; // 0-100
  status: 'online' | 'away' | 'offline';
  projects: string[];
}

const SAMPLE_TEAM: TeamMember[] = [
  { id: 'tm1', name: 'Sarah Chen', avatar: 'SC', role: 'manager', email: 'sarah@taskos.dev', taskCount: 12, completedTasks: 7, capacity: 85, status: 'online', projects: ['Platform Redesign'] },
  { id: 'tm2', name: 'Alex Rivera', avatar: 'AR', role: 'member', email: 'alex@taskos.dev', taskCount: 9, completedTasks: 4, capacity: 72, status: 'online', projects: ['Backend API', 'DevOps'] },
  { id: 'tm3', name: 'Maya Patel', avatar: 'MP', role: 'member', email: 'maya@taskos.dev', taskCount: 8, completedTasks: 5, capacity: 60, status: 'away', projects: ['Platform Redesign', 'Backend API'] },
  { id: 'tm4', name: 'Jordan Lee', avatar: 'JL', role: 'admin', email: 'jordan@taskos.dev', taskCount: 6, completedTasks: 4, capacity: 45, status: 'online', projects: ['DevOps', 'Platform Redesign'] },
  { id: 'tm5', name: 'Priya Sharma', avatar: 'PS', role: 'member', email: 'priya@taskos.dev', taskCount: 5, completedTasks: 3, capacity: 50, status: 'offline', projects: ['Backend API'] },
  { id: 'tm6', name: 'Liam Foster', avatar: 'LF', role: 'viewer', email: 'liam@taskos.dev', taskCount: 2, completedTasks: 1, capacity: 20, status: 'offline', projects: ['Platform Redesign'] },
];

const SAMPLE_TASKS: Task[] = [
  {
    id: '1', title: 'Design new dashboard layout', description: 'Create wireframes and high-fidelity mockups for the new analytics dashboard. Include dark mode variants and responsive breakpoints.',
    status: 'in_progress', priority: 'high', assignee: 'Sarah Chen', assigneeAvatar: 'SC',
    project: 'Platform Redesign', labels: ['design', 'ui'], startDate: '2026-03-25', dueDate: '2026-04-03',
    subtasks: [{ id: 's1', title: 'Wireframes', done: true }, { id: 's2', title: 'Hi-fi mockups', done: false }, { id: 's3', title: 'Dark mode variants', done: false }],
    comments: 8, attachments: 3, createdAt: '2026-03-25', dependencies: [], isMilestone: false,
  },
  {
    id: '2', title: 'Implement authentication flow', description: 'Set up JWT-based auth with refresh tokens, social login (Google, GitHub), and role-based access control.',
    status: 'todo', priority: 'critical', assignee: 'Alex Rivera', assigneeAvatar: 'AR',
    project: 'Backend API', labels: ['backend', 'security'], startDate: '2026-03-28', dueDate: '2026-04-05',
    subtasks: [{ id: 's4', title: 'JWT setup', done: false }, { id: 's5', title: 'Social login', done: false }],
    comments: 5, attachments: 1, createdAt: '2026-03-26', dependencies: ['6'], isMilestone: false,
  },
  {
    id: '3', title: 'Write API documentation', description: 'Document all REST endpoints using OpenAPI spec. Include examples and error codes.',
    status: 'review', priority: 'medium', assignee: 'Maya Patel', assigneeAvatar: 'MP',
    project: 'Backend API', labels: ['docs'], startDate: '2026-03-22', dueDate: '2026-04-02',
    subtasks: [{ id: 's6', title: 'Auth endpoints', done: true }, { id: 's7', title: 'Task endpoints', done: true }, { id: 's8', title: 'Review pass', done: false }],
    comments: 3, attachments: 2, createdAt: '2026-03-22', dependencies: ['2'], isMilestone: false,
  },
  {
    id: '4', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing, linting, and deployment to staging/production.',
    status: 'completed', priority: 'high', assignee: 'Jordan Lee', assigneeAvatar: 'JL',
    project: 'DevOps', labels: ['devops', 'automation'], startDate: '2026-03-20', dueDate: '2026-03-30',
    subtasks: [{ id: 's9', title: 'Test pipeline', done: true }, { id: 's10', title: 'Deploy pipeline', done: true }],
    comments: 12, attachments: 0, createdAt: '2026-03-20', dependencies: [], isMilestone: false,
  },
  {
    id: '5', title: 'Create onboarding flow', description: 'Build a guided onboarding experience for new users with tooltips, progress tracking, and workspace setup wizard.',
    status: 'backlog', priority: 'medium', assignee: 'Sarah Chen', assigneeAvatar: 'SC',
    project: 'Platform Redesign', labels: ['ux', 'feature'], startDate: '2026-04-05', dueDate: '2026-04-10',
    subtasks: [], comments: 2, attachments: 1, createdAt: '2026-03-28', dependencies: ['1'], isMilestone: false,
  },
  {
    id: '6', title: 'Optimize database queries', description: 'Profile and optimize slow queries. Add indexes and implement connection pooling.',
    status: 'in_progress', priority: 'high', assignee: 'Alex Rivera', assigneeAvatar: 'AR',
    project: 'Backend API', labels: ['backend', 'performance'], startDate: '2026-03-24', dueDate: '2026-04-01',
    subtasks: [{ id: 's11', title: 'Profile queries', done: true }, { id: 's12', title: 'Add indexes', done: false }],
    comments: 6, attachments: 0, createdAt: '2026-03-24', dependencies: [], isMilestone: false,
  },
  {
    id: '7', title: 'Mobile responsive fixes', description: 'Fix layout issues on mobile devices. Test across iOS and Android browsers.',
    status: 'todo', priority: 'medium', assignee: 'Maya Patel', assigneeAvatar: 'MP',
    project: 'Platform Redesign', labels: ['mobile', 'bug'], startDate: '2026-04-01', dueDate: '2026-04-04',
    subtasks: [], comments: 4, attachments: 2, createdAt: '2026-03-27', dependencies: ['1'], isMilestone: false,
  },
  {
    id: '8', title: 'Implement real-time notifications', description: 'Add WebSocket-based notification system with in-app alerts and sound.',
    status: 'backlog', priority: 'low', assignee: 'Jordan Lee', assigneeAvatar: 'JL',
    project: 'Platform Redesign', labels: ['feature', 'backend'], startDate: '2026-04-10', dueDate: '2026-04-15',
    subtasks: [], comments: 1, attachments: 0, createdAt: '2026-03-29', dependencies: ['5', '2'], isMilestone: false,
  },
  {
    id: '9', title: 'Security audit and penetration testing', description: 'Conduct thorough security audit. Fix any vulnerabilities found.',
    status: 'todo', priority: 'critical', assignee: 'Alex Rivera', assigneeAvatar: 'AR',
    project: 'DevOps', labels: ['security'], startDate: '2026-04-03', dueDate: '2026-04-06',
    subtasks: [{ id: 's13', title: 'OWASP scan', done: false }, { id: 's14', title: 'Fix findings', done: false }],
    comments: 0, attachments: 0, createdAt: '2026-03-30', dependencies: ['4'], isMilestone: false,
  },
  {
    id: '10', title: 'Create analytics reporting module', description: 'Build charts and data visualizations for project metrics, team velocity, and burndown.',
    status: 'in_progress', priority: 'medium', assignee: 'Maya Patel', assigneeAvatar: 'MP',
    project: 'Platform Redesign', labels: ['feature', 'analytics'], startDate: '2026-03-23', dueDate: '2026-04-08',
    subtasks: [{ id: 's15', title: 'Chart components', done: true }, { id: 's16', title: 'Data aggregation', done: false }],
    comments: 7, attachments: 1, createdAt: '2026-03-23', dependencies: ['1'], isMilestone: false,
  },
  {
    id: '11', title: 'MVP Launch', description: 'All critical features shipped, platform ready for beta users.',
    status: 'backlog', priority: 'critical', assignee: 'Jordan Lee', assigneeAvatar: 'JL',
    project: 'Platform Redesign', labels: ['milestone'], startDate: '2026-04-15', dueDate: '2026-04-15',
    subtasks: [], comments: 0, attachments: 0, createdAt: '2026-03-30', dependencies: ['5', '8', '10'], isMilestone: true,
  },
];

const SAMPLE_PROJECTS: Project[] = [
  { id: 'p1', name: 'Platform Redesign', color: 'hsl(265, 90%, 65%)', taskCount: 6, progress: 35 },
  { id: 'p2', name: 'Backend API', color: 'hsl(220, 90%, 60%)', taskCount: 3, progress: 60 },
  { id: 'p3', name: 'DevOps', color: 'hsl(150, 80%, 50%)', taskCount: 2, progress: 75 },
];

interface TaskStore {
  tasks: Task[];
  projects: Project[];
  team: TeamMember[];
  selectedTask: Task | null;
  isCreateModalOpen: boolean;
  setSelectedTask: (task: Task | null) => void;
  setCreateModalOpen: (open: boolean) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'comments' | 'attachments' | 'createdAt' | 'subtasks' | 'dependencies' | 'isMilestone'>) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: SAMPLE_TASKS,
  projects: SAMPLE_PROJECTS,
  team: SAMPLE_TEAM,
  selectedTask: null,
  isCreateModalOpen: false,
  setSelectedTask: (task) => set({ selectedTask: task }),
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
  moveTask: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    })),
  toggleSubtask: (taskId, subtaskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, subtasks: t.subtasks.map((s) => (s.id === subtaskId ? { ...s, done: !s.done } : s)) }
          : t
      ),
    })),
  addTask: (taskData) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...taskData,
          id: String(Date.now()),
          comments: 0,
          attachments: 0,
          createdAt: new Date().toISOString().split('T')[0],
          subtasks: [],
          dependencies: [],
          isMilestone: false,
        },
      ],
    })),
}));
