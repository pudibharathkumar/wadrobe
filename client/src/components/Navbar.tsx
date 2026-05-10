"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Home, 
  Shirt, 
  Layers, 
  Calendar, 
  ShoppingBag, 
  StickyNote, 
  ChevronRight,
  MoreVertical
} from "lucide-react"
import { motion } from "framer-motion"

import { useSession, signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Wardrobe", href: "/wardrobe", icon: Shirt },
  { name: "Outfits", href: "/outfits", icon: Layers },
  { name: "Calendar", href: "/planner", icon: Calendar },
  { name: "Packing", href: "/packing", icon: ShoppingBag },
  { name: "Style Notes", href: "/notes", icon: StickyNote },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <nav className="fixed left-0 top-0 h-full w-[260px] bg-white border-r border-[#EEECE8] px-6 py-8 hidden lg:flex flex-col z-50 overflow-y-auto custom-scrollbar">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #EEECE8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #DDD;
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center gap-2 mb-10 px-3">
        <Shirt className="w-5 h-5 text-[#1A1A1A]" />
        <span className="text-[18px] font-semibold tracking-tight text-[#1A1A1A]">
          Wadrobe
        </span>
      </div>

      {/* Navigation List */}
      <div className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 h-[44px] px-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-[#EDE9FA] text-[#7C6FCD]" 
                  : "text-[#888885] hover:text-[#1A1A1A] hover:bg-[#F5F2EE]"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-[#7C6FCD]" : "text-[#888885]")} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          )
        })}
      </div>

      {/* Footer Content */}
      <div className="space-y-6 mt-auto pt-8">
        {/* Quote Card */}
        <div className="p-5 rounded-xl bg-[#F0EDE6] space-y-3">
          <p className="text-[13px] text-[#1A1A1A] leading-relaxed italic font-serif">
            "Style is a way to say who you are without having to speak."
          </p>
          <p className="text-[10px] text-[#888885] font-medium tracking-wide">
            — RACHEL ZOE
          </p>
        </div>

        {/* Lifestyle Photo */}
        <div className="aspect-square rounded-xl overflow-hidden bg-[#F5F2EE]">
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400" 
            alt="Lifestyle" 
            className="w-full h-full object-cover grayscale-[0.1]" 
          />
        </div>

        {/* User Profile / Auth Section */}
        <div className="pt-2">
          {session ? (
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#F5F2EE] flex-shrink-0">
                  <img 
                    src={session?.user?.image || `https://ui-avatars.com/api/?name=${session?.user?.name || "User"}&background=random`} 
                    alt={session?.user?.name || "User"} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[14px] font-medium text-[#1A1A1A] leading-none truncate">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-[11px] text-[#888885] mt-1 leading-none truncate">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => signOut()}
                className="p-2 hover:bg-red-50 rounded-lg text-[#888885] hover:text-red-500 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link 
                href="/auth/signin"
                className="flex items-center justify-center w-full h-[44px] bg-[#1A1A1A] text-white rounded-lg text-[14px] font-semibold hover:bg-black transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup"
                className="flex items-center justify-center w-full h-[44px] border border-[#EEECE8] text-[#1A1A1A] rounded-lg text-[14px] font-semibold hover:bg-[#F5F2EE] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
