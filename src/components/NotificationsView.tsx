import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Bell, BellOff, Calendar, AlertCircle, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';

export function NotificationsView() {
  const { notifications, markNotificationAsRead, notificationPreferences, updateNotificationPreferences } = useApp();

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const notificationIcons = {
    'interview-reminder': Calendar,
    'follow-up': AlertCircle,
    'deadline': AlertCircle,
    'ai-suggestion': Sparkles,
    'reapply': RefreshCw,
  };

  const notificationColors = {
    'interview-reminder': 'bg-blue-100 text-blue-800',
    'follow-up': 'bg-yellow-100 text-yellow-800',
    'deadline': 'bg-red-100 text-red-800',
    'ai-suggestion': 'bg-purple-100 text-purple-800',
    'reapply': 'bg-green-100 text-green-800',
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return notifDate.toLocaleDateString();
    }
  };

  const renderNotification = (notification: typeof notifications[0]) => {
    const Icon = notificationIcons[notification.type];
    const isUnread = !notification.read;

    return (
      <Card
        key={notification.id}
        className={`p-3 md:p-4 ${isUnread ? 'border-l-4 border-l-primary' : ''}`}
      >
        <div className="flex items-start gap-3 md:gap-4">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notificationColors[notification.type]}`}>
            <Icon className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="truncate">{notification.title}</h4>
              {isUnread && (
                <Badge variant="default" className="flex-shrink-0">New</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(notification.date)}
            </p>
          </div>

          {isUnread && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => markNotificationAsRead(notification.id)}
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-3">
          <p className="text-sm text-muted-foreground">Unread</p>
          <p className="text-2xl mt-1">{unreadNotifications.length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl mt-1">{notifications.length}</p>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">
            All Notifications
            {unreadNotifications.length > 0 && (
              <Badge className="ml-2" variant="destructive">{unreadNotifications.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 md:space-y-4">
          {notifications.length === 0 ? (
            <Card className="p-8 md:p-12 text-center">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="mb-2">No notifications yet</h3>
              <p className="text-muted-foreground">
                You'll see notifications here when you have interview reminders and updates
              </p>
            </Card>
          ) : (
            <>
              {unreadNotifications.length > 0 && (
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <h3>Unread</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        unreadNotifications.forEach(n => markNotificationAsRead(n.id));
                      }}
                    >
                      Mark all as read
                    </Button>
                  </div>
                  {unreadNotifications.map(renderNotification)}
                </div>
              )}

              {readNotifications.length > 0 && (
                <div className="space-y-3 md:space-y-4">
                  <h3>Earlier</h3>
                  {readNotifications.map(renderNotification)}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="p-4 md:p-6">
            <h3 className="mb-6">Notification Preferences</h3>
            
            <div className="space-y-6">
              {/* Interview Reminders */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="interview-reminders" className="cursor-pointer">
                      Interview Reminders
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get notified before scheduled interviews
                    </p>
                  </div>
                  <Switch
                    id="interview-reminders"
                    checked={notificationPreferences.interviewReminders}
                    onCheckedChange={(checked) =>
                      updateNotificationPreferences({ interviewReminders: checked })
                    }
                  />
                </div>

                {notificationPreferences.interviewReminders && (
                  <div className="ml-0 space-y-2">
                    <Label htmlFor="reminder-timing">Reminder timing</Label>
                    <Select
                      value={notificationPreferences.reminderTiming.toString()}
                      onValueChange={(value) =>
                        updateNotificationPreferences({ reminderTiming: parseInt(value) })
                      }
                    >
                      <SelectTrigger id="reminder-timing">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour before</SelectItem>
                        <SelectItem value="2">2 hours before</SelectItem>
                        <SelectItem value="4">4 hours before</SelectItem>
                        <SelectItem value="24">24 hours before</SelectItem>
                        <SelectItem value="48">48 hours before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="follow-up" className="cursor-pointer">
                      Follow-up Reminders
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Reminders to follow up after interviews
                    </p>
                  </div>
                  <Switch
                    id="follow-up"
                    checked={notificationPreferences.followUpReminders}
                    onCheckedChange={(checked) =>
                      updateNotificationPreferences({ followUpReminders: checked })
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="deadline-alerts" className="cursor-pointer">
                      Application Deadline Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get notified about upcoming application deadlines
                    </p>
                  </div>
                  <Switch
                    id="deadline-alerts"
                    checked={notificationPreferences.deadlineAlerts}
                    onCheckedChange={(checked) =>
                      updateNotificationPreferences({ deadlineAlerts: checked })
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="mb-4">Delivery Methods</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notif" className="cursor-pointer">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email-notif"
                      checked={notificationPreferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        updateNotificationPreferences({ emailNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notif" className="cursor-pointer">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch
                      id="push-notif"
                      checked={notificationPreferences.pushNotifications}
                      onCheckedChange={(checked) =>
                        updateNotificationPreferences({ pushNotifications: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <Button variant="outline" className="w-full">
                  <BellOff className="w-4 h-4 mr-2" />
                  Disable All Notifications
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}