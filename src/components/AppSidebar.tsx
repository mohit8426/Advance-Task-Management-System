import { 
  LayoutDashboard, Columns3, Calendar, BarChart3, GanttChart,
  Bell, Settings, Users, Zap, Search, Plus, ChevronLeft, FolderKanban
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { useTaskStore } from '@/store/taskStore';

const mainNav = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Board', url: '/board', icon: Columns3 },
  { title: 'Timeline', url: '/timeline', icon: GanttChart },
  { title: 'Calendar', url: '/calendar', icon: Calendar },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Team', url: '/team', icon: Users },
];

const bottomNav = [
  { title: 'Automations', url: '/automations', icon: Zap },
  { title: 'Notifications', url: '/notifications', icon: Bell },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const projects = useTaskStore((s) => s.projects);
  const setCreateModalOpen = useTaskStore((s) => s.setCreateModalOpen);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center neon-glow">
                <span className="font-display font-bold text-primary-foreground text-sm">T</span>
              </div>
              <span className="font-display font-semibold text-foreground text-lg">TaskOS</span>
            </div>
          )}
          <button onClick={toggleSidebar} className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
        {!collapsed && (
          <button onClick={() => setCreateModalOpen(true)} className="mt-4 w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
            <Plus className="h-4 w-4" />
            New Task
          </button>
        )}
      </SidebarHeader>

      <SidebarContent>
        {!collapsed && (
          <div className="px-4 mb-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 text-muted-foreground text-sm">
              <Search className="h-4 w-4" />
              <span>Search tasks...</span>
              <kbd className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/60 text-[11px] uppercase tracking-wider">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                        isActive(item.url) ? 'bg-primary/15 text-primary font-medium' : 'text-sidebar-foreground hover:bg-sidebar-accent'
                      }`}
                      activeClassName="bg-primary/15 text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup>
            <div className="flex items-center justify-between px-4">
              <SidebarGroupLabel className="text-muted-foreground/60 text-[11px] uppercase tracking-wider p-0">Projects</SidebarGroupLabel>
              <Link to="/projects" className="text-[10px] text-primary hover:text-primary/80 transition-colors">View all</Link>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={`/projects/${encodeURIComponent(project.name)}`}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          location.pathname === `/projects/${encodeURIComponent(project.name)}` ? 'bg-primary/15 text-primary font-medium' : 'text-sidebar-foreground hover:bg-sidebar-accent'
                        }`}
                      >
                        <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
                        <span className="truncate">{project.name}</span>
                        <span className="ml-auto text-[11px] text-muted-foreground">{project.taskCount}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-primary/15 text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">JD</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">John Doe</p>
              <p className="text-[11px] text-muted-foreground truncate">john@taskos.dev</p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
