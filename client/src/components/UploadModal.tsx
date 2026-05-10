"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Image as ImageIcon, Upload, Loader2, Sparkles, CheckCircle2, AlertCircle, X, Shirt } from "lucide-react"
import { wardrobeApi } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UploadModal({ open, onOpenChange, onSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [step, setStep] = useState<"upload" | "analyzing" | "result">("upload")
  const [analysis, setAnalysis] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setStep("analyzing")
    
    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("userId", "mock-user-id")

      const res = await wardrobeApi.upload(formData)
      setAnalysis(res.data)
      setStep("result")
    } catch (error) {
      console.error("Upload failed:", error)
      setStep("upload")
    } finally {
      setIsUploading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setStep("upload")
    setAnalysis(null)
    onOpenChange(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isUploading && onOpenChange(val)}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-[#EEECE8] shadow-xl rounded-2xl bg-white">
        <div className="relative h-1 bg-[#F5F2EE]">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ 
              width: step === "upload" ? "33%" : step === "analyzing" ? "66%" : "100%" 
            }}
          />
        </div>

        <div className="p-10">
          <AnimatePresence mode="wait">
            {step === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tight">Add to Collection</h2>
                  <p className="text-muted-foreground font-semibold">Upload an image and let AI handle the heavy lifting.</p>
                </div>

                <div 
                  className={cn(
                    "relative aspect-video rounded-xl border border-dashed flex flex-col items-center justify-center transition-all duration-500 overflow-hidden group",
                    preview ? "border-[#7C6FCD]/50 bg-[#7C6FCD]/5" : "border-[#EEECE8] hover:border-[#7C6FCD]/30"
                  )}
                >
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-[#F5F2EE] rounded-xl flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                        <Upload className="w-6 h-6 text-[#888885]" />
                      </div>
                      <p className="text-lg font-medium text-[#1A1A1A]">Drop your image here</p>
                      <p className="text-[#888885] mt-2 text-sm">PNG, JPG or WebP up to 10MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>

                <Button 
                  className="w-full h-12 rounded-xl text-sm font-medium bg-[#7C6FCD] hover:bg-[#7C6FCD]/90 text-white"
                  disabled={!file}
                  onClick={handleUpload}
                >
                  Start AI Analysis
                </Button>
              </motion.div>
            )}

            {step === "analyzing" && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-8"
              >
                <div className="relative">
                  <motion.div 
                    className="w-32 h-32 rounded-full border-4 border-primary/20"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  />
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Sparkles className="w-12 h-12 text-primary" />
                  </motion.div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black">Analyzing your style...</h3>
                  <p className="text-muted-foreground text-lg font-semibold px-12">
                    Our AI vision model is identifying category, color, material, and seasonal suitability.
                  </p>
                </div>
              </motion.div>
            )}

            {step === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#EEECE8] shrink-0">
                    <img src={preview!} className="w-full h-full object-cover" alt="Uploaded" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#7C6FCD] uppercase block mb-2">
                       Analysis Complete
                    </span>
                    <h3 className="text-2xl font-medium tracking-tight capitalize text-[#1A1A1A]">It's a {analysis?.category}!</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border space-y-2">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Category</p>
                    <p className="text-lg font-bold capitalize">{analysis?.category}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border space-y-2">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Seasonal Vibe</p>
                    <p className="text-lg font-bold capitalize">{analysis?.season}</p>
                  </div>
                  <div className="col-span-2 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border space-y-2">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Metadata Tags</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {analysis?.tags?.map((tag: any, i: number) => (
                        <span key={i} className="px-3 py-1 bg-white dark:bg-black rounded-full text-xs font-bold shadow-sm border">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full h-12 rounded-xl text-sm font-medium bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white mt-4"
                  onClick={reset}
                >
                  Save to Wardrobe
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
