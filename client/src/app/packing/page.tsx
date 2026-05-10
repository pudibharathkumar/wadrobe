import { Card } from "@/components/ui/card"
import { Plane, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PackingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Packing</h1>
          <p className="text-[#888885] mt-1">Organize your items and create lists for your upcoming trips.</p>
        </div>
        <Button className="rounded-full bg-[#7C6FCD] hover:bg-[#6A5EBA] text-white font-medium border-0 px-6">
          <Plus className="w-4 h-4 mr-2" />
          New Trip
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="rounded-[16px] border border-dashed border-[#CCCCCC] bg-transparent p-12 shadow-none flex flex-col items-center justify-center min-h-[300px] cursor-pointer hover:bg-white transition-colors group">
          <div className="w-12 h-12 rounded-full bg-[#7C6FCD]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plane className="w-5 h-5 text-[#7C6FCD]" />
          </div>
          <h3 className="text-[15px] font-semibold text-[#1A1A1A]">Plan your next trip</h3>
          <p className="text-[13px] text-[#888885] mt-1 text-center max-w-[200px]">Create a packing list and never forget your essentials again.</p>
        </Card>
      </div>
    </div>
  )
}
