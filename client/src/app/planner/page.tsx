"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Calendar, ArrowRight, RefreshCw, Shirt, Trash2, Heart, Share2, Plus, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { outfitApi } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Image as ImageIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function PlannerPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [outfit, setOutfit] = useState<any>(null)
  const [occasion, setOccasion] = useState("COORDINATED")

  const generateOutfit = async () => {
    setIsGenerating(true)
    try {
      const res = await outfitApi.generate({ 
        occasion, 
        weather: "sunny", // Default for demo
      })
      setOutfit(res.data)
    } catch (error) {
      console.error("Failed to generate outfit:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <Badge variant="secondary" className="rounded-full px-4 py-1 text-primary bg-primary/10 border-primary/20 font-bold tracking-wider uppercase text-[10px]">
            AI Stylist
          </Badge>
          <h1 className="text-5xl font-black tracking-tight leading-tight">
            Curated for <br />
            <span className="gradient-text font-black">the occasion.</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-xl leading-relaxed">
            Let our AI engine analyze your collection and curate the perfect combination for any event.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1 p-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Styling Controls</CardTitle>
            <CardDescription>Tailor the generation algorithm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Zap className="w-3 h-3 text-primary" /> Occasion Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                {["COORDINATED", "FORMAL", "CASUAL", "DATE_NIGHT", "ATHLEISURE"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setOccasion(type)}
                    className={cn(
                      "w-full text-left px-5 py-4 rounded-2xl font-bold transition-all border-2",
                      occasion === type 
                        ? "bg-primary/5 border-primary/20 text-primary shadow-sm" 
                        : "hover:bg-zinc-50 border-transparent text-slate-500"
                    )}
                  >
                    {type.split("_").join(" ").toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              className="w-full h-16 rounded-3xl text-lg font-black gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              onClick={generateOutfit}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate Looks
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Area */}
        <div className="lg:col-span-2 min-h-[600px] flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {!outfit && !isGenerating && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center p-12 glass rounded-[3rem] border-dashed border-2 opacity-50 w-full aspect-square max-w-[500px] flex flex-col items-center justify-center"
              >
                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-8">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
                <p className="text-2xl font-black text-slate-800">Your next look awaits</p>
                <p className="text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed font-semibold">
                  Select an occasion and click generate to see the magic.
                </p>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full space-y-8"
              >
                <div className="grid grid-cols-2 gap-6">
                  <Skeleton className="aspect-[3/4] rounded-[3rem]" />
                  <Skeleton className="aspect-[3/4] rounded-[3rem]" />
                </div>
                <div className="space-y-4 text-center">
                  <Skeleton className="h-4 w-1/3 mx-auto" />
                  <Skeleton className="h-8 w-3/4 mx-auto" />
                </div>
              </motion.div>
            )}

            {outfit && !isGenerating && (
              <motion.div 
                key={outfit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-10"
              >
                <div className="flex justify-center -space-x-12 md:-space-x-20">
                  {outfit.items.map((item: any, idx: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, rotate: idx % 2 === 0 ? -5 : 5, x: idx % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, rotate: idx % 2 === 0 ? -3 : 3, x: 0 }}
                      transition={{ delay: idx * 0.1, type: "spring" as const }}
                      className="relative"
                    >
                      <Card className="w-64 md:w-80 h-[400px] md:h-[480px] group overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl">
                        <img 
                          src={item.imageUrl} 
                          alt={item.category} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="font-black text-lg capitalize">{item.category}</p>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-300">{item.color}</p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center space-y-6">
                  <div className="flex flex-wrap justify-center gap-2">
                    {outfit.tags?.map((tag: any) => (
                      <Badge key={tag.id} className="rounded-full px-4 py-1.5 glass text-xs font-black uppercase tracking-wider text-slate-800 border-none">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black tracking-tight">{outfit.name || "Ensemble Zero"}</h2>
                    <p className="text-muted-foreground text-lg mt-2 font-semibold italic">"{outfit.description || "A masterfully curated set for your next outing."}"</p>
                  </div>
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <Button variant="outline" className="rounded-2xl h-14 w-14 border-2 p-0 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors">
                      <Heart className="w-6 h-6" />
                    </Button>
                    <Button variant="outline" className="rounded-2xl h-14 w-14 border-2 p-0 hover:bg-indigo-50 hover:text-indigo-500 hover:border-indigo-100 transition-colors">
                      <Share2 className="w-6 h-6" />
                    </Button>
                    <Button className="rounded-2xl h-14 px-8 font-black gap-2 shadow-lg shadow-primary/10">
                      <Calendar className="w-5 h-5" />
                      Plan to Schedule
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
