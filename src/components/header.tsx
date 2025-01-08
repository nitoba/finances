import Link from 'next/link'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { UserNav } from './user-nav'
import { Suspense } from 'react'
import { Skeleton } from './ui/skeleton'
import { NavLink } from './nav-link'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

export function Header() {
  return (
    <div className="flex h-16 items-center justify-between border-b px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <h1 className="text-lg font-bold">Finances</h1>
        </Link>

        <Separator orientation="vertical" className="h-5 hidden sm:block" />

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center space-x-4">
          <NavLink href="/services">Services</NavLink>
          <NavLink href="/events">Events</NavLink>
          <NavLink href="/monitoring">Monitoring</NavLink>
          <NavLink href="/settings">Settings</NavLink>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger className="sm:hidden">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:hidden">
            <nav className="flex flex-col gap-4 mt-8">
              <NavLink href="/services">Services</NavLink>
              <NavLink href="/events">Events</NavLink>
              <NavLink href="/monitoring">Monitoring</NavLink>
              <NavLink href="/settings">Settings</NavLink>
              <Separator className="my-2" />
              <NavLink href="/examples/dashboard">Changelog</NavLink>
              <NavLink href="/examples/dashboard">Help</NavLink>
              <NavLink href="/examples/dashboard">Docs</NavLink>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="hidden sm:block">
          Feedback
        </Button>

        <Separator orientation="vertical" className="h-5 hidden sm:block" />

        <nav className="hidden sm:flex items-center space-x-4">
          <NavLink className="text-xs font-normal" href="/examples/dashboard">
            Changelog
          </NavLink>
          <NavLink className="text-xs font-normal" href="/examples/dashboard">
            Help
          </NavLink>
          <NavLink className="text-xs font-normal" href="/examples/dashboard">
            Docs
          </NavLink>
        </nav>

        <Separator orientation="vertical" className="h-5 hidden sm:block" />

        <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
          <UserNav />
        </Suspense>
      </div>
    </div>
  )
}
