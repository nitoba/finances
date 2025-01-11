'use client'

import * as React from 'react'
import { LayoutDashboard, TableProperties } from 'lucide-react'

import { NavMain } from '@/components/sidebar/nav-main'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavUser } from '../user-nav'

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Expenses',
      url: '/expenses',
      icon: TableProperties,
    },
  ],
  favorites: [
    {
      name: 'Project Management & Task Tracking',
      url: '#',
      emoji: '📊',
    },
    {
      name: 'Family Recipe Collection & Meal Planning',
      url: '#',
      emoji: '🍳',
    },
    {
      name: 'Fitness Tracker & Workout Routines',
      url: '#',
      emoji: '💪',
    },
    {
      name: 'Book Notes & Reading List',
      url: '#',
      emoji: '📚',
    },
    {
      name: 'Sustainable Gardening Tips & Plant Care',
      url: '#',
      emoji: '🌱',
    },
    {
      name: 'Language Learning Progress & Resources',
      url: '#',
      emoji: '🗣️',
    },
    {
      name: 'Home Renovation Ideas & Budget Tracker',
      url: '#',
      emoji: '🏠',
    },
    {
      name: 'Personal Finance & Investment Portfolio',
      url: '#',
      emoji: '💰',
    },
    {
      name: 'Movie & TV Show Watchlist with Reviews',
      url: '#',
      emoji: '🎬',
    },
    {
      name: 'Daily Habit Tracker & Goal Setting',
      url: '#',
      emoji: '✅',
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <NavMain items={data.navMain} />
        {/* <NavFavorites favorites={data.favorites} /> */}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
