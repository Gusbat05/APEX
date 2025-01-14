"use client"

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfilePictureUpload } from "./profile-picture-upload";
import { useTheme } from "next-themes";
import { ShieldCheck, Star, HelpCircle, Bell, LogOut, Mail, MailOpen, Phone, Settings, ArrowLeft, LinkIcon, Globe, X, ExternalLink, Calendar, Check, CheckCircle, Trash2, Trash } from 'lucide-react';
import { User, CreditCard } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';
import {TooltipProvider} from "@/components/ui/tooltip";


const generateUniqueKey = (() => {
  let counter = 0;
  return (prefix: string) => `${prefix}-${counter++}`;
})()
interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
  type: 'update' | 'maintenance' | 'message'
}

// Mock user data
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  company: "Acme Inc.",
  isAdmin: true,
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'System Update',
    message: 'We have released a new version with improved features. Please refresh your browser.',
    date: '2023-06-15T10:00:00Z',
    read: false,
    type: 'update'
  },
  {
    id: '2',
    title: 'Scheduled Maintenance',
    message: 'The system will be undergoing maintenance on June 20th from 2 AM to 4 AM UTC.',
    date: '2023-06-14T15:30:00Z',
    read: true,
    type: 'maintenance'
  },
  {
    id: '3',
    title: 'New Feature Announcement',
    message: 'We\'ve added a new data visualization tool. Check it out in the Analytics section!',
    date: '2023-06-13T09:15:00Z',
    read: false,
    type: 'message'
  },
]

export const AccountMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [profileColor, setProfileColor] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'account' | 'support' | 'notifications' | 'settings'>('account')
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [openMailIcon, setOpenMailIcon] = useState<Record<string, boolean>>({});
  const [animatingButtons, setAnimatingButtons] = useState<string[]>([]);
  const [bellAnimationKey, setBellAnimationKey] = useState(0);
  const [activeTab, setActiveTab] = useState('account');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [formData, setFormData] = useState({
    name: user.name,
    company: user.company,
    email: user.email,
    password: "••••••••",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
  });
  const [editMode, setEditMode] = useState({
    name: false,
    company: false,
    email: false,
    password: false,
  });
  const [activeTabPosition, setActiveTabPosition] = useState(0);
  const router = useRouter()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const getRandomColor = () => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  useEffect(() => {
    const storedColor = localStorage.getItem('profileColor')
    if (storedColor) {
      setProfileColor(storedColor)
    } else {
      const newColor = getRandomColor()
      setProfileColor(newColor)
      localStorage.setItem('profileColor', newColor)
    }
  }, [])

  const initials = getInitials(user.name)
  const { resolvedTheme } = useTheme()

  const getHighlightColor = () => {
    switch (resolvedTheme) {
      case 'light':
        return {
          text: 'group-hover:text-blue-700',
          glow: 'group-hover:filter group-hover:drop-shadow-[0_0_0.5px_#1d4ed8]',
          fill: 'group-hover:fill-blue-700'
        }
      case 'midnight':
        return {
          text: 'group-hover:text-purple-400',
          glow: 'group-hover:filter group-hover:drop-shadow-[0_0_1px_#a78bfa]',
          fill: 'group-hover:fill-purple-400'
        }
      case 'sunset':
        return {
          text: 'group-hover:text-orange-600',
          glow: 'group-hover:filter group-hover:drop-shadow-[0_0_1px_#ea580c]',
          fill: 'group-hover:fill-orange-600'
        }
      default:
        return {
          text: 'group-hover:text-teal-400',
          glow: 'group-hover:filter group-hover:drop-shadow-[0_0_1px_#2dd4bf]',
          fill: 'group-hover:fill-teal-400'
        }
    }
  }

  const highlightColor = getHighlightColor()

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setOpenMailIcon(prev => ({ ...prev, [id]: !prev[id] }));
    setTimeout(() => setOpenMailIcon(prev => ({ ...prev, [id]: false })), 300);
  }

  const markAllAsRead = () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    setAnimatingButtons(unreadNotifications.map(n => n.id));
    setTimeout(() => {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setAnimatingButtons([]);
    }, 300);
  };

  const deleteNotification = (id: string) => {
    const notificationElement = document.getElementById(`notification-${id}`);
    if (notificationElement) {
      notificationElement.classList.add('slide-out-animation');
      setTimeout(() => {
        setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== id));
      }, 500);
    } else {
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const hideScrollbarStyle = `
  .notifications-scroll-area::-webkit-scrollbar {
    display: none;
  }
  @keyframes slideInFade {
    from {
      opacity: 0;
      transform: translateX(15%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes iconWiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

.group:hover .icon-wiggle {
  animation: iconWiggle 0.5s ease;
}
@keyframes mailOpen {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.mail-icon-open {
  animation: mailOpen 0.3s ease-in-out;
}
@keyframes trashAnimation {
  0% {
    opacity: 1;
    transform: translateX(0);
    max-height: 200px;
    margin-bottom: 16px;
  }
  50% {
    opacity: 0;
    transform: translateX(-100%);
    max-height: 200px;
    margin-bottom: 16px;
  }
  100% {
    opacity: 0;
    transform: translateX(-100%);
    max-height: 0;
    margin-bottom: 0;
  }
}

  .trash-animation {
    animation: trashAnimation 0.5s ease-out forwards;
  }
  .notification-container {
    transition: all 0.3s ease-out;
  }
  @keyframes drawIn {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes bellRing {
  0%, 100% {
    transform: rotate(0);
  }
  15%, 45%, 75% {
    transform: rotate(8deg);
  }
  30%, 60%, 90% {
    transform: rotate(-8deg);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.bell-path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: drawIn 1.5s ease-out forwards, fadeIn 1.5s ease-out forwards;
}

.bell-container {
  animation: bellRing 2s ease-in-out 1.5s;
  transform-origin: center top;
  transform-box: fill-box;
}

@keyframes slideOutAnimation {
    0% {
      opacity: 1;
      transform: translateX(0);
    }
    100% {
      opacity: 0;
      transform: translateX(-100%);
    }
  }

  @keyframes fadeOutAnimation {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .slide-out-animation {
    animation: slideOutAnimation 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards,
               fadeOutAnimation 0.5s ease-out forwards;
  }
  @keyframes expandHorizontal {
    from {
      width: 0;
      opacity: 0;
    }
    to {
      width: 100%;
      opacity: 1;
    }
  }

  .animate-expand-horizontal {
    animation: expandHorizontal 0.3s ease-out forwards;
  }
  .notifications-scroll-area {
    max-height: 500px;
    overflow-y: auto;
  }

  .notification-container {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  }

  .notification-container.show {
    opacity: 1;
    transform: translateY(0);
  }
`;

  const setSelectedNotificationAndMarkAsRead = (notification: Notification | null) => {
    if (notification && !notification.read) {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
  };

  const setActiveSectionAndAnimate = (section: 'account' | 'support' | 'notifications' | 'settings') => {
    setActiveSection(section);
    if (section === 'notifications' && notifications.length === 0) {
      setBellAnimationKey(prev => prev + 1);
    }
  };

  const clearAllMessages = () => {
    if (notifications.length === 0) return;

    const notificationElements = document.querySelectorAll('.notification-container');
    notificationElements.forEach((el, index) => {
      setTimeout(() => {
        (el as HTMLElement).style.animationDelay = `${index * 50}ms`;
        (el as HTMLElement).classList.add('slide-out-animation');
      }, index * 50);
    });

    setTimeout(() => {
      setNotifications([]);
      setBellAnimationKey(prev => prev + 1);
    }, notificationElements.length * 50 + 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'password') {
      if (value.length < 8) {
        setFormErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters long' }));
      } else if (!/[A-Z]/.test(value)) {
        setFormErrors(prev => ({ ...prev, password: 'Password must contain at least one uppercase letter' }));
      } else if (!/[a-z]/.test(value)) {
        setFormErrors(prev => ({ ...prev, password: 'Password must contain at least one lowercase letter' }));
      } else if (!/[0-9]/.test(value)) {
        setFormErrors(prev => ({ ...prev, password: 'Password must contain at least one number' }));
      } else {
        setFormErrors(prev => ({ ...prev, password: '' }));
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...formErrors };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else {
      newErrors.name = "";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
      isValid = false;
    } else {
      newErrors.company = "";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    } else {
      newErrors.email = "";
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else {
      newErrors.password = "";
    }


    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      setEditMode({ name: false, company: false, email: false, password: false });
      alert("Changes applied successfully!");
    }
  }, [formData, validateForm]);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userRole')
    // Close the dialog
    setIsOpen(false)
    // Redirect to login page
    router.push('/login')
  }

  useEffect(() => {
    if (activeSection === 'notifications') {
      const containers = document.querySelectorAll('.notification-container');
      containers.forEach((container, index) => {
        setTimeout(() => {
          container.classList.add('show');
        }, index * 50);
      });
    }
  }, [activeSection, notifications]);

  return (
      <TooltipProvider>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(true)} 
        className="w-full justify-start p-0 py-0.5 h-12 relative group hover:bg-transparent hover:text-inherit"
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profilePicture || undefined} alt={user.name} />
            <AvatarFallback className={`${profileColor} text-xs font-bold text-white`}>{initials}</AvatarFallback>
          </Avatar>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border-2 border-red-950"></span>
            </span>
          )}
        </div>
        <div className="flex flex-col items-start pl-[48px] pr-2 overflow-hidden w-full">
          <span className={`
            text-sm font-medium truncate w-full text-left
            transition-all duration-300
          `}>
            {user.name}
          </span>
          <span className={`
            text-xs text-muted-foreground truncate w-full text-left
            transition-all duration-300
          `}>
            {user.company}
          </span>
        </div>
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`sm:max-w-[425px] bg-sidebar text-sidebar-foreground data-[state=open]:bg-sidebar [&>button]:hidden transition-all duration-300 ease-in-out ${
    activeSection === 'notifications' || activeSection === 'settings' ? 'sm:max-w-[560px] sm:max-h-[720px]' : ''
  }`}>
          <DialogHeader className="mb-4">
            <DialogTitle
              className={`absolute top-[30px] left-6 transition-all duration-300 ease-in-out ${
                activeSection === 'account'
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-4'
              }`}
            >
              Account Info
            </DialogTitle>
            <DialogTitle
              className={`absolute top-6 left-6 transition-all duration-300 ease-in-out ${
                activeSection === 'support'
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              Support
            </DialogTitle>
            <DialogTitle
              className={`absolute top-6 left-6 transition-all duration-300 ease-in-out ${
                activeSection === 'settings'
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              Settings
            </DialogTitle>
            <DialogTitle
              className={`absolute top-6 left-6 transition-all duration-300 ease-in-out ${
                activeSection === 'notifications'
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              Notifications
            </DialogTitle>
          </DialogHeader>
          <div className={`relative overflow-hidden mt-6 transition-all duration-300 ease-in-out ${
  activeSection === 'notifications' || activeSection === 'settings' ? 'h-[620px]' : 'h-[300px]'
}`}>
            <div 
              className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                activeSection === 'account' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'
              }`}
            >
              <div className="flex items-center space-x-4 pb-2">
                <ProfilePictureUpload
                  key={generateUniqueKey('profile-picture-upload')} 
                  currentPicture={profilePicture}
                  onPictureChange={setProfilePicture}
                  initials={initials}
                  randomColor={profileColor || ''}
                  size="large"
                />
                <div className="flex-1 relative flex flex-col justify-center">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">{user.name}</h2>
                      <p className="text-sm text-gray-500">{user.company}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1 pb-1 pt-3"> 
                <div className="flex items-center">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  <span>Active membership</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>Member since April 2023</span>
                </div>
              </div>
              <Separator className="mb-3" /> 
              <div className="space-y-3 mt-[26px] mb-[-36px]"> {/* UPDATED MARGINS */}
                {['Notifications', 'Settings', 'Support', 'Log Out'].map((item, index) => (
                  <Button
                    key={item}
                    variant="ghost"
                    className={`w-full justify-start relative h-8 px-4 group transition-all duration-300 ease-in-out opacity-0 flex items-center ${
                      isOpen ? 'animate-slide-in' : ''
                    } ${
                      item === 'Log Out'
                        ? 'hover:bg-red-600 hover:text-white'
                        : ''
                    }`}
                    style={{
                      animationDelay: `${index * 75}ms`,
                    }}
                    onClick={() => {
                      if (item === 'Support') setActiveSectionAndAnimate('support');
                      if (item === 'Notifications') setActiveSectionAndAnimate('notifications');
                      if (item === 'Settings') setActiveSectionAndAnimate('settings');
                      if (item === 'Log Out') {
                        handleLogout();
                      }
                    }}
                  >
                    {item === 'Notifications' && (
                      <>
                        <Bell className="mr-2 h-4 w-4 icon-wiggle" strokeWidth={2.5} />
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </>
                    )}
                    {item === 'Settings' && (
                      <>
                        <Settings className="mr-2 h-4 w-4 icon-wiggle" strokeWidth={2.5} />
                        <span>Settings</span>
                      </>
                    )}
                    {item === 'Support' && (
                      <>
                        <HelpCircle className="mr-2 h-4 w-4 icon-wiggle" strokeWidth={2.5} />
                        <span>Support</span>
                      </>
                    )}
                    {item === 'Log Out' && (
                      <>
                        <LogOut className="mr-2 h-4 w-4 icon-wiggle" strokeWidth={2.5} />
                        <span>Log Out</span>
                      </>
                    )}
                  </Button>
                ))}
              </div>
            </div>
            <div 
              className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                activeSection === 'support' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
              }`}
            >
              <div className="flex flex-col justify-between h-full">
                <div className="space-y-4 pb-4"> 
                  <p className="text-sm font-medium mb-2">The Apex team is ready and willing to work with you.</p>
                  <p className="text-sm pt-1"> 
                    Encounter an error or want to request a new feature or change? Feel free to reach out and start a conversation, we welcome any and all feedback and value your voice.
                  </p>
                  <Separator className="my-1 mb-5" /> 
                  <div className="space-y-4">
                    {[
                      { icon: Mail, text: 'support@example.com' },
                      { icon: Phone, text: '+1 (555) 123-4567' },
                      { icon: Globe, text: 'Visit our website', href: 'https://example.com' }
                    ].map((item, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center group transition-all duration-300 ease-in-out opacity-0 ${
                          isOpen && activeSection === 'support' ? 'animate-slide-in' : ''
                        }`}
                        style={{
                          animationDelay: `${index * 75}ms`,
                        }}
                      >
                        <item.icon className="h-6 w-6 text-primary flex-shrink-0" />
                        {item.href ? (
                          <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm ml-5 hover:underline">
                            {item.text}
                          </a>
                        ) : (
                          <span className="text-sm ml-5">{item.text}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-secondary-foreground hover:bg-primary/10 hover:text-primary relative h-8 px-4 group transition-all duration-300 ease-in-out"
                  style={{
                    animationDelay: '225ms',
                  }}
                  onClick={() => setActiveSectionAndAnimate('account')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1 text-muted-foreground" strokeWidth={2.5} />
                  <span>Back to Account</span>
                </Button>
              </div>
            </div>
            <div 
              className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                activeSection === 'notifications' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold pl-1">
                  {notifications.length === 0
                    ? "No notifications"
                    : unreadCount === 0
                    ? "No unread messages"
                    : `${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0 || animatingButtons.length > 0 || notifications.length === 0}
                  className={`text-xs bg-sidebar border-sidebar-accent ${
                    resolvedTheme === 'light' ? 'border-gray-300' : ''
                  } ${
                    unreadCount > 0 && animatingButtons.length === 0 && notifications.length > 0
                      ? `text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`
                      : 'text-muted-foreground cursor-not-allowed'
                  } transition-colors duration-200`}
                >
                  Mark all as read
                </Button>
              </div>
              <ScrollArea className="h-[500px] notifications-scroll-area" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center" style={{ paddingTop: '132px' }}>
                    <svg
                      key={bellAnimationKey}
                      xmlns="http://www.w3.org/2000/svg"
                      width="160"
                      height="160"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={resolvedTheme === 'sunset' ? '#ea580c' : 'currentColor'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeOpacity="0.7"
                      className="mb-4 mx-auto text-gray-400 bell-container"
                    >
                      <path className="bell-path" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path className="bell-path" d="M13.73 21a2 2 0 0 1-3.46 0" />
                      <path className="bell-path" d="M2 8c0-2.2.7-4.3 2-6" />
                      <path className="bell-path" d="M22 8a10 10 0 0 0-2-6" />
                    </svg>
                    <h3 className="text-lg font-semibold mb-2 text-center">Nothing to see here</h3>
                    <p className="text-sm text-muted-foreground text-center">You're all caught up! Check back later for updates.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification, index) => (
                      <div 
                        id={`notification-${notification.id}`}
                        key={notification.id} 
                        className={`notification-container flex gap-2 bg-secondary/50 rounded-lg pl-2 pr-1 py-2 transition-all duration-300 ease-in-out ${
                          isOpen && activeSection === 'notifications' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                        style={{
                          transitionDelay: `${index * 50}ms`,
                        }}
                      >
                        <div className="flex-grow bg-sidebar py-3 px-3 rounded-md relative border border-secondary/50">
                          <h3 className="text-sm font-semibold">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(notification.date)}</p>
                          {!notification.read && (
                            <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full" />
                          )}
                        </div>
                        <div className="flex flex-col justify-center gap-1 pr-2"> 
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 flex-shrink-0 transition-colors ${
                              resolvedTheme === 'light'
                                ? 'hover:text-muted-foreground'
                                : ''
                            } ${animatingButtons.includes(notification.id) ? 'scale-110 text-green-500' : ''}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            {notification.read || openMailIcon[notification.id] || animatingButtons.includes(notification.id) ? (
                              <MailOpen className={`h-4 w-4 ${openMailIcon[notification.id] ? 'mail-icon-open' : ''}`} strokeWidth={2.5} />
                            ) : (
                              <Mail className={`h-4 w-4 ${openMailIcon[notification.id] ? 'mail-icon-open' : ''}`} strokeWidth={2.5} />
                            )}
                            <span className="sr-only">Mark as read</span>                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 flex-shrink-0transition-colors ${                              resolvedTheme === 'light'
                                ? 'hover:text-muted-foreground'
                                : ''
                            }`}
                            onClick={() => setSelectedNotificationAndMarkAsRead(notification)}
                          >
                            <ExternalLink className="h-3 w-3text-muted-foreground" strokeWidth={2.5} />
                            <span className="sr-only">Open message</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 p0 textmuted-foregroundhover:bg-primary/10 flex-shrink-0 transition-colors ${
                              resolvedTheme === 'light'
                                ? 'hover:text-muted-foreground'
                                : ''
                            }`}
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
                            <span className="sr-only">Delete message</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="space-y-2 mt-[-13px]">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-secondaryforeground relative h-8 px-4 group transition-all duration-300 ease-in-out ${
                    notifications.length === 0
                      ? 'text-muted-foreground cursor-not-allowed hover:bg-transparenthover:text-muted-foreground opacity-50'
                      : 'hover:bg-red-600 hover:text-white'
                  }`}
                  onClick={clearAllMessages}                  disabled={notifications.length ===0}
                >
                  <Trash className={`mr-2 h-4 w-4 icon-wiggle ${notifications.length === 0 ? 'opacity-50' : ''} text-muted-foreground group-hover:text-inherit`} strokeWidth={2.5} />
                  <span className={notifications.length === 0 ? 'opacity-50' : ''}>Clear All Messages</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-secondary-foreground hover:bg-primary/10 hover:text-primary relative h-8 px-4 group transition-all duration-300 ease-in-out"
                  onClick={() =>setActiveSectionAndAnimate('account')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1 text-muted-foreground" strokeWidth={2.5} />
                  <span>Back to Account</span>
                </Button>
              </div>
            </div>
            <div 
              className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                activeSection === 'settings' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
              }`}
            >
              <div className="flex flex-col justify-between h-full">
                <div className="space-y-4 pb-4">
                  <div className="flex justify-center mb-4 relative h-8 overflow-hidden">
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                        slideDirection === 'left' ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-5 h-5 text-muted-foreground" strokeWidth={2.5} />
                        <h3 className="text-lg font-semibold">Payout Settings</h3>
                      </div>
                    </div>
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                        slideDirection === 'right' ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-muted-foreground" strokeWidth={2.5} />
                        <h3 className="text-lg font-semibold">Account Settings</h3>
                      </div>
                    </div>
                  </div>
                  <Tabs 
                    defaultValue="account" 
                    className="w-full tabs-content relative"
                    onValueChange={(value) => {
                      setSlideDirection(value === 'account' ? 'left' : 'right');
                      setActiveTab(value);
                      setActiveTabPosition(value === 'account' ? 0 : 1);
                    }}
                  >
                    <TabsList className="grid w-full grid-cols-2 tabs-list bg-transparent relative">
                      <div
                        className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
                        style={{
                          left: `${activeTabPosition * 50}%`,
                          width: '50%',
                        }}
                      />
                      <TabsTrigger 
                        value="account" 
                        className="data-[state=active]:bg-sidebar data-[state=active]:text-sidebar-foreground tabs-trigger relative z-10"
                      >
                        Account
                      </TabsTrigger>
                      <TabsTrigger 
                        value="payout" 
                        className="data-[state=active]:bg-sidebar data-[state=active]:text-sidebar-foreground tabs-trigger relative z-10"
                      >
                        Payout
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="account" className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                          {['name', 'company', 'email', 'password'].map((field) => (
                            <div key={field} className="flex flex-col space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={field} className="text-sm font-medium">
                                  {field.charAt(0).toUpperCase() + field.slice(1)}
                                </Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (editMode[field] && field === 'password') {
                                      console.log('New password:', formData.password);
                                      setFormData(prev => ({ ...prev, password: '••••••••' }));
                                    }
                                    setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
                                  }}
                                  className="bg-sidebar text-sidebar-foreground border-sidebar-accent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                >
                                  {editMode[field] ? 'Save' : 'Edit'}
                                </Button>
                              </div>
                              <div className="relative h-9">
                                {editMode[field] ? (
                                  <Input
                                    id={field}
                                    name={field}
                                    type={field === 'password' ? 'password' : 'text'}
                                    value={formData[field]}
                                    onChange={handleInputChange}
                                    className={`w-full h-9 pr-20 animate-expand-horizontal bg-sidebar/80 text-sidebar-foreground border-sidebar-accent/50 focus:border-sidebar-accent focus:bg-sidebar ${
                                      field === 'password' ? 'font-mono' : ''
                                    } placeholder-sidebar-foreground/50`}
                                  />
                                ) : (
                                  <p className="h-9 flex items-center">
                                    {field === 'password' ? '••••••••' : formData[field]}
                                  </p>
                                )}
                              </div>
                              {formErrors[field] && (
                                <p className="text-red-500 text-sm mt-1 animate-expand-horizontal">
                                  {formErrors[field]}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </form>
                    </TabsContent>
                    <TabsContent value="payout" className="mt-4">
                      {/* Payout settings content */}
                      <p>Payout settings will be implemented here.</p>
                    </TabsContent>
                  </Tabs>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-secondary-foreground hover:bg-primary/10 hover:text-primary relative h-8 px-4 group transition-all duration-300 ease-in-out"
                  style={{
                    animationDelay: '375ms',
                  }}
                  onClick={() => setActiveSectionAndAnimate('account')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1 text-muted-foreground" strokeWidth={2.5} />
                  <span>Back to Account</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!selectedNotification} onOpenChange={(open) => {
        if (!open) setSelectedNotificationAndMarkAsRead(null);
      }}>
        <DialogContent className="sm:max-w-[425px] bg-sidebar text-sidebar-foreground">
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">{selectedNotification?.message}</p>
            <p className="text-xs text-muted-foreground">{selectedNotification && formatDate(selectedNotification.date)}</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setSelectedNotificationAndMarkAsRead(null)}
            className="w-full justify-center text-secondary-foreground hover:bg-primary/10 transition-colors"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
      <style jsx global>{`
        .tabs-content .data-[state=active] {
          color: var(--sidebar-foreground);
        }
        /* Light mode */
        :root .tabs-list {
          background-color: hsl(var(--secondary));
        }
        :root .tabs-trigger[data-state="active"] {
          background-color: hsl(var(--sidebar-background));
        }

        /* Dark mode */
        .dark .tabs-list {
          background-color: hsl(var(--secondary));
        }
        .dark .tabs-trigger[data-state="active"] {
          background-color: hsl(var(--sidebar-background));
        }

        /* Midnight mode */
        .midnight .tabs-list {
          background-color: hsl(var(--secondary));
        }
        .midnight .tabs-trigger[data-state="active"] {
          background-color: hsl(var(--sidebar-background));
        }
        .tabs-trigger {
          transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out, opacity 0.3s ease-in-out;
        }

        .animate-expand-horizontal {
          animation: expandHorizontal 0.3s ease-out forwards;
        }
        .tabs-list {
          position: relative;
          overflow: hidden;
        }
      `}</style>
      <style jsx global>{`
  .dark .bg-sidebar\/80 {
    background-color: hsl(var(--sidebar-background) / 0.9);
  }
  .dark .bg-sidebar\/80:focus {
    background-color: hsl(var(--sidebar-background));
  }
  .midnight .bg-sidebar\/80 {
    background-color: hsl(var(--sidebar-background) / 0.9);
  }
  .midnight .bg-sidebar\/80:focus {
    background-color: hsl(var(--sidebar-background));
  }
`}</style>
      <style>{hideScrollbarStyle}</style>
    </TooltipProvider>
  )
}

