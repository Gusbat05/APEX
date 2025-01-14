"use client"

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Upload, Table, Menu, Sun, Moon, Sparkles, ChevronLeft, Sunset } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const AccountMenu = dynamic(() => import('./account-menu').then(mod => mod.AccountMenu), { ssr: false });

const navItems = [
  { name: 'Home', href: '/', icon: Home, index: 0 },
  { name: 'Upload', href: '/upload', icon: Upload, index: 1 },
  { name: 'Data Tables', href: '/tables', icon: Table, index: 2 },
]

interface SidebarProps {
  onCollapse: (collapsed: boolean) => void;
}

export function Sidebar({ onCollapse }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [prevTheme, setPrevTheme] = useState<string | null>(null);

const getHighlightColor = () => {
  switch (resolvedTheme) {
    case 'light':
      return {
        text: 'group-hover:text-blue-600',
        glow: 'group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]'
      }
    case 'midnight':
      return {
        text: 'group-hover:text-purple-400',
        glow: 'group-hover:drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]'
      }
    case 'sunset':
      return {
        text: 'group-hover:text-orange-600',
        glow: 'group-hover:drop-shadow-[0_0_8px_rgba(234,88,12,0.5)]'
      }
    default:
      return {
        text: 'group-hover:text-teal-400',
        glow: 'group-hover:drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]'
      }
  }
}

  const highlightColor = getHighlightColor()

  useEffect(() => {
    onCollapse(isCollapsed)
  }, [isCollapsed, onCollapse])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev)
  }, [])

  const cycleTheme = useCallback(() => {
    setIsAnimating(true);
    setPrevTheme(resolvedTheme);
    setTimeout(() => {
      if (resolvedTheme === 'sunset') setTheme('light');
      else if (resolvedTheme === 'light') setTheme('dark');
      else if (resolvedTheme === 'dark') setTheme('midnight');
      else setTheme('sunset');
      setTimeout(() => {
        setIsAnimating(false);
        setPrevTheme(null);
      }, 300);
    }, 150);
  }, [resolvedTheme, setTheme]);

  const getNextTheme = useCallback((current: string) => {
    if (current === 'sunset') return 'light'
    if (current === 'light') return 'dark'
    if (current === 'dark') return 'midnight'
    return 'sunset'
  }, [])

  return (
    <div className={`fixed left-4 top-4 bottom-4 z-50 flex flex-col bg-secondary shadow-lg rounded-lg ${isLoaded ? 'transition-all duration-300' : ''} ${isCollapsed ? 'w-[52px]' : 'w-64'} ${resolvedTheme === 'sunset' ? 'bg-orange-100' : ''}`}>
      <div className="flex items-center justify-start px-2 pt-2 pb-2 border-b border-secondary-foreground/20 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-3">
            <h1 
              className={`
                text-xl font-bold 
                ${isLoaded ? 'transition-all duration-300' : ''}
                ${isCollapsed 
                  ? 'opacity-0 translate-x-[40px]' 
                  : 'opacity-100 translate-x-0'
                }
                whitespace-nowrap
                pl-2
              `}
            >
              Apex Dashboard
            </h1>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={toggleCollapse} 
          className="hover:bg-primary/10 w-9 h-9 p-0 flex items-center justify-center shrink-0 z-10 ml-auto group"
        >
          <div className="relative w-9 h-9 flex items-center justify-center group-hover:text-primary transition-colors duration-200">
            <Menu 
              className={`absolute h-5 w-5 ${isLoaded ? 'transition-all duration-300' : ''} ${
                isCollapsed ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
              } ${highlightColor.text} ${highlightColor.glow} group-hover:scale-110`} 
              strokeWidth={2.5} 
            />
            <ChevronLeft
              className={`absolute h-5 w-5 ${isLoaded ? 'transition-all duration-300' : ''} ${
                isCollapsed ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
              } ${highlightColor.text} ${highlightColor.glow} group-hover:scale-110`}
              strokeWidth={2.5}
            />
          </div>
        </Button>
      </div>
      <nav className="flex-1 flex flex-col py-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name} className="px-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={`sidebar-button hover:bg-primary/10 ${
                  pathname === item.href
                    ? `bg-primary/10`
                    : ''
                } relative w-full h-9 p-0 overflow-hidden group hover:text-foreground`}
              >
                <Link href={item.href} className="flex items-center w-full">
                  <div className="absolute left-0 w-9 h-9 flex items-center justify-center group-hover:text-primary transition-colors duration-200">
                    <item.icon 
                      className={`h-5 w-5 transition-all duration-200 group-hover:scale-110 ${highlightColor.text} ${highlightColor.glow}`} 
                      strokeWidth={2.5} 
                    />
                  </div>
                  <span 
                    className={`
                      absolute 
                      ${isLoaded ? 'transition-all duration-300' : ''}
                      ${isCollapsed 
                        ? 'opacity-0 translate-x-[40px]' 
                        : 'opacity-100 translate-x-0'
                      }
                      left-0
                      whitespace-nowrap
                      pl-10
                    `}
                  >
                    {item.name}
                  </span>
                </Link>
                {pathname === item.href && (
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    resolvedTheme === 'light'
                      ? 'bg-blue-600'
                      : resolvedTheme === 'midnight'
                      ? 'bg-purple-400'
                      : resolvedTheme === 'sunset'
                      ? 'bg-orange-600'
                      : 'bg-teal-400'
                  }`} />
                )}
              </Button>
            </li>
          ))}
        </ul>
        <div className={`
          flex-1 flex justify-center items-center
          ${isLoaded ? 'transition-all duration-300' : ''}
          ${isCollapsed 
            ? 'opacity-0 translate-x-full' 
            : 'opacity-100 translate-x-0'
          }
        `}>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Apex%20Hex%20Outline-oHENfbYJkEnUg8vtqdNDDq5QI56xvO.png"
            alt="Apex Dashboard Logo"
            width={120}
            height={120}
            className={`
              ${isLoaded ? 'transition-opacity duration-300' : ''}
              opacity-20
              dark:invert
              ${resolvedTheme === 'sunset' ? 'opacity-30' : ''}
            `}
          />
        </div>
      </nav>
      <div className="px-2 pt-2 pb-2 border-t border-secondary-foreground/20">
        <div className="mb-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={cycleTheme}
            disabled={!theme || isAnimating}
            className="sidebar-button hover:bg-primary/10 relative w-full h-9 p-0 overflow-hidden group hover:text-foreground"
          >
            <div className="absolute left-0 w-9 h-9 flex items-center justify-center overflow-hidden">
              <div className="relative w-5 h-5 flex items-center justify-center">
                {['sunset', 'light', 'dark', 'midnight'].map((t) => (
                  <div
                    key={t}
                    className={`absolute inset-0 ${isLoaded ? 'transition-all duration-150' : ''} flex items-center justify-center ${
                      resolvedTheme === t 
                        ? 'opacity-100 translate-x-0' 
                        : resolvedTheme === getNextTheme(t)
                        ? 'opacity-0 -translate-x-full'
                        : 'opacity-0 translate-x-full'
                    } ${highlightColor.text} ${highlightColor.glow} group-hover:scale-110`}
                  >
                    {t === 'sunset' && <Sunset className={`h-5 w-5`} strokeWidth={2.5} />}
                    {t === 'midnight' && <Sparkles className={`h-5 w-5`} strokeWidth={2.5} />}
                    {t === 'light' && <Sun className={`h-5 w-5`} strokeWidth={2.5} />}
                    {t === 'dark' && <Moon className={`h-5 w-5`} strokeWidth={2.5} />}
                  </div>
                ))}
              </div>
            </div>
            <span 
              className={`
                absolute 
                ${isLoaded ? 'transition-all duration-300' : ''}
                ${isCollapsed 
                  ? 'opacity-0 translate-x-[40px]' 
                  : 'opacity-100 translate-x-0'
                }
                ${isAnimating ? 'animate-slide-left' : ''}
                left-0
                whitespace-nowrap
                pl-10
              `}
            >
              {resolvedTheme === 'sunset' ? 'Sunset' : resolvedTheme === 'light' ? 'Light' : resolvedTheme === 'dark' ? 'Dark' : 'Midnight'} Mode
            </span>
          </Button>
        </div>
        <AccountMenu isCollapsed={isCollapsed} />
      </div>
    </div>
  )
}
<style jsx global>{`
  .light .sidebar-button:hover {
    color: hsl(var(--foreground)) !important;
  }
  @keyframes slideLeft {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    50% {
      transform: translateX(-20px);
      opacity: 0;
    }
    51% {
      transform: translateX(20px);
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slide-left {
    animation: slideLeft 0.3s ease-in-out;
  }
`}</style>

