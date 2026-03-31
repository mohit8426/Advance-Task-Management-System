import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, MessageSquare, UserPlus, AlertTriangle, CheckCircle2, Clock, Calendar, Check, Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';

interface Notification {
  id: string;
  type: 'assignment' | 'comment' | 'due_soon' | 'overdue' | 'completed' | 'mention';
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: typeof Bell;
  iconColor: string;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'assignment', title: 'New task assigned', description: 'Sarah Chen assigned "Design new dashboard layout" to you.', time: '5 min ago', read: false, icon: UserPlus, iconColor: 'text-neon-blue' },
  { id: 'n2', type: 'comment', title: 'New comment', description: 'Alex Rivera commented on "Implement authentication flow": "JWT setup is done, moving to social login."', time: '15 min ago', read: false, icon: MessageSquare, iconColor: 'text-neon-purple' },
  { id: 'n3', type: 'due_soon', title: 'Task due tomorrow', description: '"Optimize database queries" is due on Apr 1. Don\'t forget to add indexes.', time: '1 hour ago', read: false, icon: Clock, iconColor: 'text-neon-cyan' },
  { id: 'n4', type: 'overdue', title: 'Task overdue', description: '"Set up CI/CD pipeline" was due on Mar 30 and is now overdue.', time: '3 hours ago', read: true, icon: AlertTriangle, iconColor: 'text-destructive' },
  { id: 'n5', type: 'completed', title: 'Task completed', description: 'Jordan Lee marked "Set up CI/CD pipeline" as completed.', time: '5 hours ago', read: true, icon: CheckCircle2, iconColor: 'text-neon-green' },
  { id: 'n6', type: 'mention', title: 'You were mentioned', description: 'Maya Patel mentioned you in a comment on "Write API documentation".', time: '8 hours ago', read: true, icon: MessageSquare, iconColor: 'text-neon-magenta' },
  { id: 'n7', type: 'assignment', title: 'New task assigned', description: 'You were assigned "Security audit and penetration testing" by Jordan Lee.', time: '1 day ago', read: true, icon: UserPlus, iconColor: 'text-neon-blue' },
  { id: 'n8', type: 'due_soon', title: 'Task due in 3 days', description: '"Mobile responsive fixes" is due on Apr 4. Time to start testing.', time: '1 day ago', read: true, icon: Calendar, iconColor: 'text-neon-cyan' },
  { id: 'n9', type: 'comment', title: 'New comment', description: 'Sarah Chen commented on "Create onboarding flow": "Let\'s prioritize the workspace setup wizard."', time: '2 days ago', read: true, icon: MessageSquare, iconColor: 'text-neon-purple' },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppLayout title="Notifications">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-display font-bold text-lg text-foreground">All Notifications</h2>
          {unreadCount > 0 && (
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-primary/15 text-primary font-medium">{unreadCount} unread</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors">
            <Check className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {notifications.map((notification, i) => {
          const Icon = notification.icon;
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`glass-card group flex items-start gap-4 cursor-pointer ${!notification.read ? 'border-l-2 border-l-primary' : ''}`}
              onClick={() => markRead(notification.id)}
            >
              <div className={`p-2 rounded-xl shrink-0 ${!notification.read ? 'bg-primary/15' : 'bg-muted/50'}`}>
                <Icon className={`h-4 w-4 ${notification.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notification.title}</h4>
                  {!notification.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{notification.description}</p>
                <p className="text-[11px] text-muted-foreground/60 mt-1">{notification.time}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                className="p-1.5 rounded-lg hover:bg-destructive/15 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Bell className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-lg font-display font-semibold">All caught up!</p>
            <p className="text-sm">No notifications to show.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
