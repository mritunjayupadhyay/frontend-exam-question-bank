"use client"

// import { SidebarIcon } from "lucide-react"

// import { SearchForm } from "@/components/search-form"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { useSidebar } from "@/components/ui/sidebar"

export function SiteHeader() {

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b flex items-center justify-between h-20 min-w-[1150px] px-6 py-4 bg- border-b border-b-surfaceVariant shrink-0 self-stretch"
    style={{ background: "var(--Schemes-Surface, #FBF8FD);" }}
    >
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <p style={{ color: '#0055A6', display: 'none', fontSize: 30, fontWeight: 'bold'}}>Question Bank</p>
      </div>
    </header>
  )
}
