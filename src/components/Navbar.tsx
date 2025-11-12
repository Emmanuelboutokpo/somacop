'use client'
import { Music, Menu, Webhook } from 'lucide-react'
import Link from 'next/link'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "./ui/navigation-menu"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'

const navItems = [
  { name: "dechargement", href: "/" },
  { name: "Facture", href: "/pages/factures/" },
]

const Navbar = () => {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className='flex'>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <VisuallyHidden>Ouvrir le menu</VisuallyHidden>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>
                  <Link href={'/'} className='flex items-center gap-2'>
                    <Webhook className='w-6 h-6' />
                    <span className='font-bold'>SOBEMAB</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Link href={'/'} className='flex items-center gap-2'>
            <Webhook className='w-6 h-6' />
            <span className='font-bold'>SOBEMAB</span>
          </Link>
        </div>

        {/* Menu mobile */}
        <div className="flex items-center gap-4">
          {/* Navigation desktop - caché sur mobile */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    asChild
                    active={pathname === item.href}
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href={item.href}>
                      {item.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Boutons d'authentification */}
          <SignedOut>
            <SignInButton mode='modal'>
              <Button variant="outline">Connexion</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </div>
  )
}

export default Navbar