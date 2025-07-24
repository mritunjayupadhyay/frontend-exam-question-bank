"use client"

import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Loader } from "lucide-react"
import { Button } from "./ui/button"

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
    <header className="sticky top-0 z-50 flex w-full items-center border-b flex items-center justify-between h-20 max-w-full px-6 py-4 bg- border-b border-b-surfaceVariant shrink-0 self-stretch"
    style={{ background: "var(--Schemes-Surface, #FBF8FD);" }}
    >
      <div className="flex h-(--header-height) w-full justify-between items-center gap-2 px-4">
        <p style={{ color: '#0055A6', fontSize: 26, fontWeight: 'bold'}}>Question Bank</p>
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton
              mode="modal">
              <Button variant="ghost" className="h-10">
                Login
              </Button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>
      </div>
    </header>
  )
}
