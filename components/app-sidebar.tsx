/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SidebarIcon,
  PlusIcon,
  NotebookText
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
// import { NavSecondary } from "@/components/nav-secondary"
// import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  // SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { NavProjects } from "./nav-projects"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Questions",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "List Question",
          url: "/questions",
        },
        {
          title: "Add Question",
          url: "/questions/create",
        }
      ],
    },
    {
      title: "Exam Papers",
      url: "#",
      icon: NotebookText,
      isActive: true,
      items: [
        {
          title: "List Exam Papers",
          url: "/exam-papers",
        },
        {
          title: "Add Exam Paper",
          url: "/exam-papers/create",
        }
      ],
    }
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar()
  return (
    <Sidebar collapsible="icon" className="top-[var(--header-height)] !h-[calc(100svh-var(--header-height))]" {...props}>
      <SidebarHeader>
        <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
        <SidebarIcon />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  )
}
