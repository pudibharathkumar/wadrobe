"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Filter, SlidersHorizontal, Trash2, ArrowUpRight, Shirt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { wardrobeApi } from "@/lib/api"
import { UploadModal } from "@/components/UploadModal"
import { Skeleton } from "@/components/ui/skeleton"

export default function WardrobePage() {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      const res = await wardrobeApi.getAll()
      setItems(res.data)
    } catch (error) {
      console.error("Failed to fetch wardrobe items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.category?.toLowerCase().includes(search.toLowerCase()) || 
      item.color?.toLowerCase().includes(search.toLowerCase()) ||
      item.tags?.some((t: any) => t.name.toLowerCase().includes(search.toLowerCase()))
    
    const matchesFilter = filter === "all" || item.season === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <Badge variant="secondary" className="rounded-full px-4 py-1 text-primary bg-primary/10 border-primary/20 font-bold tracking-wider uppercase text-[10px] mb-4">
            Collection
          </Badge>
          <h1 className="text-5xl font-black tracking-tight">Your <span className="gradient-text">Wardrobe.</span></h1>
          <p className="text-muted-foreground text-xl mt-2 max-w-lg">
            A digital twin of your physical collection, organized with precision.
          </p>
        </div>
        <Button size="lg" className="rounded-2xl h-14 px-8 shadow-xl shadow-primary/20 font-bold gap-2" onClick={() => setIsUploadOpen(true)}>
          <Plus className="w-5 h-5" />
          Add New Piece
        </Button>
      </header>
      
      <UploadModal 
        open={isUploadOpen} 
        onOpenChange={setIsUploadOpen} 
        onSuccess={fetchItems} 
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Search by category, color, or tags..." 
            className="pl-12 rounded-2xl h-14 glass border-2 border-transparent focus-visible:border-primary/20 bg-white/50 backdrop-blur-xl text-lg transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          {["all", "SUMMER", "WINTER", "SPRING", "FALL"].map((s) => (
            <Button 
              key={s} 
              variant={filter === s ? "default" : "outline"} 
              size="lg"
              className={cn(
                "rounded-2xl capitalize px-6 h-14 font-bold border-2 transition-all",
                filter === s ? "shadow-lg shadow-primary/20" : "hover:border-primary/20"
              )}
              onClick={() => setFilter(s)}
            >
              {s.toLowerCase()}
            </Button>
          ))}
          <Button variant="outline" size="icon" className="rounded-2xl h-14 w-14 border-2 shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array(10).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] rounded-[2.5rem]" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          ) : filteredItems.length === 0 ? (
            <motion.div 
              className="col-span-full h-96 flex flex-col items-center justify-center text-center p-12 glass rounded-[3rem] border-dashed border-2 opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
                <Search className="w-12 h-12" />
              </div>
              <p className="text-2xl font-bold">No pieces found</p>
              <p className="max-w-xs mt-2 text-muted-foreground font-medium text-lg leading-relaxed">
                Try a different search or clear your filters to find your style.
              </p>
            </motion.div>
          ) : (
            filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any[] }}
                whileHover={{ y: -10 }}
              >
                <Card className="group cursor-pointer">
                  <div className="aspect-[3/4] relative overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                    <img 
                      src={item.imageUrl} 
                      alt={item.category} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                      <Button size="icon" variant="secondary" className="rounded-full w-12 h-12 shadow-xl hover:scale-110 transition-transform">
                        <ArrowUpRight className="w-5 h-5" />
                      </Button>
                      <Button size="icon" variant="destructive" className="rounded-full w-12 h-12 shadow-xl hover:scale-110 transition-transform">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                    
                    <div className="absolute top-4 right-4">
                      <Badge className="glass text-[10px] rounded-full px-3 py-1 border-none font-black uppercase tracking-[0.1em] text-slate-900 bg-white/80">
                        {item.season}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-black text-lg capitalize tracking-tight">{item.category}</p>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">{item.color}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 border flex items-center justify-center">
                        <Shirt className="w-4 h-4 text-slate-500" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {item.tags?.slice(0, 3).map((tag: any) => (
                        <span key={tag.id} className="text-[9px] font-black uppercase text-primary tracking-widest bg-primary/5 px-2 py-1 rounded-md">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
