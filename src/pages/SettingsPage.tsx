import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Palette, Globe, Shield, Save } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';

type SettingsTab = 'profile' | 'notifications' | 'appearance' | 'workspace' | 'security';

const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'workspace', label: 'Workspace', icon: Globe },
  { id: 'security', label: 'Security', icon: Shield },
];

function InputField({ label, value, type = 'text', placeholder }: { label: string; value: string; type?: string; placeholder?: string }) {
  const [val, setVal] = useState(value);
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
      <input value={val} onChange={(e) => setVal(e.target.value)} type={type} placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
    </div>
  );
}

function ToggleRow({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-[12px] text-muted-foreground">{description}</p>
      </div>
      <button onClick={() => setOn(!on)} className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-muted'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform ${on ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  return (
    <AppLayout title="Settings">
      <div className="flex gap-6 max-w-4xl">
        {/* Sidebar tabs */}
        <div className="w-[200px] shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    activeTab === tab.id ? 'bg-primary/15 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 glass-card">
          {activeTab === 'profile' && (
            <div>
              <h3 className="font-display font-bold text-lg text-foreground mb-6">Profile Settings</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-xl">JD</div>
                <div>
                  <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">Change avatar</button>
                  <p className="text-[11px] text-muted-foreground mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <InputField label="First Name" value="John" />
                <InputField label="Last Name" value="Doe" />
              </div>
              <div className="space-y-4 mb-6">
                <InputField label="Email" value="john@taskos.dev" type="email" />
                <InputField label="Job Title" value="Product Manager" />
                <InputField label="Timezone" value="UTC-5 (Eastern Time)" />
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors neon-glow">
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 className="font-display font-bold text-lg text-foreground mb-6">Notification Preferences</h3>
              <div className="space-y-0">
                <ToggleRow label="Task assignments" description="Get notified when a task is assigned to you" defaultOn={true} />
                <ToggleRow label="Due date reminders" description="Receive reminders before tasks are due" defaultOn={true} />
                <ToggleRow label="Comments & mentions" description="Get notified when someone comments or mentions you" defaultOn={true} />
                <ToggleRow label="Task status changes" description="Notify when tasks move between statuses" defaultOn={false} />
                <ToggleRow label="Team activity" description="Get updates about team member actions" defaultOn={false} />
                <ToggleRow label="Weekly digest" description="Receive a weekly summary of all project activity" defaultOn={true} />
                <ToggleRow label="Email notifications" description="Also send notifications via email" defaultOn={false} />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h3 className="font-display font-bold text-lg text-foreground mb-6">Appearance</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'dark', label: 'Dark', active: true },
                      { id: 'light', label: 'Light', active: false },
                      { id: 'system', label: 'System', active: false },
                    ].map((theme) => (
                      <button key={theme.id} className={`p-4 rounded-xl border text-center text-sm font-medium transition-all ${
                        theme.active ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted/50'
                      }`}>
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Accent Color</label>
                  <div className="flex gap-3">
                    {['hsl(265, 90%, 65%)', 'hsl(220, 90%, 60%)', 'hsl(190, 90%, 55%)', 'hsl(150, 80%, 50%)', 'hsl(320, 80%, 55%)', 'hsl(0, 72%, 55%)'].map((color, i) => (
                      <button key={i} className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${i === 0 ? 'border-foreground scale-110' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
                <ToggleRow label="Compact mode" description="Reduce spacing and padding for denser layouts" defaultOn={false} />
                <ToggleRow label="Animations" description="Enable smooth transitions and motion effects" defaultOn={true} />
                <ToggleRow label="Particle background" description="Show floating particle effects in the background" defaultOn={true} />
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div>
              <h3 className="font-display font-bold text-lg text-foreground mb-6">Workspace Settings</h3>
              <div className="space-y-4 mb-6">
                <InputField label="Workspace Name" value="TaskOS Workspace" />
                <InputField label="Workspace URL" value="taskos.dev/workspace" />
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Default Project View</label>
                  <select className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option>Board (Kanban)</option>
                    <option>List</option>
                    <option>Timeline</option>
                    <option>Calendar</option>
                  </select>
                </div>
                <InputField label="Default Timezone" value="UTC-5 (Eastern Time)" />
              </div>
              <div className="space-y-0">
                <ToggleRow label="Allow guest access" description="Let external users view shared boards" defaultOn={false} />
                <ToggleRow label="Auto-archive completed tasks" description="Archive tasks 30 days after completion" defaultOn={true} />
                <ToggleRow label="Task time tracking" description="Enable built-in time tracking for all tasks" defaultOn={true} />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 className="font-display font-bold text-lg text-foreground mb-6">Security</h3>
              <div className="space-y-4 mb-6">
                <InputField label="Current Password" value="" type="password" placeholder="Enter current password" />
                <InputField label="New Password" value="" type="password" placeholder="Enter new password" />
                <InputField label="Confirm Password" value="" type="password" placeholder="Confirm new password" />
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors neon-glow mb-8">
                <Save className="h-4 w-4" /> Update Password
              </button>
              <div className="space-y-0">
                <ToggleRow label="Two-factor authentication" description="Add an extra layer of security to your account" defaultOn={false} />
                <ToggleRow label="Session timeout" description="Automatically log out after 30 minutes of inactivity" defaultOn={true} />
                <ToggleRow label="Login notifications" description="Get notified of new sign-ins from unknown devices" defaultOn={true} />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
