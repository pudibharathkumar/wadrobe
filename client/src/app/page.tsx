"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Plus, Sparkles, TrendingUp, Clock, ArrowUpRight, Shirt, Zap, Calendar, Palmtree, ShoppingBag, Layers, Wind, Footprints, Watch, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { wardrobeApi, outfitApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemAnim = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
}

export default function Dashboard() {
  const [stats, setStats] = useState({ totalItems: 0, totalOutfits: 0 })
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wardrobeRes, outfitsRes] = await Promise.all([
          wardrobeApi.getAll(),
          outfitApi.getAll()
        ])
        setItems(wardrobeRes.data)
        setStats({
          totalItems: wardrobeRes.data.length,
          totalOutfits: outfitsRes.data.length
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 leading-[1.5]"
    >
      {/* Hero Section - Redesigned */}
      <section className="bg-white border-b border-[#EEECE8] -mt-8 -mx-8 relative overflow-hidden h-[500px] flex">
        {/* Left Column: 2/3 Content */}
        <div className="w-2/3 p-12 pr-6 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-[40px] font-bold leading-[1.1] text-[#1A1A1A] font-serif">
              Organize your wardrobe.<br />
              Plan every look. Own every day.
            </h1>
            <p className="text-[14px] font-normal text-[#888885] max-w-xl leading-[1.5]">
              Digitally organize your clothes, plan outfits for any occasion, and pack smart for every trip.
            </p>
          </div>

          {/* Action Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Add Items", desc: "Upload or add clothes to your wardrobe", icon: Plus, color: "bg-purple-50 text-purple-600" },
              { label: "Create Outfit", desc: "Mix and match for the perfect look", icon: Sparkles, color: "bg-indigo-50 text-indigo-600" },
              { label: "Plan Calendar", desc: "Plan outfits for upcoming days", icon: Calendar, color: "bg-violet-50 text-violet-600" },
              { label: "Pack Smart", desc: "Build a travel capsule with ease", icon: ShoppingBag, color: "bg-fuchsia-50 text-fuchsia-600" }
            ].map((card, i) => (
              <Card key={i} className="rounded-[12px] border-[#EEECE8] bg-white p-5 shadow-none hover:border-[#7C6FCD] transition-all cursor-pointer group flex flex-col justify-between h-40">
                <div className="space-y-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", card.color)}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#1A1A1A]">{card.label}</p>
                    <p className="text-[12px] text-[#888885] leading-tight line-clamp-2">
                       {card.desc}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <ArrowUpRight className="w-4 h-4 text-[#888885] group-hover:text-[#7C6FCD] transition-colors" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: 1/3 Bleed Photo */}
        <div className="w-1/3 h-full relative">
          <img 
            src="/hero_clothing_rack.png" 
            alt="Hero Lifestyle" 
            className="w-full h-full object-cover grayscale-[0.05]"
          />
        </div>
      </section>

      {/* Stats Summary - Now below hero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: My Wardrobe - Redesigned */}
        <motion.div variants={itemAnim} className="md:col-span-1 h-full">
          <Card className="rounded-[16px] border-[#EEECE8] bg-white p-6 shadow-none flex flex-col h-full space-y-6">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[#1A1A1A]">My Wardrobe</h2>
              <Link href="/wardrobe" className="text-[13px] font-medium text-[#7C6FCD] hover:underline">
                View all
              </Link>
            </div>

            {/* Category Icon Row */}
            <div className="flex justify-between items-start pt-2">
              {[
                { label: "Tops", count: 32, icon: Shirt },
                { label: "Bottoms", count: 18, icon: Layers },
                { label: "Dresses", count: 12, icon: Shirt },
                { label: "Outer", count: 8, icon: Wind },
                { label: "Shoes", count: 16, icon: Footprints },
                { label: "Bags", count: 9, icon: ShoppingBag },
                { label: "Access.", count: 23, icon: Watch },
              ].map((cat, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 min-w-[32px]">
                  <cat.icon className="w-5 h-5 text-[#888885] stroke-[1.25]" />
                  <span className="text-[10px] text-[#888885] font-medium">{cat.label}</span>
                  <span className="text-[10px] text-[#1A1A1A] font-bold">{cat.count}</span>
                </div>
              ))}
            </div>

            {/* 2x4 Image Grid */}
            <div className="grid grid-cols-4 gap-3 pt-4">
              {[
                "cream_knit_sweater.png", // Cream knit
                "denim_jacket.png", // Denim (Placeholder)
                "camel_blazer.png", // Blazer (Placeholder)
                "black_slip_dress.png", // Slip dress (Placeholder)
                "striped_long_sleeve.png", // Striped top (Placeholder)
                "brown_leather_bag.png", // Crossbody bag (Placeholder)
                "straight_jeans.png", // Straight jeans (Placeholder)
                "leather_watch.png"  // Watch (Placeholder)
              ].map((img, i) => (
                <div key={i} className="aspect-square bg-white border border-[#EEECE8] rounded-[8px] p-1.5 flex items-center justify-center overflow-hidden">
                  <img src={`/${img}`} alt="Garment" className="max-w-full max-h-full object-contain" />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Center Column: Outfit Planner */}
        <motion.div variants={itemAnim} className="md:col-span-1 h-full">
          <Card className="rounded-[16px] border-[#EEECE8] bg-white p-6 shadow-none flex flex-col h-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#1A1A1A]">Outfit Planner</h2>
              <Link href="/planner" className="text-[13px] font-medium text-[#7C6FCD] hover:underline">
                View all
              </Link>
            </div>

            {/* Date Strip */}
            <div className="flex justify-between items-center pb-4 border-b border-[#EEECE8]">
              {[
                { day: 'Mon', date: 20 },
                { day: 'Tue', date: 21 },
                { day: 'Wed', date: 22, active: true },
                { day: 'Thu', date: 23 },
                { day: 'Fri', date: 24 },
                { day: 'Sat', date: 25 },
                { day: 'Sun', date: 26 },
              ].map((d, i) => (
                <div key={i} className={cn("flex flex-col items-center justify-center w-[38px] h-[52px] rounded-full", d.active ? "bg-[#7C6FCD]" : "")}>
                  <span className={cn("text-[10px] font-medium", d.active ? "text-white/90" : "text-[#888885]")}>{d.day}</span>
                  <span className={cn("text-[14px] font-semibold mt-0.5", d.active ? "text-white" : "text-[#888885]")}>{d.date}</span>
                </div>
              ))}
            </div>

            {/* Current Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-[#1A1A1A]">Brunch with friends</h3>
                <div className="flex items-center gap-1.5 text-[#888885]">
                  <Sun className="w-4 h-4" />
                  <span className="text-[12px] font-medium">24°C</span>
                </div>
              </div>

              {/* 5 Outfit Item Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {[
                  "cream_knit_sweater.png", // beige linen shirt
                  "straight_jeans.png", // blue straight-leg jeans
                  "brown_leather_bag.png", // tan leather tote bag
                  "denim_jacket.png", // white leather sneakers
                  "leather_watch.png", // gold chain necklace
                ].map((img, i) => (
                  <div key={i} className="w-[52px] h-[52px] shrink-0 bg-white border border-[#EEECE8] rounded-[8px] p-1.5 flex items-center justify-center overflow-hidden">
                    <img src={`/${img}`} alt="Outfit item" className="max-w-full max-h-full object-contain" />
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 pt-1">
                <Button variant="outline" className="flex-1 rounded-full bg-white border-[#EEECE8] text-[#1A1A1A] hover:bg-gray-50 h-10 text-[13px] font-medium">
                  Edit Outfit
                </Button>
                <Button className="flex-1 rounded-full bg-[#7C6FCD] hover:bg-[#6A5EBA] text-white h-10 text-[13px] font-medium border-0">
                  Wear This
                </Button>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="pt-4 space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-[#1A1A1A]">Upcoming Events</h3>
                <Link href="/calendar" className="text-[12px] font-medium text-[#7C6FCD] hover:underline">
                  View calendar
                </Link>
              </div>

              <div className="space-y-4">
                {/* Event 1 */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-semibold text-[#1A1A1A]">Dinner Date</span>
                    <span className="text-[11px] text-[#888885] font-medium">Sat, 25 May · 7:00 PM</span>
                  </div>
                  <div className="flex -space-x-1.5">
                    {["camel_blazer.png", "straight_jeans.png", "brown_leather_bag.png"].map((img, i) => (
                      <div key={i} className="w-7 h-7 rounded-md bg-white border border-[#EEECE8] p-0.5 overflow-hidden z-10 relative">
                        <img src={`/${img}`} alt="item" className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Event 2 */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-semibold text-[#1A1A1A]">Office Meeting</span>
                    <span className="text-[11px] text-[#888885] font-medium">Mon, 27 May · 10:00 AM</span>
                  </div>
                  <div className="flex -space-x-1.5">
                    {["striped_long_sleeve.png", "straight_jeans.png", "leather_watch.png"].map((img, i) => (
                      <div key={i} className="w-7 h-7 rounded-md bg-white border border-[#EEECE8] p-0.5 overflow-hidden z-10 relative">
                        <img src={`/${img}`} alt="item" className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Column: Packing List */}
        <motion.div variants={itemAnim} className="md:col-span-1 h-full">
          <Card className="rounded-[16px] border-[#EEECE8] bg-white p-6 shadow-none flex flex-col h-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#1A1A1A]">Packing List</h2>
              <Link href="/packing" className="text-[13px] font-medium text-[#7C6FCD] hover:underline">
                View all
              </Link>
            </div>

            {/* Trip Details */}
            <div className="space-y-1">
              <h3 className="text-[15px] font-semibold text-[#1A1A1A]">Paris Trip</h3>
              <p className="text-[13px] text-[#888885] font-medium">24 May — 30 May</p>
            </div>

            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#1A1A1A]">Essentials</span>
                <span className="text-[12px] text-[#888885] font-medium">18 / 25 items</span>
              </div>
              <div className="w-full h-[6px] bg-[#F5F2EE] rounded-full overflow-hidden">
                <div className="h-full bg-[#7C6FCD] rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>

            {/* 3x3 Image Grid */}
            <div className="grid grid-cols-3 gap-2 flex-1">
              {[
                "black_slip_dress.png", // black camisole top
                "straight_jeans.png", // blue straight jeans
                "camel_blazer.png", // camel trench coat
                "denim_jacket.png", // white leather sneakers
                "brown_leather_bag.png", // large black leather tote
                "leather_watch.png", // brown tortoiseshell sunglasses
                "cream_knit_sweater.png", // item 7
                "striped_long_sleeve.png", // item 8
              ].map((img, i) => (
                <div key={i} className="aspect-square bg-white border border-[#EEECE8] rounded-[8px] p-1.5 flex items-center justify-center overflow-hidden">
                  <img src={`/${img}`} alt="Packing item" className="max-w-full max-h-full object-contain" />
                </div>
              ))}
              {/* Add Button */}
              <div className="aspect-square border-2 border-dashed border-[#EEECE8] rounded-[8px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Plus className="w-5 h-5 text-[#888885]" />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2 mt-auto">
              <Button className="w-full rounded-full bg-[#7C6FCD] hover:bg-[#6A5EBA] text-white h-[44px] text-[14px] font-semibold border-0">
                View Packing List
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Smart Suggestions Banner - Full Width Bottom */}
      <motion.div variants={itemAnim} className="w-full bg-white border-t border-[#EEECE8] py-[20px] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#7C6FCD] shrink-0 mt-0.5 md:mt-0" />
          <div className="flex flex-col">
            <h3 className="text-[15px] font-semibold text-[#1A1A1A]">Smart Suggestions</h3>
            <p className="text-[13px] text-[#888885] mt-0.5">Based on your wardrobe and the weather, we've suggested 3 outfits for this week.</p>
          </div>
        </div>
        <Button variant="outline" className="shrink-0 bg-white border-[#CCCCCC] text-[#1A1A1A] hover:bg-gray-50 h-[36px] rounded-full px-5 text-[14px] font-medium">
          See Suggestions
        </Button>
      </motion.div>
    </motion.div>
  )
}
