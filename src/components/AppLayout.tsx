import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ParticleBackground } from '@/components/ParticleBackground';
import { TaskDetailDrawer } from '@/components/TaskDetailDrawer';
import { CreateTaskModal } from '@/components/CreateTaskModal';
import { Bell, Search } from 'lucide-react';

export function AppLayout({ children, title }: { children: ReactNode; title: string }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative">
        <ParticleBackground />
        <AppSidebar />
        <div className="flex-1 flex flex-col relative z-10">
          <header className="h-14 flex items-center justify-between border-b border-border/50 px-4 backdrop-blur-md bg-background/40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <h1 className="text-lg font-display font-semibold text-foreground">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <Search className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
        <TaskDetailDrawer />
        <CreateTaskModal />
      </div>
    </SidebarProvider>
  );
}
